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

export interface Entry {
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
  status: Status
  status_reason: string
  readme_pick: boolean
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
  gate_sweep: GateSweepRow[]
  category_agreement: number
}
