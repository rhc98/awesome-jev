// Helpers and constants that client components may import. Must never import the
// full curated data: anything reachable from a 'use client' module ships in the
// browser bundle. Policy values come from the small generated client manifest.
import manifestJson from '@/generated/client-manifest.json'
import type { ClientManifest } from './types'

export const manifest = manifestJson as unknown as ClientManifest

/** Policy thresholds; every verdict bar draws its tick from these. Never hard-code one. */
const numberOr = (value: number | null | undefined, fallback: number) =>
  typeof value === 'number' ? value : fallback
export const GATE = numberOr(manifest.policy.listed_min, 0.6)
export const SUBSTANCE_GATE = numberOr(manifest.policy.substance_min, 0.5)
/** Not a gate. Below this the category is labelled uncertain and the entry is listed anyway. */
export const CATEGORY_UNCERTAIN_BELOW = numberOr(manifest.policy.category_uncertain_below, 0.5)

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

export const ISSUE_TEMPLATE_URL =
  'https://github.com/rhc98/awesome-jev/issues/new?template=jev-got-it-wrong.yml'

export const REPO_URL = 'https://github.com/rhc98/awesome-jev'
