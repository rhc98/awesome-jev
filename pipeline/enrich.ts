/**
 * Enrich candidates with README excerpt, file listing, manifest evidence.
 * Writes data/enriched/<owner>__<name>.json (cached; refreshed when pushed_at changes or --force).
 */

import { existsSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import type { Candidate } from './discover.js'
import { gh } from './lib/github.js'
import { arg, DATA, readJson, readJsonl, repoKey, writeJson, writeJsonl } from './lib/store.js'

const README_CHARS = 5000
const MANIFESTS = [
  'package.json',
  'pyproject.toml',
  'requirements.txt',
  'Cargo.toml',
  'go.mod',
  'Gemfile',
  'build.sbt',
  'composer.json',
  'Package.swift',
  'mix.exs',
  'pom.xml',
  'build.gradle',
  'deno.json',
  'bun.lockb',
]

export type Enriched = {
  repo: string
  enriched_at: string
  pushed_at: string
  name: string
  owner: string
  owner_type: string
  is_official_org: boolean
  description: string | null
  topics: string[]
  language: string | null
  stars: number
  forks: number
  created_at: string
  homepage: string | null
  license: string | null
  readme_chars: number
  readme_excerpt: string
  readme_headings: string[]
  files_top: string[]
  manifests_found: string[]
  manifest_mentions_typesafe: string[]
  has_tests: boolean
  has_ci: boolean
  code_evidence: string[]
  sources: string[]
}

function headings(md: string): string[] {
  return md
    .split('\n')
    .filter(l => /^#{1,3}\s/.test(l))
    .map(l => l.replace(/^#+\s*/, '').trim())
    .slice(0, 40)
}

async function enrichOne(c: Candidate): Promise<Enriched | null> {
  const [owner, name] = c.repo.split('/')
  const repo = await gh<any>(`/repos/${c.repo}`, {}, { allow404: true })
  if (!repo) return null
  const readme =
    (await gh<string>(
      `/repos/${c.repo}/readme`,
      {},
      { accept: 'application/vnd.github.raw+json', raw: true, allow404: true },
    )) ?? ''
  const tree = await gh<{ tree: { path: string; type: string }[] }>(
    `/repos/${c.repo}/git/trees/${repo.default_branch}`,
    {},
    { allow404: true },
  )
  const paths = (tree?.tree ?? []).map(t => t.path)
  const manifests = MANIFESTS.filter(m => paths.includes(m))
  const mentions: string[] = []
  for (const m of manifests.slice(0, 3)) {
    if (m.endsWith('.lockb')) continue
    const body = await gh<string>(
      `/repos/${c.repo}/contents/${m}`,
      {},
      { accept: 'application/vnd.github.raw+json', raw: true, allow404: true },
    )
    if (body && /typesafe/i.test(body)) mentions.push(m)
  }
  return {
    repo: c.repo,
    enriched_at: new Date().toISOString(),
    pushed_at: repo.pushed_at,
    name,
    owner,
    owner_type: repo.owner.type,
    is_official_org: owner.toLowerCase() === 'typesafe-ai',
    description: repo.description,
    topics: repo.topics ?? [],
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    created_at: repo.created_at,
    homepage: repo.homepage || null,
    license: repo.license?.spdx_id ?? null,
    readme_chars: readme.length,
    readme_excerpt: readme.slice(0, README_CHARS),
    readme_headings: headings(readme),
    files_top: paths.slice(0, 40),
    manifests_found: manifests,
    manifest_mentions_typesafe: mentions,
    has_tests:
      paths.some(p => /^(tests?|__tests__|spec)$/i.test(p)) ||
      paths.some(p => /\.(test|spec)\.[jt]sx?$/.test(p)),
    has_ci: paths.includes('.github'),
    code_evidence: c.evidence,
    sources: c.sources,
  }
}

async function main() {
  const limit = Number(arg('limit') ?? Infinity)
  const force = arg('force') === 'true'
  const only = arg('repos')?.split(',')
  let cands = readJsonl<Candidate>(join(DATA, 'candidates.jsonl'))
  if (only) cands = cands.filter(c => only.includes(c.repo))
  let done = 0,
    skipped = 0,
    gone = 0
  for (const c of cands) {
    if (done >= limit) break
    const file = join(DATA, 'enriched', repoKey(c.repo) + '.json')
    if (!force && existsSync(file)) {
      const prev = readJson<Enriched>(file, null as any)
      const sameEvidence = JSON.stringify(prev?.code_evidence ?? []) === JSON.stringify(c.evidence)
      const sameSources = JSON.stringify(prev?.sources ?? []) === JSON.stringify(c.sources)
      if (prev && prev.pushed_at === c.meta.pushed_at && sameEvidence && sameSources) {
        skipped++
        continue
      }
    }
    let e: Enriched | null = null
    try {
      e = await enrichOne(c)
    } catch (err) {
      console.error(`  skip ${c.repo}: ${(err as Error).message.slice(0, 120)}`)
    }
    if (!e) {
      // The repo 404s now. Its cached file would otherwise keep feeding repos.jsonl, so the
      // count reported below was only ever cosmetic.
      rmSync(file, { force: true })
      gone++
      continue
    }
    writeJson(file, e)
    done++
    if (done % 25 === 0) console.error(`  enriched ${done}`)
  }
  console.error(`== enriched ${done}, cached ${skipped}, gone ${gone}`)
  // writeRepoMeta rebuilds repos.jsonl from the whole enriched directory, so it is only
  // correct after a run that considered every candidate. A scoped run leaves the rest of the
  // cache untouched — and on a fresh clone the cache holds just the handful of repos this run
  // fetched, which would rewrite the committed repos.jsonl down to those rows and take
  // curated.json and the README with it. Scoped runs are for inspecting one repo; the next
  // unscoped run regenerates the metadata.
  if (only || Number.isFinite(limit)) {
    console.error(
      '== repos.jsonl left alone (scoped run); use an unscoped `pnpm enrich` to rebuild it',
    )
    return
  }
  writeRepoMeta()
}

/** Slim, committed view of enriched data (no README text) so curate can run in CI without the cache. */
export type RepoMeta = Omit<Enriched, 'readme_excerpt' | 'readme_headings' | 'files_top'>

export function writeRepoMeta() {
  const dir = join(DATA, 'enriched')
  // candidates.jsonl is the live set. The enriched directory is a cache and is never pruned
  // wholesale, so filtering by it is what carries a discover-side drop through to repos.jsonl,
  // curated.json, and the README — without it a deleted repo stays linked forever.
  const live = new Set(readJsonl<Candidate>(join(DATA, 'candidates.jsonl')).map(c => c.repo))
  const all: RepoMeta[] = readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => readJson<Enriched>(join(dir, f), null as any))
    .filter(Boolean)
    .map(({ readme_excerpt: _r, readme_headings: _h, files_top: _f, ...meta }) => meta)
  const rows = all.filter(m => live.has(m.repo)).sort((a, b) => a.repo.localeCompare(b.repo))
  writeJsonl(join(DATA, 'repos.jsonl'), rows)
  const stale = all.length - rows.length
  console.error(
    `== repos.jsonl: ${rows.length} rows${stale ? ` (${stale} stale cached repos held back)` : ''}`,
  )
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
