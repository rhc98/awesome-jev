// Copies the pipeline output into the site source tree so Next can embed it at
// build time. Keeps the site a self-contained package: nothing outside site/ is
// imported by application code.
//
// The full curated file stays server-only (detail pages, how-it-works, sitemap).
// The directory fetches slim per-status files from public/data at runtime, and
// reads their paths plus the small shared metadata from client-manifest.json.
import { createHash } from 'node:crypto'
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const siteRoot = join(here, '..')
const repoData = join(siteRoot, '..', 'data')
const outDir = join(siteRoot, 'src', 'generated')
const publicDataDir = join(siteRoot, 'public', 'data')

const STATUSES = ['listed', 'review', 'excluded']

mkdirSync(outDir, { recursive: true })

const curatedSrc = join(repoData, 'curated.json')
if (!existsSync(curatedSrc)) {
  console.error(
    `sync-data: missing ${curatedSrc}. Run the pipeline first (pnpm curate at the repo root).`,
  )
  process.exit(1)
}
copyFileSync(curatedSrc, join(outDir, 'curated.json'))

const calibrationSrc = join(repoData, 'calibration.json')
const calibrationOut = join(outDir, 'calibration.json')
if (existsSync(calibrationSrc)) {
  copyFileSync(calibrationSrc, calibrationOut)
} else {
  // Keep the import resolvable when calibration has not been computed yet.
  writeFileSync(calibrationOut, 'null\n')
}

const curated = JSON.parse(readFileSync(curatedSrc, 'utf8'))

// The directory only knows these three files; an entry outside them would vanish.
const unknown = curated.entries.filter(e => !STATUSES.includes(e.status))
if (unknown.length > 0) {
  console.error(
    `sync-data: ${unknown.length} entries have an unknown status, e.g. ${unknown[0].repo}`,
  )
  process.exit(1)
}

/** Only the fields the directory list renders, filters, or sorts on. Mirrors EntryLite. */
function slim(entry) {
  return {
    repo: entry.repo,
    name: entry.name,
    description: entry.description,
    language: entry.language,
    stars: entry.stars,
    created: entry.created,
    pushed: entry.pushed,
    category: entry.category,
    category_uncertain: entry.category_uncertain,
    pattern: entry.pattern,
    status: entry.status,
    status_reason: entry.status_reason,
    readme_pick: entry.readme_pick,
    jev: {
      genuine: entry.jev.genuine,
      substance: entry.jev.substance,
      category_conf: entry.jev.category_conf,
      composite: entry.jev.composite,
    },
  }
}

/** Unique values sorted by frequency then name. */
function facet(values) {
  const counts = new Map()
  for (const value of values) {
    if (!value) continue
    counts.set(value, (counts.get(value) ?? 0) + 1)
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([value]) => value)
}

// Content-hashed names let the host cache each file forever; a new curate run
// yields new names, and the manifest (bundled into the JS) points at them.
rmSync(publicDataDir, { recursive: true, force: true })
mkdirSync(publicDataDir, { recursive: true })

const files = {}
const categoryCounts = {}
for (const status of STATUSES) {
  const rows = curated.entries.filter(e => e.status === status)
  const body = JSON.stringify(rows.map(slim))
  const hash = createHash('sha256').update(body).digest('hex').slice(0, 8)
  const name = `entries.${status}.${hash}.json`
  writeFileSync(join(publicDataDir, name), body)
  files[status] = `/data/${name}`

  const counts = {}
  for (const e of rows) counts[e.category] = (counts[e.category] ?? 0) + 1
  categoryCounts[status] = counts
}

const policy = curated.policy ?? {}
const manifest = {
  generated_at: curated.generated_at,
  stats: curated.stats,
  // Raw policy values; lib/shared applies the fallbacks.
  policy: {
    listed_min: policy.gate?.listed_min ?? null,
    substance_min: policy.gate?.substance_min ?? null,
    category_uncertain_below: policy.category_uncertain_below ?? null,
  },
  facets: {
    categories: facet(curated.entries.map(e => e.category)),
    patterns: facet(curated.entries.map(e => e.pattern)),
    languages: facet(curated.entries.map(e => e.language)),
  },
  category_counts: categoryCounts,
  files,
}
writeFileSync(join(outDir, 'client-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)

console.log(`sync-data: wrote ${outDir} and ${publicDataDir}`)
