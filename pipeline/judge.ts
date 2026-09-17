/**
 * Judge enriched repos with Jev. One systemOne call per repo, all questions in parallel.
 * Appends to data/judgments.jsonl (immutable log; latest per (repo, qset) wins downstream).
 */

import { createHash } from 'node:crypto'
import { readdirSync } from 'node:fs'
import { join } from 'node:path'
import { TypeSafeClient } from '@typesafe-ai/sdk'
import type { Enriched } from './enrich.js'
import { appendJsonl, arg, DATA, readJson, readJsonl } from './lib/store.js'
import { QSET, questions } from './questions.v2.js'

const OUT = join(DATA, 'judgments.jsonl')
const MODEL = 'jev-latest'

export type Judgment = {
  repo: string
  qset: string
  model: string
  judged_at: string
  state_hash: string
  latency_ms: number
  usage: any
  answers: Record<string, any>
}

function buildState(e: Enriched) {
  return {
    repo: {
      full_name: e.repo,
      description: e.description,
      topics: e.topics,
      language: e.language,
      stars: e.stars,
      created_at: e.created_at,
      pushed_at: e.pushed_at,
      owner_type: e.owner_type,
      is_official_typesafe_org: e.is_official_org,
      license: e.license,
      homepage: e.homepage,
    },
    readme_excerpt: e.readme_excerpt,
    readme_headings: e.readme_headings,
    readme_total_chars: e.readme_chars,
    files_top: e.files_top,
    manifests_found: e.manifests_found,
    manifest_mentions_typesafe: e.manifest_mentions_typesafe,
    has_tests: e.has_tests,
    has_ci: e.has_ci,
    code_evidence: e.code_evidence.length
      ? `GitHub code search found these strings in the repo: ${e.code_evidence.join(', ')}`
      : 'No code-search evidence of TypeSafe SDK usage was found (may still use it).',
    context:
      "TypeSafe AI released Jev, a 'System One' decision model, on 2026-09-15. It answers typed Choice / Noul / Score questions over a JSON state with calibrated probabilities instead of generating text. Many repositories were created within days of launch; some are substantive, many are quick experiments, and some only match the keyword 'typesafe' (generic type-safety libraries) or 'jev' by coincidence.",
  }
}

async function main() {
  const limit = Number(arg('limit') ?? Infinity)
  const force = arg('force') === 'true'
  const only = arg('repos')?.split(',')
  const concurrency = Number(arg('concurrency') ?? 4)
  const minStars = Number(arg('minStars') ?? 0)

  const client = new TypeSafeClient()
  const prior = readJsonl<Judgment>(OUT).filter(j => j.qset === QSET)
  const priorByRepo = new Map<string, Judgment>()
  for (const j of prior) priorByRepo.set(j.repo, j) // last write wins

  const files = readdirSync(join(DATA, 'enriched')).filter(f => f.endsWith('.json'))
  let items = files
    .map(f => readJson<Enriched>(join(DATA, 'enriched', f), null as any))
    .filter(Boolean)
  if (only) items = items.filter(e => only.includes(e.repo))
  items = items.filter(e => e.stars >= minStars)
  items.sort((a, b) => b.stars - a.stars)

  const todo = items
    .filter(e => {
      const h = createHash('sha1')
        .update(JSON.stringify(buildState(e)))
        .digest('hex')
        .slice(0, 12)
      const p = priorByRepo.get(e.repo)
      return force || !p || p.state_hash !== h
    })
    .slice(0, limit)
  console.error(
    `== judging ${todo.length} repos (qset ${QSET}, ${items.length - todo.length} unchanged)`,
  )

  let i = 0,
    ok = 0,
    fail = 0
  const worker = async () => {
    while (i < todo.length) {
      const e = todo[i++]
      const state = buildState(e)
      const state_hash = createHash('sha1').update(JSON.stringify(state)).digest('hex').slice(0, 12)
      const t0 = Date.now()
      try {
        const res: any = await client.systemOne({ model: MODEL, state, questions } as any)
        const j: Judgment = {
          repo: e.repo,
          qset: QSET,
          model: res.model ?? MODEL,
          judged_at: new Date().toISOString(),
          state_hash,
          latency_ms: Date.now() - t0,
          usage: res.usage ?? null,
          answers: res.answers,
        }
        appendJsonl(OUT, [j])
        ok++
        const a = j.answers
        console.error(
          `  ${e.repo.padEnd(45)} genuine=${a.genuine.noul.toFixed(2)} cat=${a.category.choice}(${a.category.confidence.toFixed(2)}) sub=${a.substance.score.toFixed(1)} ${j.latency_ms}ms`,
        )
      } catch (err: any) {
        fail++
        console.error(`  FAIL ${e.repo}: ${err?.message ?? err}`)
      }
    }
  }
  await Promise.all(Array.from({ length: concurrency }, worker))
  console.error(`== done ok=${ok} fail=${fail}`)
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
