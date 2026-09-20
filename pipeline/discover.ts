/**
 * Discover candidate repos.
 * Sources: repo search (windowed by created date), code search (SDK usage evidence),
 * seed awesome lists (parsed for github.com links), issue submissions (data/submissions.yaml).
 * Writes data/candidates.jsonl (merged by repo).
 */
import { join } from 'node:path'
import { gh, type RepoLite, searchCodeRepos, searchRepos } from './lib/github.js'
import { arg, DATA, readJsonl, writeJsonl } from './lib/store.js'
import { readSubmissions } from './lib/submission-file.js'

const OUT = join(DATA, 'candidates.jsonl')
const SINCE = '2026-09-10'

export type Candidate = {
  repo: string
  sources: string[] // "search:<q>" | "code:<q>" | "list:<owner/repo>" | "issue:<n>"
  evidence: string[] // code-search hits (strong signal)
  first_seen: string
  last_seen: string
  meta: Pick<
    RepoLite,
    | 'description'
    | 'topics'
    | 'language'
    | 'stargazers_count'
    | 'created_at'
    | 'pushed_at'
    | 'fork'
    | 'archived'
    | 'homepage'
  > & { owner: string; owner_type: string }
}

const SEED_LISTS = [
  'AbdelStark/awesome-typesafe',
  'hellogumbo/awesome-jev',
  'AnotiaWang/awesome-jev',
  'yibie/awesome-jev',
  'cagbal/awesome-jev',
  'oxwen11/awesome-jev',
  'yangzhou-chaofan/awesome-jev-prompt',
]

const CODE_QUERIES = ['"@typesafe-ai/sdk"', '"typesafe_sdk"', '"api.typesafe.ai"', '"jev-latest"']

/**
 * Repos submitted through the issue form come from data/submissions.yaml. Search only finds a
 * repo that says "jev" in its name, description, or topics (strictMatch below), which is
 * exactly the case the submit form exists to cover — so these are seeded unconditionally and
 * Jev's gate still decides whether they are listed.
 *
 * Read-only here. .github/workflows/submission-intake.yml is the only writer, which is why an
 * incoming submission can never race the daily run, and why curate.yml's commit step
 * deliberately leaves this file out of its `git add` list.
 */

const STATIC_QUERIES = [
  'jev typesafe',
  '"typesafe.ai"',
  '"system one" jev',
  'topic:jev',
  'topic:typesafe-ai',
  'topic:jev-ai',
  'topic:system-one',
]

function days(from: string): string[] {
  const out: string[] = []
  const d = new Date(from + 'T00:00:00Z')
  const end = new Date()
  while (d <= end) {
    out.push(d.toISOString().slice(0, 10))
    d.setUTCDate(d.getUTCDate() + 1)
  }
  return out
}

const txt = (r: RepoLite) =>
  `${r.full_name} ${r.description ?? ''} ${r.topics.join(' ')}`.toLowerCase()
/** Strict relevance: mentions jev AND (typesafe|system one), or "jev" in repo name. */
const strictMatch = (r: RepoLite) => {
  const t = txt(r)
  const name = r.full_name.split('/')[1].toLowerCase()
  return /\bjev\b/.test(t) && (/typesafe|system[ -]one/.test(t) || /jev/.test(name))
}

async function seedFromLists(): Promise<Map<string, string[]>> {
  const found = new Map<string, string[]>()
  for (const list of SEED_LISTS) {
    const readme = await gh<string>(
      `/repos/${list}/readme`,
      {},
      { accept: 'application/vnd.github.raw+json', raw: true, allow404: true },
    )
    if (!readme) continue
    const re = /github\.com\/([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)/g
    let n = 0
    for (const m of readme.matchAll(re)) {
      const full = `${m[1]}/${m[2].replace(/\.git$/, '')}`
      if (full === list || /^(topics|search|orgs|features|sponsors)\//.test(full)) continue
      if (!found.has(full)) found.set(full, [])
      found.get(full)!.push(`list:${list}`)
      n++
    }
    console.error(`  list ${list}: ${n} links`)
  }
  return found
}

async function main() {
  const quick = arg('quick') === 'true' // skip code search + per-day windows
  const now = new Date().toISOString()
  const existing = new Map(readJsonl<Candidate>(OUT).map(c => [c.repo, c]))
  const hits = new Map<string, { sources: Set<string>; evidence: Set<string>; meta?: RepoLite }>()
  const touch = (repo: string, source: string, meta?: RepoLite, evidence?: string) => {
    if (!hits.has(repo)) hits.set(repo, { sources: new Set(), evidence: new Set() })
    const h = hits.get(repo)!
    h.sources.add(source)
    if (evidence) h.evidence.add(evidence)
    if (meta) h.meta = meta
  }

  console.error('== repo search')
  const queries = quick
    ? STATIC_QUERIES.slice(0, 3)
    : [...STATIC_QUERIES, ...days(SINCE).map(d => `jev in:name,description,readme created:${d}`)]
  for (const q of queries) {
    for (const r of await searchRepos(q, quick ? 2 : 10)) {
      if (r.fork || r.archived) continue
      if (!strictMatch(r)) continue
      touch(r.full_name, `search:${q}`, r)
    }
  }

  if (!quick) {
    console.error('== code search (slow, 10/min)')
    // Supplementary source: repo search and seed lists carry the run on their own,
    // so a rate-limited code query degrades discovery instead of failing it.
    for (const q of CODE_QUERIES) {
      try {
        for (const name of await searchCodeRepos(q)) touch(name, `code:${q}`, undefined, q)
      } catch (e) {
        console.error(`  code search "${q}" failed, skipping: ${(e as Error).message}`)
      }
    }
  }

  console.error('== seed lists')
  for (const [repo, sources] of await seedFromLists()) for (const s of sources) touch(repo, s)

  // Outside the --quick guard on purpose: this is the cheap source (no API calls of its own,
  // see below), and it is the one a maintainer needs to exercise when testing a submission
  // with `gh workflow run curate.yml -f quick=true`.
  //
  // Keep this block last. enrich skips a repo only while its `sources` array stringifies
  // identically, and the merge below puts the previous array first — so appending a source
  // perturbs one repo once, while reordering these blocks would re-enrich all of them.
  console.error('== submissions')
  const submissions = readSubmissions()
  for (const [repo, s] of Object.entries(submissions)) touch(repo, `issue:${s.issue}`)
  console.error(`  ${Object.keys(submissions).length} submitted repos`)

  // Fill missing meta (code-search / list / submission hits) with a repo GET. A submitted
  // repo that no search found lands here, spending the GET the carried-candidate loop below
  // would otherwise have spent on it — so a submission costs no extra API calls after the
  // first run.
  console.error('== fetching meta for hits without search meta')
  let fetched = 0
  for (const [repo, h] of hits) {
    if (h.meta) continue
    const r = await gh<RepoLite>(`/repos/${repo}`, {}, { allow404: true })
    if (!r) {
      // Say so for submissions: this is the silent drop the verdict workflow has to explain
      // back to whoever opened the issue.
      if ([...h.sources].some(s => s.startsWith('issue:')))
        console.error(`  submitted repo ${repo} is gone or private, dropping`)
      hits.delete(repo)
      continue
    }
    h.meta = r
    fetched++
  }
  console.error(`  fetched ${fetched}`)

  const rows: Candidate[] = []
  for (const [repo, h] of hits) {
    const m = h.meta!
    if (m.fork || m.archived) continue
    const prev = existing.get(repo)
    rows.push({
      repo,
      sources: [...new Set([...(prev?.sources ?? []), ...h.sources])],
      evidence: [...new Set([...(prev?.evidence ?? []), ...h.evidence])],
      first_seen: prev?.first_seen ?? now,
      last_seen: now,
      meta: {
        description: m.description,
        topics: m.topics ?? [],
        language: m.language,
        stargazers_count: m.stargazers_count,
        created_at: m.created_at,
        pushed_at: m.pushed_at,
        fork: m.fork,
        archived: m.archived,
        homepage: m.homepage,
        owner: m.owner.login,
        owner_type: m.owner.type,
      },
    })
  }
  // Missing from one run's searches is usually search flakiness, not deletion, so previously
  // seen repos are kept. But nothing downstream ever rechecks a carried repo — enrich skips it
  // while pushed_at is unchanged — so a deleted one would stay a candidate, and stay in the
  // README, forever. Confirm the ones that went missing still exist. A repo dropped by mistake
  // comes back on the next run that searches it up.
  let vanished = 0
  for (const [repo, c] of existing) {
    if (hits.has(repo)) continue
    if (await gh<RepoLite>(`/repos/${repo}`, {}, { allow404: true })) rows.push(c)
    else vanished++
  }
  if (vanished) console.error(`  dropped ${vanished} carried repos that no longer exist`)
  rows.sort((a, b) => b.meta.stargazers_count - a.meta.stargazers_count)
  writeJsonl(OUT, rows)

  const withCode = rows.filter(r => r.evidence.length).length
  const fromLists = rows.filter(r => r.sources.some(s => s.startsWith('list:'))).length
  const fromIssues = rows.filter(r => r.sources.some(s => s.startsWith('issue:'))).length
  console.error(
    `== ${rows.length} candidates (code evidence: ${withCode}, from lists: ${fromLists}, from issues: ${fromIssues}, new this run: ${rows.length - existing.size})`,
  )
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
