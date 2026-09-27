/**
 * Refresh tiers: how often an already-known repo is re-checked against the GitHub REST API.
 *
 * The bot PAT gets 5,000 core calls an hour, and re-checking every known repo every day
 * (discover's existence check, enrich's refetch on each pushed_at change) outgrew it: most of
 * a run's calls went to repos already judged, not to new ones. New repos are always fetched in
 * full; this only spaces out the re-checks of the ones we have, by how much a stale row costs.
 *
 *   A  daily      not yet curated, submitted by issue, README pick, official, or >= STAR_MIN stars
 *   B  weekly     everything else
 *   C  monthly    excluded, 0 stars, and created at least COLD_AGE_DAYS ago
 *
 * A repo's day within its cycle comes from a hash of its name, so each day re-checks an even
 * slice and the same repo lands on the same day every cycle. A missed run delays that slice by
 * one cycle. Tiers read the previous run's data/curated.json, so a repo moves between tiers as
 * its stars or verdict change.
 */
import { join } from 'node:path'
import type { Entry } from '../curate.js'
import type { Candidate } from '../discover.js'
import { DATA, readJson } from './store.js'

export type Tier = 'A' | 'B' | 'C'

const STAR_MIN = 10
const COLD_AGE_DAYS = 14
const CYCLE_DAYS: Record<Tier, number> = { A: 1, B: 7, C: 30 }
const DAY_MS = 86_400_000

export function tierOf(
  sources: string[],
  meta: Pick<Candidate['meta'], 'stargazers_count' | 'created_at'>,
  prev: Entry | undefined,
  now: number,
): Tier {
  if (!prev) return 'A'
  if (sources.some(s => s.startsWith('issue:'))) return 'A'
  const stars = Math.max(prev.stars ?? 0, meta.stargazers_count ?? 0)
  if (prev.readme_pick || prev.is_official || stars >= STAR_MIN) return 'A'
  const created = Date.parse(meta.created_at ?? prev.created)
  const cold = Number.isFinite(created) && now - created >= COLD_AGE_DAYS * DAY_MS
  if (prev.status === 'excluded' && stars === 0 && cold) return 'C'
  return 'B'
}

/** FNV-1a, so a repo's slot is stable across runs and machines. */
function hash(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 0x01000193)
  return h >>> 0
}

export function isDue(repo: string, tier: Tier, now: number): boolean {
  const cycle = CYCLE_DAYS[tier]
  return hash(repo) % cycle === Math.floor(now / DAY_MS) % cycle
}

/**
 * Decides, once per repo, whether today is its re-check day, and tallies the answers so a run
 * can log how the work split. Call `due` at most once per repo per run.
 */
export function refreshPolicy(now = Date.now()) {
  const cur = readJson<{ entries?: Entry[] } | null>(join(DATA, 'curated.json'), null)
  const prev = new Map((cur?.entries ?? []).map(e => [e.repo, e]))
  const tally: Record<Tier, { due: number; total: number }> = {
    A: { due: 0, total: 0 },
    B: { due: 0, total: 0 },
    C: { due: 0, total: 0 },
  }
  return {
    due(repo: string, sources: string[], meta: Candidate['meta']): boolean {
      const tier = tierOf(sources, meta, prev.get(repo), now)
      const due = isDue(repo, tier, now)
      tally[tier].total++
      if (due) tally[tier].due++
      return due
    },
    summary(): string {
      return (Object.keys(tally) as Tier[])
        .map(t => `${t} ${tally[t].due}/${tally[t].total}`)
        .join(', ')
    },
  }
}
