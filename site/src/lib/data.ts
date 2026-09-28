// Server-only: the full curated file. Client components import '@/lib/shared'.
import calibrationJson from '@/generated/calibration.json'
import curatedJson from '@/generated/curated.json'
import type { Calibration, Curated, Entry } from './types'

export * from './shared'

export const curated = curatedJson as unknown as Curated

export const calibration = (calibrationJson as unknown as Calibration | null) ?? null

export const entries: Entry[] = curated.entries

/** Unique values in first-seen order, sorted by frequency then name. */
function facet(values: (string | null)[]): string[] {
  const counts = new Map<string, number>()
  for (const value of values) {
    if (!value) continue
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value]) => value)
}

export const categories: string[] = facet(entries.map(e => e.category))
export const patterns: string[] = facet(entries.map(e => e.pattern))
export const languages: string[] = facet(entries.map(e => e.language))

export function findEntry(owner: string, name: string): Entry | undefined {
  return entries.find(e => e.repo === `${owner}/${name}`)
}
