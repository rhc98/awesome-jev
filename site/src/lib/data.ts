// Server-only: the full curated file. Client components import '@/lib/shared'.
import 'server-only'
import calibrationJson from '@/generated/calibration.json'
import curatedJson from '@/generated/curated.json'
import type { Calibration, Curated, Entry, EntryLite } from './types'

export * from './shared'

export const curated = curatedJson as unknown as Curated

export const calibration = (calibrationJson as unknown as Calibration | null) ?? null

export const entries: Entry[] = curated.entries

/** Same projection as slim() in scripts/sync-data.mjs; keeps the RSC payload small. */
export function toLite(entry: Entry): EntryLite {
  const { genuine, substance, category_conf, composite } = entry.jev
  return {
    repo: entry.repo,
    name: entry.name,
    description: entry.description,
    language: entry.language,
    stars: entry.stars,
    created: entry.created,
    pushed: entry.pushed,
    category: entry.category,
    category_uncertain: entry.category_uncertain,
    pattern: entry.pattern,
    status: entry.status,
    status_reason: entry.status_reason,
    readme_pick: entry.readme_pick,
    jev: { genuine, substance, category_conf, composite },
  }
}

export function findEntry(owner: string, name: string): Entry | undefined {
  return entries.find(e => e.repo === `${owner}/${name}`)
}
