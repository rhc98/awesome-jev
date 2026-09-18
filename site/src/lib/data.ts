import calibrationJson from '@/generated/calibration.json'
import curatedJson from '@/generated/curated.json'
import type { Calibration, Curated, Entry } from './types'

export const curated = curatedJson as unknown as Curated

export const calibration = (calibrationJson as unknown as Calibration | null) ?? null

export const entries: Entry[] = curated.entries

/** Policy gates; every verdict bar draws its tick from these. Never hard-code a threshold. */
const gates = (curated.policy as { gate?: Record<string, unknown> } | undefined)?.gate ?? {}
const gateOf = (key: string, fallback: number) =>
  typeof gates[key] === 'number' ? (gates[key] as number) : fallback
export const GATE = gateOf('listed_min', 0.6)
export const CATEGORY_GATE = gateOf('category_conf_min', 0.5)
export const SUBSTANCE_GATE = gateOf('substance_min', 0.5)

export const CATEGORY_LABELS: Record<string, string> = {
  official: 'Official',
  sdk_client: 'SDKs and Clients',
  integration: 'Integrations',
  agent_tooling: 'Agent and Dev Tooling',
  application: 'Applications',
  game_sim: 'Games and Simulation',
  research_eval: 'Research and Evals',
  learning: 'Learning',
  meta_list: 'Other Lists',
  other: 'Other',
}

export const STATUS_LABELS: Record<string, string> = {
  listed: 'Listed',
  review: 'Review',
  excluded: 'Excluded',
}

export function humanize(value: string): string {
  return value
    .split(/[_-]/)
    .filter(Boolean)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function categoryLabel(value: string): string {
  return CATEGORY_LABELS[value] ?? humanize(value)
}

export function patternLabel(value: string): string {
  return humanize(value)
}

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

export function splitRepo(repo: string): { owner: string; name: string } {
  const [owner, ...rest] = repo.split('/')
  return { owner, name: rest.join('/') }
}

export function entryHref(repo: string): string {
  const { owner, name } = splitRepo(repo)
  return `/r/${owner}/${name}`
}

export function githubUrl(repo: string): string {
  return `https://github.com/${repo}`
}

export function homepageUrl(site: string | null): string | null {
  if (!site) return null
  const trimmed = site.trim()
  if (!trimmed) return null
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

export function findEntry(owner: string, name: string): Entry | undefined {
  return entries.find(e => e.repo === `${owner}/${name}`)
}

export const ISSUE_TEMPLATE_URL =
  'https://github.com/rhc98/awesome-jev/issues/new?template=jev-got-it-wrong.yml'

export const REPO_URL = 'https://github.com/rhc98/awesome-jev'
