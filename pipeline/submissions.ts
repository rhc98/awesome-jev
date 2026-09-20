/**
 * Validate one submission issue and seed it into data/submissions.yaml.
 * `--issue <n>` `--dry-run`
 *
 * The workflow passes an issue number and nothing else: the body is fetched here, through
 * the read-only gh() helper, so untrusted text never reaches a shell. Nothing typed into the
 * issue is echoed back in a comment either — every reason below is a fixed string, and the
 * only user-derived value that ever appears is a repo slug the GitHub API confirmed.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parseDocument } from 'yaml'
import type { Curated } from './lib/comment.js'
import {
  renderDuplicate,
  renderQueued,
  renderRejected,
  renderVerdict,
  SUBMIT_TEMPLATE,
} from './lib/comment.js'
import { gh, type RepoLite } from './lib/github.js'
import { REPO } from './lib/sections.js'
import { arg, DATA, readJson } from './lib/store.js'

type Submission = { issue: number; by: string; at: string }

/** GitHub paths that look like `owner/repo` but are not repositories. */
const RESERVED = new Set([
  'topics',
  'search',
  'orgs',
  'features',
  'sponsors',
  'settings',
  'marketplace',
  'apps',
  'collections',
  'about',
  'pricing',
  'login',
  'enterprise',
  'readme',
  'new',
  'notifications',
])

const URL_RE =
  /^https?:\/\/(?:www\.)?github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?$/

/** The form renders field labels as `### ` headings; fall back to any github.com link. */
function extractUrl(body: string): string | null {
  const sections = body.split(/^### /m)
  for (const s of sections) {
    const nl = s.indexOf('\n')
    if (nl === -1) continue
    if (!/github repository url/i.test(s.slice(0, nl))) continue
    const value = s.slice(nl + 1).trim()
    if (value && !/^_No response_$/i.test(value)) return value.split(/\s+/)[0] ?? null
  }
  const loose = body.match(/https?:\/\/(?:www\.)?github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+/)
  return loose ? loose[0] : null
}

type Outcome = {
  comment: string
  close?: 'completed' | 'not_planned'
  label?: 'invalid' | 'duplicate'
  write?: { repo: string; entry: Submission }
}

async function decide(issue: number): Promise<Outcome> {
  const raw = await gh<{ body: string | null; user: { login: string } }>(
    `/repos/${REPO}/issues/${issue}`,
    {},
    { allow404: true },
  )
  if (!raw) return { comment: renderRejected('the issue could not be read.'), label: 'invalid' }

  const body = raw.body ?? ''
  const url = extractUrl(body)
  if (!url || url.length > 300)
    return {
      comment: renderRejected(
        `no GitHub repository URL was found in this issue. Open a [submission](${SUBMIT_TEMPLATE}) with the repository link in the URL field.`,
      ),
      close: 'not_planned',
      label: 'invalid',
    }

  const m = url.match(URL_RE)
  if (!m || RESERVED.has(m[1].toLowerCase()))
    return {
      comment: renderRejected(
        'that link is not a repository URL. It should look like `https://github.com/owner/repo`, with no path after the repository name.',
      ),
      close: 'not_planned',
      label: 'invalid',
    }

  // Trust the API's full_name over the submitted string, so a renamed repo is keyed by the
  // name discovery will actually find.
  const meta = await gh<RepoLite & { full_name: string }>(
    `/repos/${m[1]}/${m[2]}`,
    {},
    { allow404: true },
  )
  if (!meta)
    return {
      comment: renderRejected('that repository does not exist, or it is private.'),
      close: 'not_planned',
      label: 'invalid',
    }

  const repo = meta.full_name
  if (repo.toLowerCase() === REPO.toLowerCase())
    return {
      comment: renderRejected('that is this list itself.'),
      close: 'not_planned',
      label: 'invalid',
    }
  if (meta.fork)
    return {
      comment: renderRejected('forks are out of scope. Submit the upstream repository instead.'),
      close: 'not_planned',
      label: 'invalid',
    }
  if (meta.archived)
    return {
      comment: renderRejected('archived repositories are out of scope.'),
      close: 'not_planned',
      label: 'invalid',
    }

  // Already judged: answer with the verdict rather than seeding it. Adding a source to a repo
  // the pipeline already has would only force a pointless re-enrich.
  const cur = readJson<Curated | null>(join(DATA, 'curated.json'), null)
  const judged = cur?.entries.find(e => e.repo === repo)
  if (judged && cur) return { comment: renderVerdict(judged, cur), close: 'completed' }

  const subs = readSubmissions()
  const owner = Object.entries(subs).find(([k, v]) => k === repo && v.issue !== issue)
  if (owner)
    return {
      comment: renderDuplicate(repo, owner[1].issue),
      close: 'completed',
      label: 'duplicate',
    }

  return {
    comment: renderQueued(repo),
    write: {
      repo,
      entry: { issue, by: raw.user.login, at: new Date().toISOString().slice(0, 10) },
    },
  }
}

function readSubmissions(): Record<string, Submission> {
  const f = join(DATA, 'submissions.yaml')
  if (!existsSync(f)) return {}
  return (parseDocument(readFileSync(f, 'utf8')).toJS() ?? {}) as Record<string, Submission>
}

/**
 * Edit through the yaml Document so the file's header comment survives, and drop any entry
 * this issue owned before — an edited issue that corrects a typo'd URL moves its entry
 * rather than leaving the old repo queued forever.
 */
function writeSubmission(repo: string, entry: Submission): boolean {
  const f = join(DATA, 'submissions.yaml')
  const doc = parseDocument(existsSync(f) ? readFileSync(f, 'utf8') : '{}\n')
  const before = String(doc)
  for (const [k, v] of Object.entries((doc.toJS() ?? {}) as Record<string, Submission>))
    if (v?.issue === entry.issue && k !== repo) doc.delete(k)
  doc.set(repo, entry)
  const after = String(doc)
  if (after === before) return false
  writeFileSync(f, after)
  return true
}

async function main() {
  const issue = Number(arg('issue'))
  if (!Number.isInteger(issue) || issue <= 0) throw new Error('--issue <number> is required')
  const dryRun = arg('dry-run') === 'true'

  const outcome = await decide(issue)
  const changed =
    outcome.write && !dryRun ? writeSubmission(outcome.write.repo, outcome.write.entry) : false

  if (dryRun) {
    console.log(`--- issue #${issue} ---`)
    console.log(outcome.comment)
    console.log(
      `--- close=${outcome.close ?? ''} label=${outcome.label ?? ''} seeds=${outcome.write?.repo ?? ''} ---`,
    )
    return
  }

  const dir = process.env.RUNNER_TEMP || tmpdir()
  const file = join(dir, `submission-${issue}.md`)
  writeFileSync(file, `${outcome.comment}\n`)

  const out = [
    `comment=${file}`,
    `close=${outcome.close ?? ''}`,
    `label=${outcome.label ?? ''}`,
    `changed=${changed}`,
    `repo=${outcome.write?.repo ?? ''}`,
  ].join('\n')
  if (process.env.GITHUB_OUTPUT) writeFileSync(process.env.GITHUB_OUTPUT, `${out}\n`, { flag: 'a' })
  console.error(out)
}

main()
