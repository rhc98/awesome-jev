/**
 * Apply policy to latest judgments → data/curated.json. Pure code; no inference.
 * Tweak thresholds/weights here and re-run without re-judging.
 */

import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse as parseYaml } from 'yaml'
import type { RepoMeta } from './enrich.js'
import type { Judgment } from './judge.js'
import { DATA, readJsonl, writeJson } from './lib/store.js'
import { type CATEGORIES, QSET } from './questions.v2.js'

export const POLICY = {
  qset: QSET,
  // Goldset v2 (80 repos, 2026-09-18): no false positives at genuine ≥0.5; 0.6→0.5 lifts recall 0.79→0.84
  // with precision 1.00. 0.4 admits the first noise (a file-less repo at 0.44). See data/calibration.json.
  gate: {
    listed_min: 0.5,
    review_min: 0.3,
    category_conf_min: 0.5,
    meta_list_min: 0.7,
    reimpl_min: 0.7,
  },
  weights: { substance: 0.45, docs: 0.25, novelty: 0.3 },
  star_bonus_max: 0.1, // log1p(stars)/log1p(1000) * this
  readme_top_per_category: 15,
}

type Override = {
  status?: 'listed' | 'review' | 'excluded'
  category?: keyof typeof CATEGORIES
  reason: string
  by?: string
}

export type Entry = {
  repo: string
  name: string
  description: string | null
  site: string | null
  language: string | null
  stars: number
  created: string
  pushed: string
  license: string | null
  is_official: boolean
  category: string
  pattern: string
  status: 'listed' | 'review' | 'excluded'
  status_reason: string
  readme_pick: boolean
  jev: {
    genuine: number
    runtime_use: number
    is_meta_list: number
    is_reimpl: number
    category_p: number
    category_conf: number
    category_probs: Record<string, number>
    pattern_conf: number
    substance: number
    docs: number
    novelty: number
    composite: number
    model: string
    qset: string
    judged_at: string
  }
  override: Override | null
  sources: string[]
}

function main() {
  const judgments = readJsonl<Judgment>(join(DATA, 'judgments.jsonl')).filter(j => j.qset === QSET)
  const latest = new Map<string, Judgment>()
  for (const j of judgments) latest.set(j.repo, j)
  const ovFile = join(DATA, 'overrides.yaml')
  const overrides: Record<string, Override> = existsSync(ovFile)
    ? (parseYaml(readFileSync(ovFile, 'utf8')) ?? {})
    : {}

  // Slim committed metadata (no README text) so this step runs in CI without the enrich cache.
  const meta = new Map(readJsonl<RepoMeta>(join(DATA, 'repos.jsonl')).map(m => [m.repo, m]))
  const entries: Entry[] = []
  for (const [repo, j] of latest) {
    const e = meta.get(repo)
    if (!e) continue
    const a = j.answers
    const norm = (s: number) => s / 3 // 4-level scores → 0..1
    let composite =
      POLICY.weights.substance * norm(a.substance.score) +
      POLICY.weights.docs * norm(a.docs.score) +
      POLICY.weights.novelty * norm(a.novelty.score)
    composite += (Math.log1p(e.stars) / Math.log1p(1000)) * POLICY.star_bonus_max
    composite = Math.min(1, composite)

    const genuine = a.genuine.noul
    const isMeta = a.is_meta_list.noul >= POLICY.gate.meta_list_min
    const isReimpl = a.is_reimpl.noul >= POLICY.gate.reimpl_min
    let category: string = e.is_official_org
      ? 'official'
      : isReimpl
        ? 'research_eval'
        : a.category.choice
    if (isMeta) category = 'meta_list'

    let status: Entry['status']
    let reason: string
    if (e.is_official_org) {
      status = 'listed'
      reason = 'official typesafe-ai org'
    } else if (isMeta) {
      status = 'listed'
      reason = `meta list (is_meta_list ${a.is_meta_list.noul.toFixed(2)})`
    } else if (
      genuine >= POLICY.gate.listed_min &&
      a.category.confidence >= POLICY.gate.category_conf_min
    ) {
      status = 'listed'
      reason = 'gate passed'
    } else if (genuine >= POLICY.gate.review_min) {
      status = 'review'
      reason =
        genuine < POLICY.gate.listed_min
          ? `genuine ${genuine.toFixed(2)} below ${POLICY.gate.listed_min}`
          : `category confidence ${a.category.confidence.toFixed(2)} below ${POLICY.gate.category_conf_min}`
    } else {
      status = 'excluded'
      reason = `genuine ${genuine.toFixed(2)} below ${POLICY.gate.review_min}`
    }
    const ov = overrides[repo] ?? null
    if (ov?.status) {
      status = ov.status
      reason = `override: ${ov.reason}`
    }
    if (ov?.category) category = ov.category

    entries.push({
      repo,
      name: e.name,
      description: e.description,
      site: e.homepage,
      language: e.language,
      stars: e.stars,
      created: e.created_at.slice(0, 10),
      pushed: e.pushed_at.slice(0, 10),
      license: e.license,
      is_official: e.is_official_org,
      category,
      pattern: a.pattern.choice,
      status,
      status_reason: reason,
      readme_pick: false,
      jev: {
        genuine,
        runtime_use: a.runtime_use.noul,
        is_meta_list: a.is_meta_list.noul,
        is_reimpl: a.is_reimpl.noul,
        category_p: a.category.probabilities[a.category.choice],
        category_conf: a.category.confidence,
        category_probs: a.category.probabilities,
        pattern_conf: a.pattern.confidence,
        substance: a.substance.score,
        docs: a.docs.score,
        novelty: a.novelty.score,
        composite: Number(composite.toFixed(3)),
        model: j.model,
        qset: j.qset,
        judged_at: j.judged_at,
      },
      override: ov,
      sources: e.sources,
    })
  }

  // README picks: top N per category among listed, by composite
  const byCat = new Map<string, Entry[]>()
  for (const en of entries)
    if (en.status === 'listed')
      (byCat.get(en.category) ?? byCat.set(en.category, []).get(en.category)!).push(en)
  for (const list of byCat.values()) {
    list.sort((a, b) => b.jev.composite - a.jev.composite)
    for (const en of list.slice(0, POLICY.readme_top_per_category)) en.readme_pick = true
  }
  entries.sort((a, b) => b.jev.composite - a.jev.composite)

  const stats = {
    total: entries.length,
    listed: entries.filter(e => e.status === 'listed').length,
    review: entries.filter(e => e.status === 'review').length,
    excluded: entries.filter(e => e.status === 'excluded').length,
    readme_picks: entries.filter(e => e.readme_pick).length,
    by_category: Object.fromEntries([...byCat].map(([k, v]) => [k, v.length])),
    overrides: Object.keys(overrides).length,
  }
  // Derived from data, not the wall clock, so CI can regenerate and diff byte-for-byte.
  const generated_at =
    [...latest.values()]
      .map(j => j.judged_at)
      .sort()
      .at(-1) ?? ''
  writeJson(join(DATA, 'curated.json'), {
    generated_at,
    policy: POLICY,
    stats,
    entries,
  })
  console.error(`== curated: ${JSON.stringify(stats)}`)
}

main()
