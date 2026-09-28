/**
 * Enrich candidates with README excerpt, file listing, manifest evidence.
 * REST calls per repo: the root tree, plus the repo itself only when discover's meta is not
 * from this run. README and manifest text come from raw.githubusercontent.com (see fileText).
 * Writes data/enriched/<owner>__<name>.json (cached; refreshed when pushed_at changes, on the
 * repo's refresh day from lib/refresh.ts, or with --force).
 */

import { existsSync, readdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'
import type { Candidate } from './discover.js'
import { gh } from './lib/github.js'
import { refreshPolicy } from './lib/refresh.js'
import { arg, DATA, readJson, readJsonl, repoKey, writeJson, writeJsonl } from './lib/store.js'

const README_CHARS = 5000
const MANIFESTS = [
  'package.json',
  'pyproject.toml',
  'requirements.txt',
  'Cargo.toml',
  'go.mod',
  'Gemfile',
  'build.sbt',
  'composer.json',
  'Package.swift',
  'mix.exs',
  'pom.xml',
  'build.gradle',
  'deno.json',
  'bun.lockb',
]

export type Enriched = {
  repo: string
  enriched_at: string
  pushed_at: string
  name: string
  owner: string
  owner_type: string
  is_official_org: boolean
  description: string | null
  topics: string[]
  language: string | null
  stars: number
  forks: number
  created_at: string
  homepage: string | null
  license: string | null
  readme_chars: number
  readme_excerpt: string
  readme_headings: string[]
  files_top: string[]
  manifests_found: string[]
  manifest_mentions_typesafe: string[]
  has_tests: boolean
  has_ci: boolean
  code_evidence: string[]
  sources: string[]
}

function headings(md: string): string[] {
  return md
    .split('\n')
    .filter(l => /^#{1,3}\s/.test(l))
    .map(l => l.replace(/^#+\s*/, '').trim())
    .slice(0, 40)
}

// File contents come from raw.githubusercontent.com, which does not draw on the REST core
// budget (5,000 calls/hr on the bot PAT) that the repo, tree, readme and contents endpoints
// share. raw has limits of its own, so anything but a 200 or a 404 falls back to the API, and
// a run where raw keeps failing stops trying it.
const RAW = 'https://raw.githubusercontent.com'
const RAW_MAX_FAILURES = 20
let rawFailures = 0

/** A file's text on the default branch, or null when it does not exist. */
async function fileText(repo: string, path: string, apiPath: string): Promise<string | null> {
  if (rawFailures < RAW_MAX_FAILURES) {
    try {
      const url = `${RAW}/${repo}/HEAD/${path.split('/').map(encodeURIComponent).join('/')}`
      const res = await fetch(url, { headers: { 'User-Agent': 'awesome-jev-pipeline' } })
      if (res.status === 404) return null
      if (res.ok) return await res.text()
    } catch {
      // Counted below like any other non-404 failure.
    }
    if (++rawFailures === RAW_MAX_FAILURES)
      console.error(`  raw.githubusercontent.com failed ${RAW_MAX_FAILURES} times, using the API`)
  }
  return gh<string>(
    apiPath,
    {},
    { accept: 'application/vnd.github.raw+json', raw: true, allow404: true },
  )
}

type TreeEntry = { path: string; type: string }

const README_NAME =
  /^readme(\.(md|markdown|mdown|mkdn|rst|txt|adoc|asciidoc|org|textile|rdoc|wiki|mediawiki|creole|pod))?$/i

async function readmeText(repo: string, entries: TreeEntry[]): Promise<string | null> {
  const names = entries.filter(e => e.type === 'blob' && README_NAME.test(e.path)).map(e => e.path)
  // Markdown first, which is what GitHub shows when a repo has more than one.
  const pick = names.find(n => /\.(md|markdown)$/i.test(n)) ?? names[0]
  if (pick) return fileText(repo, pick, `/repos/${repo}/readme`)
  // None at the root. The readme endpoint can also find one under .github/ or docs/, so it is
  // asked only when one of those exists.
  if (entries.some(e => e.type === 'tree' && (e.path === '.github' || e.path === 'docs')))
    return gh<string>(
      `/repos/${repo}/readme`,
      {},
      { accept: 'application/vnd.github.raw+json', raw: true, allow404: true },
    )
  return null
}

type Basics = Pick<
  Enriched,
  | 'pushed_at'
  | 'owner_type'
  | 'description'
  | 'topics'
  | 'language'
  | 'stars'
  | 'forks'
  | 'created_at'
  | 'homepage'
  | 'license'
>

// Discover runs minutes before enrich in the same job; anything older came from another run.
const META_FRESH_MS = 6 * 3_600_000

/** The repo metadata discover fetched this run, or null when the candidate's copy is older. */
function basicsFromCandidate(c: Candidate): Basics | null {
  const m = c.meta
  const age = Date.now() - Date.parse(m.fetched_at ?? '')
  if (!(age < META_FRESH_MS) || m.forks_count === undefined || m.license === undefined) return null
  return {
    pushed_at: m.pushed_at,
    owner_type: m.owner_type,
    description: m.description,
    topics: m.topics ?? [],
    language: m.language,
    stars: m.stargazers_count,
    forks: m.forks_count,
    created_at: m.created_at,
    homepage: m.homepage || null,
    license: m.license,
  }
}

function basicsFromRepo(repo: any): Basics {
  return {
    pushed_at: repo.pushed_at,
    owner_type: repo.owner.type,
    description: repo.description,
    topics: repo.topics ?? [],
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    created_at: repo.created_at,
    homepage: repo.homepage || null,
    license: repo.license?.spdx_id ?? null,
  }
}

async function enrichOne(c: Candidate): Promise<Enriched | null> {
  const [owner, name] = c.repo.split('/')
  // HEAD resolves to the default branch, so finding the tree needs no repo GET.
  const tree = await gh<{ tree: TreeEntry[] }>(
    `/repos/${c.repo}/git/trees/HEAD`,
    {},
    { allow404: true },
  )
  let basics = basicsFromCandidate(c)
  // Without same-run meta, or without a tree, fetch the repo. An empty repo (409) and one
  // deleted since discover (404) both have no tree; this GET is what tells them apart.
  if (!basics || !tree) {
    const repo = await gh<any>(`/repos/${c.repo}`, {}, { allow404: true })
    if (!repo) return null
    basics = basicsFromRepo(repo)
  }
  const entries = tree?.tree ?? []
  const paths = entries.map(t => t.path)
  const readme = (await readmeText(c.repo, entries)) ?? ''
  const manifests = MANIFESTS.filter(m => paths.includes(m))
  const mentions: string[] = []
  for (const m of manifests.slice(0, 3)) {
    if (m.endsWith('.lockb')) continue
    const body = await fileText(c.repo, m, `/repos/${c.repo}/contents/${m}`)
    if (body && /typesafe/i.test(body)) mentions.push(m)
  }
  // Key order matches what this file always wrote, so repos.jsonl rows do not reshuffle.
  return {
    repo: c.repo,
    enriched_at: new Date().toISOString(),
    pushed_at: basics.pushed_at,
    name,
    owner,
    owner_type: basics.owner_type,
    is_official_org: owner.toLowerCase() === 'typesafe-ai',
    description: basics.description,
    topics: basics.topics,
    language: basics.language,
    stars: basics.stars,
    forks: basics.forks,
    created_at: basics.created_at,
    homepage: basics.homepage,
    license: basics.license,
    readme_chars: readme.length,
    readme_excerpt: readme.slice(0, README_CHARS),
    readme_headings: headings(readme),
    files_top: paths.slice(0, 40),
    manifests_found: manifests,
    manifest_mentions_typesafe: mentions,
    has_tests:
      paths.some(p => /^(tests?|__tests__|spec)$/i.test(p)) ||
      paths.some(p => /\.(test|spec)\.[jt]sx?$/.test(p)),
    has_ci: paths.includes('.github'),
    code_evidence: c.evidence,
    sources: c.sources,
  }
}

async function main() {
  const limit = Number(arg('limit') ?? Infinity)
  const force = arg('force') === 'true'
  const only = arg('repos')?.split(',')
  let cands = readJsonl<Candidate>(join(DATA, 'candidates.jsonl'))
  if (only) cands = cands.filter(c => only.includes(c.repo))
  const refresh = refreshPolicy()
  let done = 0,
    skipped = 0,
    deferred = 0,
    gone = 0
  for (const c of cands) {
    if (done >= limit) break
    const file = join(DATA, 'enriched', repoKey(c.repo) + '.json')
    if (!force && existsSync(file)) {
      const prev = readJson<Enriched>(file, null as any)
      const sameEvidence = JSON.stringify(prev?.code_evidence ?? []) === JSON.stringify(c.evidence)
      const sameSources = JSON.stringify(prev?.sources ?? []) === JSON.stringify(c.sources)
      if (prev && prev.pushed_at === c.meta.pushed_at && sameEvidence && sameSources) {
        skipped++
        continue
      }
      // Changed, but not this repo's refresh day: the refetch waits for it. Evidence and
      // sources come from discover rather than the API, so they are brought up to date now at
      // no cost. pushed_at stays behind on purpose, which is what re-enriches it on its day.
      // A scoped --repos run is an explicit ask and always refetches.
      if (prev && !only && !refresh.due(c.repo, c.sources, c.meta)) {
        if (!sameEvidence || !sameSources)
          writeJson(file, { ...prev, code_evidence: c.evidence, sources: c.sources })
        deferred++
        continue
      }
    }
    let e: Enriched | null = null
    try {
      e = await enrichOne(c)
    } catch (err) {
      console.error(`  skip ${c.repo}: ${(err as Error).message.slice(0, 120)}`)
    }
    if (!e) {
      // The repo 404s now. Its cached file would otherwise keep feeding repos.jsonl, so the
      // count reported below was only ever cosmetic.
      rmSync(file, { force: true })
      gone++
      continue
    }
    writeJson(file, e)
    done++
    if (done % 25 === 0) console.error(`  enriched ${done}`)
  }
  console.error(
    `== enriched ${done}, cached ${skipped}, deferred ${deferred} not due, gone ${gone}` +
      ` (refresh tiers due/changed: ${refresh.summary()})`,
  )
  // writeRepoMeta rebuilds repos.jsonl from the whole enriched directory, so it is only
  // correct after a run that considered every candidate. A scoped run leaves the rest of the
  // cache untouched — and on a fresh clone the cache holds just the handful of repos this run
  // fetched, which would rewrite the committed repos.jsonl down to those rows and take
  // curated.json and the README with it. Scoped runs are for inspecting one repo; the next
  // unscoped run regenerates the metadata.
  if (only || Number.isFinite(limit)) {
    console.error(
      '== repos.jsonl left alone (scoped run); use an unscoped `pnpm enrich` to rebuild it',
    )
    return
  }
  writeRepoMeta()
}

/** Slim, committed view of enriched data (no README text) so curate can run in CI without the cache. */
export type RepoMeta = Omit<Enriched, 'readme_excerpt' | 'readme_headings' | 'files_top'>

export function writeRepoMeta() {
  const dir = join(DATA, 'enriched')
  // candidates.jsonl is the live set. The enriched directory is a cache and is never pruned
  // wholesale, so filtering by it is what carries a discover-side drop through to repos.jsonl,
  // curated.json, and the README — without it a deleted repo stays linked forever.
  const live = new Set(readJsonl<Candidate>(join(DATA, 'candidates.jsonl')).map(c => c.repo))
  const all: RepoMeta[] = readdirSync(dir)
    .filter(f => f.endsWith('.json'))
    .map(f => readJson<Enriched>(join(dir, f), null as any))
    .filter(Boolean)
    .map(({ readme_excerpt: _r, readme_headings: _h, files_top: _f, ...meta }) => meta)
  const rows = all.filter(m => live.has(m.repo)).sort((a, b) => a.repo.localeCompare(b.repo))
  writeJsonl(join(DATA, 'repos.jsonl'), rows)
  const stale = all.length - rows.length
  console.error(
    `== repos.jsonl: ${rows.length} rows${stale ? ` (${stale} stale cached repos held back)` : ''}`,
  )
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
