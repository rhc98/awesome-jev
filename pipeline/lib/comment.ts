/**
 * Issue comments the bot posts back to submitters. Every string here is rendered from
 * data/curated.json, never from the issue body, so nothing a stranger typed is echoed
 * into a comment.
 */
import type { Entry } from '../curate.js'
import { REPO, SITE, sectionTitle } from './sections.js'

/**
 * Thresholds come from the `policy` block curate.ts stamps into curated.json, not from
 * importing POLICY — curate.ts curates on import, and a comment should quote the policy that
 * produced the verdict it is reporting rather than whatever the source says today.
 */
export type Policy = {
  gate: { listed_min: number; review_min: number; substance_min: number }
  readme_top_per_category: number
}

export type Curated = {
  generated_at: string
  policy: Policy
  stats: Record<string, any>
  entries: Entry[]
}

export const SUBMIT_TEMPLATE = `https://github.com/${REPO}/issues/new?template=submit.yml`
export const WRONG_TEMPLATE = `https://github.com/${REPO}/issues/new?template=jev-got-it-wrong.yml`

/**
 * Hidden tag so a reopened issue is not answered twice. Kinds are distinct because a stall
 * notice must not suppress the verdict that eventually follows it.
 */
export type MarkerKind = 'verdict' | 'stalled'
export const marker = (kind: MarkerKind, repo: string) =>
  `<!-- awesome-jev:${kind} repo=${repo} -->`

const entryUrl = (repo: string) => `${SITE}/r/${repo}`

/**
 * The composite a repo needs to reach the README in its category: the score of the last
 * entry that fits inside POLICY.readme_top_per_category. Null when the category is not yet
 * full, which is the only case where "not in the README" needs no number to explain it.
 */
function readmeCutoff(cur: Curated, category: string): number | null {
  const top = cur.policy.readme_top_per_category
  const scores = cur.entries
    .filter(e => e.status === 'listed' && e.category === category)
    .map(e => e.jev.composite)
    .sort((a, b) => b - a)
  return scores.length < top ? null : (scores[top - 1] ?? null)
}

/**
 * Listing on the site and inclusion in the README are different things — the README carries
 * only the top entries per category — and that is the distinction submitters ask about, so
 * every verdict states both explicitly.
 */
function placement(e: Entry, cur: Curated): string[] {
  const title = sectionTitle(e.category)
  if (e.status === 'excluded')
    return [
      `- **On the site:** as an excluded entry, ${entryUrl(e.repo)}`,
      '- **In this README:** no.',
    ]

  const site =
    e.status === 'review'
      ? `- **On the site:** in the [review queue](${SITE}/review) with its scores, ${entryUrl(e.repo)}`
      : `- **On the site:** yes, ${entryUrl(e.repo)}`

  if (e.readme_pick) return [site, `- **In this README:** yes, under *${title}*.`]

  if (e.status === 'review')
    return [site, '- **In this README:** no. The README carries listed entries only.']

  const cutoff = readmeCutoff(cur, e.category)
  // Three decimals: a category cut-off and the repo that just missed it routinely agree to
  // two, and "you scored 0.78, the cut-off is 0.78" reads as a mistake rather than a margin.
  const why =
    cutoff === null
      ? `*${title}* has room, so it should appear on the next build.`
      : `the README carries the top ${cur.policy.readme_top_per_category} by composite in each category, and *${title}* currently cuts off at ${cutoff.toFixed(3)}, against this repository's ${e.jev.composite.toFixed(3)}.`
  return [site, `- **In this README:** not yet — ${why}`]
}

function verdictLine(e: Entry): string {
  const title = sectionTitle(e.category)
  const what =
    e.status === 'listed'
      ? `**listed** under *${title}*`
      : e.status === 'review'
        ? `held for **review** under *${title}*`
        : '**excluded**'
  return `**Judged.** [${e.repo}](https://github.com/${e.repo}) — ${what}.`
}

/**
 * The gate is two conditions. Category confidence is deliberately not one of them
 * (see the comment on POLICY.category_uncertain_below), so it is reported as context
 * rather than as something the repo passed or failed.
 */
function scores(e: Entry, gate: Policy['gate']): string[] {
  const j = e.jev
  // genuine is a probability and substance/docs/novelty are 4-level scores, so the two are
  // split across lines: printing them in one row invites reading 2.20 as a probability.
  const out = [
    `genuine ${j.genuine.toFixed(2)} · composite ${j.composite.toFixed(3)}`,
    `substance ${j.substance.toFixed(2)} · docs ${j.docs.toFixed(2)} · novelty ${j.novelty.toFixed(2)} (each scored 0–3)`,
    `Gate: listed at genuine >= ${gate.listed_min.toFixed(2)} and substance >= ${gate.substance_min.toFixed(2)}; held for review at genuine >= ${gate.review_min.toFixed(2)}.`,
  ]
  if (e.status !== 'listed') out.push(`Reason recorded: \`${e.status_reason}\``)
  if (e.override)
    out.push(
      `A human override applies: ${e.override.reason}${e.override.by ? ` (by ${e.override.by})` : ''}`,
    )
  return out
}

/** The full verdict comment for a repo that has been judged. */
export function renderVerdict(e: Entry, cur: Curated): string {
  return [
    marker('verdict', e.repo),
    verdictLine(e),
    '',
    ...scores(e, cur.policy.gate),
    '',
    ...placement(e, cur),
    '',
    `Judged ${e.jev.judged_at.slice(0, 10)} · model \`${e.jev.model}\` · question set \`${e.jev.qset}\`. Scores and placement are as of ${cur.generated_at.slice(0, 10)} and are recomputed daily; the site is always current.`,
    '',
    `Think this is wrong? Open a [Jev got it wrong](${WRONG_TEMPLATE}) issue with the file or behavior that shows the right answer.`,
  ].join('\n')
}

/** Accepted, waiting for the next run to judge it. */
export function renderQueued(repo: string): string {
  return [
    `Queued. [${repo}](https://github.com/${repo}) is now a discovery candidate.`,
    '',
    'The next daily run that starts after this comment will enrich and judge it, and a verdict will be posted here. Runs start at 06:00 UTC, so this usually takes under a day.',
    '',
    'Seeding only puts the repository in front of Jev. Whether it is listed is still Jev’s call, and the verdict will say which way it went and why.',
  ].join('\n')
}

/** Rejected at intake, before anything was written. */
export function renderRejected(reason: string): string {
  return [
    `Cannot queue this one: ${reason}`,
    '',
    `If that is wrong, or the repository has changed since, open a fresh [submission](${SUBMIT_TEMPLATE}).`,
  ].join('\n')
}

/** Already queued by an earlier issue. */
export function renderDuplicate(repo: string, issue: number): string {
  return `[${repo}](https://github.com/${repo}) is already queued by #${issue}, which is where the verdict will be posted. Closing this as a duplicate.`
}

/** Seeded, but discovery could not keep it. */
export function renderDropped(repo: string, reason: string): string {
  return [
    marker('verdict', repo),
    `Dropped before judging: ${reason}`,
    '',
    'Discovery rechecks every candidate on each run and drops the ones it cannot keep. Nothing was judged, so there is no verdict to report.',
  ].join('\n')
}

/** Seeded days ago and still not judged. */
export function renderStalled(repo: string, days: number): string {
  return [
    marker('stalled', repo),
    `Still waiting. [${repo}](https://github.com/${repo}) was queued ${days} days ago and no judgment has landed yet.`,
    '',
    'Discovery has it as a candidate, so it is not lost, but something downstream is not finishing. Leaving this open for a maintainer to look at.',
  ].join('\n')
}
