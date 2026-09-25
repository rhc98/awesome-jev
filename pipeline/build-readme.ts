/**
 * Generate README.md from data/curated.json. README is a build artifact — never hand-edit.
 * Format follows sindresorhus/awesome-lint: `- [Name](url) - Description.`
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Entry } from './curate.js'
import { REPO, SECTIONS, SITE } from './lib/sections.js'
import { DATA, ROOT, readJson } from './lib/store.js'

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/ /g, '-')

function describe(e: Entry): string | null {
  let d = (e.description ?? '').replace(/\s+/g, ' ').trim()
  if (!d) return null
  // awesome-lint no-repeat-item-in-description: a description must not start with
  // the item name. Repo authors often write "<name>: ..." or "<name> v1 - ...";
  // strip that prefix (case-insensitive, optional version token, :, en/em dash, or
  // a spaced " -" so hyphenated words like "Sub2API-CRS2" stay intact).
  const name = e.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  d = d.replace(
    new RegExp(`^${name}\\b(?:\\s+v\\d+(?:\\.\\d+)*)?(?:\\s*[:\\u2013\\u2014]|\\s+-)\\s*`, 'i'),
    '',
  )
  if (!d) return null
  d = d.charAt(0).toUpperCase() + d.slice(1)
  if (!/[.!?]$/.test(d)) d += '.'
  // remark-lint:awesome-spell-check: the canonical spelling is "PostgreSQL".
  // Replace only the standalone word: "PostgreSQL" itself never matches, and
  // variants like "Postgres+" or "PostgresXL" are left untouched.
  d = d.replace(/\bPostgres(?![\w+])/g, 'PostgreSQL')
  // Escape Markdown special characters so free-text repo descriptions are not
  // parsed as Markdown (remark-lint:no-undefined-references on "[...]", plus
  // emphasis, images, and autolinks). Parentheses are excluded. This runs after
  // the trailing-period check above so that check sees the unescaped text.
  d = d.replace(/[\\*_<>![\]]/g, '\\$&')
  return d
}

function main() {
  const cur = readJson<{
    generated_at: string
    policy: { readme_top_per_category: number }
    stats: any
    entries: Entry[]
  }>(join(DATA, 'curated.json'), null as any)
  if (!cur) throw new Error('data/curated.json missing — run curate first')
  const picks = cur.entries.filter(e => e.readme_pick && describe(e))
  const date = cur.generated_at.slice(0, 10)
  const total = cur.stats.total
  const listed = cur.stats.listed

  const out: string[] = []
  out.push(`# Awesome Jev [![Awesome](https://awesome.re/badge.svg)](https://awesome.re)`)
  out.push('')
  out.push(
    `[![Site](https://img.shields.io/badge/site-awesome--jev.xyz-111827)](${SITE}) [![Curated](https://img.shields.io/badge/curated-${date}-2563eb)](${SITE}/?sort=newest) [![Judged](https://img.shields.io/badge/judged-${total}%20repos-16a34a)](${SITE}/?status=all) ![Listed](https://img.shields.io/badge/listed-${listed}-16a34a)`,
  )
  out.push('')
  out.push(
    `> Projects built on [Jev](https://typesafe.ai), TypeSafe AI's System One model. Curated by Jev itself.`,
  )
  out.push('')
  out.push(
    `Every repository here was collected from GitHub, then judged by Jev in a single call: is it genuinely about Jev, which category, which decision pattern, and how substantial, documented, and novel it is. Code applies the policy; nothing below was hand-picked. The full index with probabilities lives on the site, along with the [review queue](${SITE}/review) of borderline cases.`,
  )
  out.push('')
  out.push(
    `This is an independent community project, not affiliated with TypeSafe AI. Jev and System One are TypeSafe AI product names.`,
  )
  out.push('')
  out.push(
    `![Pipeline: GitHub search and community lists feed candidates into code, Jev judges each repository in one call, code applies the policy with human overrides, and the README and site are published daily.](docs/diagrams/pipeline.png)`,
  )
  out.push('')
  out.push('## Contents')
  out.push('')
  const present = SECTIONS.filter(s => picks.some(e => e.category === s.id))
  for (const s of present) out.push(`- [${s.title}](#${slug(s.title)})`)
  out.push('- [How This List Is Made](#how-this-list-is-made)')
  out.push('')

  for (const s of present) {
    const rows = picks
      .filter(e => e.category === s.id)
      .sort((a, b) => b.jev.composite - a.jev.composite)
    out.push(`## ${s.title}`)
    out.push('')
    out.push(s.blurb)
    out.push('')
    for (const e of rows) out.push(`- [${e.name}](https://github.com/${e.repo}) - ${describe(e)}`)
    out.push('')
  }

  out.push('## How This List Is Made')
  out.push('')
  out.push(
    `Discover: GitHub repository search, code search for SDK usage, and links from other community lists. Enrich: README excerpt, file listing, manifest dependencies, and activity metadata. Judge: one Jev call per repository with 11 typed questions, gates as Noul, category and pattern as Choice, substance, docs, and novelty as Score. Curate: code applies thresholds and weights to the stored judgments, so changing policy never re-runs inference. Publish: this README and the site are generated from \`data/curated.json\` every day.`,
  )
  out.push('')
  out.push(
    `Question set \`${cur.entries[0]?.jev.qset ?? 'v2'}\`, model \`${cur.entries[0]?.jev.model ?? 'jev-latest'}\`. The calibration against human labels is on the [how it works](${SITE}/how-it-works) page.`,
  )
  out.push('')
  out.push('## Contributing')
  out.push('')
  // Only the two issue-template URLs are linked here. awesome-lint rejects a duplicate link,
  // and the site root, the review queue, and the how-it-works page are all already linked above.
  out.push(
    `Missing project? [Submit it](https://github.com/${REPO}/issues/new?template=submit.yml) with the repository URL. A bot checks the link, the next daily run judges it, and the verdict is posted back on the issue. This README carries the top ${cur.policy?.readme_top_per_category ?? 15} by composite in each category; everything else that passes the gate is on the site. Think Jev got one wrong? [Say so](https://github.com/${REPO}/issues/new?template=jev-got-it-wrong.yml) and a bot drafts the \`data/overrides.yaml\` change for a maintainer to review. Do not edit this README directly; it is regenerated.`,
  )
  out.push('')
  writeFileSync(join(ROOT, 'README.md'), out.join('\n'))
  console.error(`== README: ${picks.length} entries in ${present.length} sections`)
}

main()
