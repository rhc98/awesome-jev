export type Status = 'listed' | 'review' | 'excluded'

export interface JevJudgment {
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

/** The slice of an entry the directory list needs; what public/data files carry. */
export interface EntryLite {
  repo: string
  name: string
  description: string | null
  language: string | null
  stars: number
  created: string
  pushed: string
  category: string
  category_uncertain: boolean
  pattern: string
  status: Status
  status_reason: string
  readme_pick: boolean
  jev: Pick<JevJudgment, 'genuine' | 'substance' | 'category_conf' | 'composite'>
}

export interface Entry extends EntryLite {
  site: string | null
  license: string | null
  is_official: boolean
  jev: JevJudgment
  override: Record<string, unknown> | string | null
  sources: string[]
}

export interface Stats {
  total: number
  listed: number
  review: number
  excluded: number
  readme_picks: number
  by_category: Record<string, number>
  overrides?: number
}

export interface Curated {
  generated_at: string
  policy: Record<string, unknown>
  stats: Stats
  entries: Entry[]
}

/** Written by scripts/sync-data.mjs; small enough to ship in the client bundle. */
export interface ClientManifest {
  generated_at: string
  stats: Stats
  policy: {
    listed_min: number | null
    substance_min: number | null
    category_uncertain_below: number | null
  }
  facets: { categories: string[]; patterns: string[]; languages: string[] }
  category_counts: Record<Status, Record<string, number>>
  files: Record<Status, string>
}

export interface GateSweepRow {
  thr: number
  TP: number
  FP: number
  FN: number
  TN: number
  prec: number
  rec: number
  f1: number
}

export interface Calibration {
  qset: string
  computed_at?: string
  n: number
  gate_listed_min?: number
  gate_sweep: GateSweepRow[]
  category_agreement: number | null
  category?: {
    n: number
    agreement: number | null
    confusion: { human: string; jev: string; count: number }[]
    reliability: { lo: number; hi: number; n: number; acc: number }[]
  }
  substance?: { n: number; spearman: number; mae: number } | null
  disagreements?: { repo: string; jev: number; human: boolean; note: string }[]
  cost?: {
    calls: number
    repos: number
    input_tokens_total: number
    input_tokens_mean: number
    output_tokens_mean: number
    latency_p50_ms: number | null
    latency_p90_ms: number | null
    usd_per_1m_input: number
    usd_est: number
  }
  qset_diff?: {
    prev: string
    n: number
    rows: { metric: string; prev: number | null; current: number | null }[]
  } | null
}
