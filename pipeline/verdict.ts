/**
 * Answer open submission issues with the verdict the last run produced.
 * `--issue <n>` (one issue) `--dry-run` (render to stdout, post nothing)
 *
 * Runs after Curate. Writes `<runner temp>/verdict-manifest.tsv`, one
 * `number<TAB>comment-file<TAB>close-reason` row per issue; the workflow posts each file with
 * `gh issue comment --body-file`, so no rendered text is ever passed as a shell argument. An
 * empty close reason means leave the issue open.
 */
import { writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import type { Candidate } from './discover.js'
import type { Curated, MarkerKind } from './lib/comment.js'
import { marker, renderDropped, renderStalled, renderVerdict } from './lib/comment.js'
import { gh, type RepoLite } from './lib/github.js'
import { REPO } from './lib/sections.js'
import { arg, DATA, readJson, readJsonl } from './lib/store.js'
import { readSubmissions } from './lib/submission-file.js'

/** How long a seeded repo may sit unjudged before the issue gets a progress note. */
const STALL_DAYS = 3

/**
 * `close` is spelled for `gh issue close --reason`, which takes `not planned` with a space.
 * The REST API spells it `not_planned`; the CLI rejects that. Empty means leave the issue open.
 */
type Action = { issue: number; body: string; close: '' | 'completed' | 'not planned' }

async function openSubmissionIssues(): Promise<number[]> {
  const items = await gh<{ number: number; pull_request?: unknown }[]>(`/repos/${REPO}/issues`, {
    labels: 'submission',
    state: 'open',
    per_page: 100,
  })
  return (items ?? []).filter(i => !i.pull_request).map(i => i.number)
}

/** True when this issue already carries a bot comment of that kind. */
async function alreadySaid(issue: number, kind: MarkerKind, repo: string): Promise<boolean> {
  const tag = marker(kind, repo)
  const comments = await gh<{ body: string | null }[]>(
    `/repos/${REPO}/issues/${issue}/comments`,
    { per_page: 100 },
    { allow404: true },
  )
  return (comments ?? []).some(c => (c.body ?? '').includes(tag))
}

/** Why discovery could not keep a repo it was told about. */
async function dropReason(repo: string): Promise<string> {
  const meta = await gh<RepoLite>(`/repos/${repo}`, {}, { allow404: true })
  if (!meta) return 'the repository no longer exists, was renamed, or became private.'
  if (meta.fork) return 'the repository is a fork, and forks are out of scope.'
  if (meta.archived)
    return 'the repository is archived, and archived repositories are out of scope.'
  return 'discovery could not keep it as a candidate.'
}

const daysSince = (iso: string) =>
  Math.floor((Date.now() - new Date(`${iso}T00:00:00Z`).getTime()) / 86_400_000)

async function plan(only?: number): Promise<Action[]> {
  const cur = readJson<Curated | null>(join(DATA, 'curated.json'), null)
  if (!cur) throw new Error('data/curated.json missing; run pnpm curate first')

  const subs = readSubmissions()
  const byIssue = new Map(Object.entries(subs).map(([repo, s]) => [s.issue, { repo, ...s }]))
  const judged = new Map(cur.entries.map(e => [e.repo, e]))
  const candidates = new Set(readJsonl<Candidate>(join(DATA, 'candidates.jsonl')).map(c => c.repo))

  const issues = only ? [only] : await openSubmissionIssues()
  const actions: Action[] = []

  for (const issue of issues) {
    const sub = byIssue.get(issue)
    if (!sub) continue // not a seeded submission; intake already answered it

    // workflow_run hands us the sha Curate started from, and a checkout can still land on a
    // tree older than the submission. Answering from that would report a verdict computed
    // before the repo was ever a candidate.
    if (sub.at > cur.generated_at.slice(0, 10)) continue

    const entry = judged.get(sub.repo)
    if (entry) {
      if (await alreadySaid(issue, 'verdict', sub.repo)) continue
      actions.push({
        issue,
        body: renderVerdict(entry, cur),
        close: entry.status === 'excluded' ? 'not planned' : 'completed',
      })
      continue
    }

    if (candidates.has(sub.repo)) {
      // In flight between discover and judge. Say nothing until it has been long enough that
      // silence is the wrong answer.
      const age = daysSince(sub.at)
      if (age < STALL_DAYS) continue
      if (await alreadySaid(issue, 'stalled', sub.repo)) continue
      actions.push({ issue, body: renderStalled(sub.repo, age), close: '' })
      continue
    }

    if (await alreadySaid(issue, 'verdict', sub.repo)) continue
    actions.push({
      issue,
      body: renderDropped(sub.repo, await dropReason(sub.repo)),
      close: 'not planned',
    })
  }
  return actions
}

async function main() {
  const only = arg('issue') ? Number(arg('issue')) : undefined
  const dryRun = arg('dry-run') === 'true'
  const actions = await plan(only)

  if (dryRun) {
    for (const a of actions) {
      console.log(`--- issue #${a.issue} (close=${a.close || 'leave open'}) ---`)
      console.log(a.body)
      console.log('')
    }
    console.error(`== ${actions.length} issues would be answered`)
    return
  }

  const dir = process.env.RUNNER_TEMP || tmpdir()
  const rows = actions.map(a => {
    const file = join(dir, `verdict-${a.issue}.md`)
    writeFileSync(file, `${a.body}\n`)
    return `${a.issue}\t${file}\t${a.close}`
  })
  writeFileSync(join(dir, 'verdict-manifest.tsv'), rows.length ? `${rows.join('\n')}\n` : '')
  console.error(`== ${actions.length} issues to answer`)
}

main()
