/**
 * Read and write data/submissions.yaml.
 *
 * The intake workflow only ever writes API-confirmed values through the yaml Document API, so
 * nothing a stranger types reaches this file. The header invites hand edits, though, and a
 * hand-written file is arbitrary YAML: a top-level list makes Object.entries yield "0", "1",
 * a top-level string yields one entry per character, and a key like `../../etc` would be
 * pasted straight into a REST path. So every entry is checked on the way in, and a bad one is
 * dropped with a warning rather than taking the daily run down with it.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { parseDocument } from 'yaml'
import { DATA } from './store.js'

export type Submission = { issue: number; by: string; at: string }

const FILE = () => join(DATA, 'submissions.yaml')

/** GitHub's own owner/name charset. Also what keeps the slug safe to put in a REST path. */
const REPO_KEY = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

export function readSubmissions(): Record<string, Submission> {
  const f = FILE()
  if (!existsSync(f)) return {}
  const raw = parseDocument(readFileSync(f, 'utf8')).toJS()
  if (raw == null) return {}
  if (!isPlainObject(raw)) {
    console.error('  submissions.yaml is not a map of owner/repo entries, ignoring it')
    return {}
  }

  const out: Record<string, Submission> = {}
  for (const [repo, v] of Object.entries(raw)) {
    if (!REPO_KEY.test(repo)) {
      console.error(`  submissions.yaml: skipping ${JSON.stringify(repo)}, not an owner/repo key`)
      continue
    }
    if (!isPlainObject(v) || !Number.isInteger(v.issue) || (v.issue as number) <= 0) {
      console.error(`  submissions.yaml: skipping ${repo}, no valid issue number`)
      continue
    }
    out[repo] = {
      issue: v.issue as number,
      by: typeof v.by === 'string' ? v.by : '',
      at: typeof v.at === 'string' ? v.at : '',
    }
  }
  return out
}

/**
 * Write through the Document API so the file's header comment survives, and drop any entry
 * this issue owned before — an edited issue that corrects a typo'd URL moves its entry rather
 * than leaving the old repo queued forever. Returns false when nothing changed, so the
 * workflow can skip an empty commit.
 */
export function writeSubmission(repo: string, entry: Submission): boolean {
  if (!REPO_KEY.test(repo)) throw new Error(`refusing to write a non-repo key: ${repo}`)
  const f = FILE()
  const doc = parseDocument(existsSync(f) ? readFileSync(f, 'utf8') : '{}\n')
  const before = String(doc)
  const current = doc.toJS()
  if (isPlainObject(current))
    for (const [k, v] of Object.entries(current))
      if (k !== repo && isPlainObject(v) && v.issue === entry.issue) doc.delete(k)
  doc.set(repo, entry)
  const after = String(doc)
  if (after === before) return false
  writeFileSync(f, after)
  return true
}
