/**
 * Turn a "Jev got it wrong" issue into a draft override for review.
 * `--issue <n>` `--dry-run`
 *
 * Writes data/overrides.yaml and prints what the workflow needs to open a draft pull
 * request. It never decides anything: the entry it writes is a stranger's claim transcribed
 * into the file a maintainer reviews, which is why the PR stays a draft and why `reason`
 * is sanitized on the way in.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { parseDocument } from 'yaml'
import type { Curated } from './lib/comment.js'
import { SUBMIT_TEMPLATE } from './lib/comment.js'
import { gh } from './lib/github.js'
import { REPO, sectionTitle } from './lib/sections.js'
import { arg, DATA, readJson } from './lib/store.js'

/**
 * What each dropdown option can actually change. curate.ts applies exactly four override
 * fields — status, category, reason, by — so `pattern` and the individual scores have
 * nowhere to go. Those two get an explanation instead of a pull request; widening Override
 * is a policy change to curate.ts and belongs in its own pull request.
 */
const KINDS: Record<string, { status?: 'listed' | 'excluded'; needsCategory?: boolean }> = {
  'Excluded but it is a genuine Jev project': { status: 'listed' },
  'Listed but it is not about Jev': { status: 'excluded' },
  'Wrong category': { needsCategory: true },
}

const CATEGORIES = new Set([
  'sdk_client',
  'integration',
  'agent_tooling',
  'application',
  'game_sim',
  'research_eval',
  'learning',
  'other',
])

const MAX_REASON = 500

/** Field values as the issue form renders them: `### Label` then the value. */
function fields(body: string): Record<string, string> {
  const out: Record<string, string> = {}
  for (const s of body.split(/^### /m)) {
    const nl = s.indexOf('\n')
    if (nl === -1) continue
    const value = s.slice(nl + 1).trim()
    if (value && !/^_No response_$/i.test(value)) out[s.slice(0, nl).trim().toLowerCase()] = value
  }
  return out
}

/**
 * The evidence text lands in a committed file and is rendered on the calibration page, so it
 * is flattened to one line and capped. The issue keeps the full text; the reason points at it.
 *
 * Control characters are filtered by code point rather than by a character-class regex: the
 * escapes for such a range are exactly what biome's formatter rewrites into literal control
 * bytes in the source.
 */
function sanitizeReason(evidence: string, issue: number): string {
  const printable = [...evidence]
    .map(ch => {
      const c = ch.codePointAt(0) ?? 0
      return c < 0x20 || c === 0x7f ? ' ' : ch
    })
    .join('')
  const flat = printable.replace(/\s+/g, ' ').trim()
  const body = flat.length > MAX_REASON ? `${flat.slice(0, MAX_REASON).trimEnd()}…` : flat
  return `${body} (see #${issue})`
}

type Result =
  | { kind: 'comment'; body: string }
  | { kind: 'pr'; repo: string; branch: string; title: string; body: string; comment: string }

async function decide(issue: number, dryRun: boolean): Promise<Result> {
  const raw = await gh<{ body: string | null; user: { login: string } }>(
    `/repos/${REPO}/issues/${issue}`,
    {},
    { allow404: true },
  )
  if (!raw) return { kind: 'comment', body: 'This issue could not be read.' }

  const f = fields(raw.body ?? '')
  const repo = (f.repository ?? '').split(/\s+/)[0] ?? ''
  const kindLabel = f['what is wrong?'] ?? ''
  const evidence = f.evidence ?? ''
  const category = (f['correct category'] ?? '').trim()

  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repo))
    return {
      kind: 'comment',
      body: 'The Repository field should be `owner/repo`, with no URL around it. Reopen with that and a bot will draft the override.',
    }

  const kind = KINDS[kindLabel]
  if (!kind)
    return {
      kind: 'comment',
      body: [
        'No override can express this one.',
        '',
        'Overrides change only the **status** (listed, review, excluded) and the **category** of an entry. The usage pattern and the individual substance, docs, and novelty scores come from Jev and are never edited — that is what keeps the calibration page honest.',
        '',
        'If a score produced the wrong *status*, say which status you think is right and a maintainer can override that instead. Otherwise this is useful input for the next revision of the question set, so it stays open.',
      ].join('\n'),
    }

  if (kind.needsCategory && !CATEGORIES.has(category))
    return {
      kind: 'comment',
      body: `To move an entry between categories the bot needs the target category from the "Correct category" dropdown. Pick one of: ${[...CATEGORIES].join(', ')}.`,
    }

  // An override for a repo with no judgment is silently ignored by curate.ts, which iterates
  // judgments and looks overrides up inside that loop. Writing one would change nothing while
  // still inflating stats.overrides.
  const cur = readJson<Curated | null>(join(DATA, 'curated.json'), null)
  const entry = cur?.entries.find(e => e.repo === repo)
  if (!entry)
    return {
      kind: 'comment',
      body: `[${repo}](https://github.com/${repo}) has not been judged, so there is no verdict to override. Open a [submission](${SUBMIT_TEMPLATE}) instead and the pipeline will judge it.`,
    }

  const reason = sanitizeReason(evidence, issue)
  if (!dryRun) writeOverride(repo, { ...kind, category, reason, by: raw.user.login })

  const change =
    kind.status && kind.status !== entry.status
      ? `status \`${entry.status}\` → \`${kind.status}\``
      : `category \`${entry.category}\` → \`${category}\``

  return {
    kind: 'pr',
    repo,
    branch: `override/issue-${issue}-${repo.replace(/[^A-Za-z0-9._-]+/g, '-').toLowerCase()}`,
    title: `override: ${repo} (${change.split(' ')[0]})`,
    body: prBody(issue, repo, entry, change, reason),
    comment: `Drafted an override for [${repo}](https://github.com/${repo}) (${change}). It is a **draft** pull request: a maintainer verifies the evidence before anything changes.`,
  }
}

function prBody(
  issue: number,
  repo: string,
  entry: Curated['entries'][number],
  change: string,
  reason: string,
): string {
  return [
    `Generated from #${issue}. **Nothing here has been verified.**`,
    '',
    `Proposes ${change} for [${repo}](https://github.com/${repo}).`,
    '',
    `Jev's verdict: **${entry.status}** under *${sectionTitle(entry.category)}* — genuine ${entry.jev.genuine.toFixed(2)}, substance ${entry.jev.substance.toFixed(2)}, composite ${entry.jev.composite.toFixed(3)}. Recorded reason: \`${entry.status_reason}\``,
    '',
    'Submitted evidence, transcribed into `reason`:',
    '',
    `> ${reason}`,
    '',
    '`README.md` and `data/curated.json` are regenerated here because CI re-runs `pnpm curate && pnpm readme` and fails on any drift. That works without an API key because curate reads only committed metadata, which is deliberate — see the comment above `writeRepoMeta` before changing it.',
    '',
    'Before marking ready:',
    '',
    '- [ ] The evidence points at something checkable in the repository',
    '- [ ] The `reason` reads as a verifiable sentence, not a claim',
    '- [ ] Rebased on `main` and `pnpm curate && pnpm readme` re-run',
    '',
    `Closes #${issue}`,
  ].join('\n')
}

/**
 * Edit through the yaml Document so the file's header survives — it is the only place the
 * "every entry needs a reason a reader can verify" rule is written down.
 */
function writeOverride(
  repo: string,
  v: { status?: string; category?: string; reason: string; by: string },
) {
  const f = join(DATA, 'overrides.yaml')
  const doc = parseDocument(existsSync(f) ? readFileSync(f, 'utf8') : '{}\n')
  const entry: Record<string, string> = {}
  if (v.status) entry.status = v.status
  if (v.category) entry.category = v.category
  entry.reason = v.reason
  entry.by = v.by
  doc.set(repo, entry)
  writeFileSync(f, String(doc))
}

async function main() {
  const issue = Number(arg('issue'))
  if (!Number.isInteger(issue) || issue <= 0) throw new Error('--issue <number> is required')
  const dryRun = arg('dry-run') === 'true'
  const r = await decide(issue, dryRun)

  const dir = process.env.RUNNER_TEMP || tmpdir()
  const write = (name: string, text: string) => {
    const p = join(dir, `${name}-${issue}.md`)
    writeFileSync(p, `${text}\n`)
    return p
  }

  if (dryRun) {
    console.log(`--- issue #${issue}: ${r.kind} ---`)
    console.log(r.kind === 'pr' ? `${r.branch}\n${r.title}\n\n${r.body}` : r.body)
    return
  }

  const out =
    r.kind === 'comment'
      ? ['action=comment', `comment=${write('scaffold', r.body)}`]
      : [
          'action=pr',
          `comment=${write('scaffold', r.comment)}`,
          `branch=${r.branch}`,
          `title=${r.title}`,
          `body=${write('pr-body', r.body)}`,
        ]
  const text = out.join('\n')
  if (process.env.GITHUB_OUTPUT)
    writeFileSync(process.env.GITHUB_OUTPUT, `${text}\n`, { flag: 'a' })
  console.error(text)
}

main()
