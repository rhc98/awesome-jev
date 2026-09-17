/**
 * Generate README.md from data/curated.json. README is a build artifact — never hand-edit.
 * Format follows sindresorhus/awesome-lint: `- [Name](url) - Description.`
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import type { Entry } from './curate.js'
import { DATA, ROOT, readJson } from './lib/store.js'

const SITE = 'https://awesome-jev.xyz'
const REPO = 'rhc98/awesome-jev'

const SECTIONS: { id: string; title: string; blurb: string }[] = [
  { id: 'official', title: 'Official', blurb: 'Maintained by TypeSafe AI.' },
  {
    id: 'sdk_client',
    title: 'SDKs and Clients',
    blurb: 'Language bindings, CLIs, and thin wrappers for the API.',
  },
  {
    id: 'integration',
    title: 'Integrations',
    blurb: 'Jev wired into frameworks, gateways, platforms, and databases.',
  },
  {
    id: 'agent_tooling',
    title: 'Agent and Developer Tooling',
    blurb: 'Routers, guards, reviewers, skills, and MCP servers for coding agents.',
  },
  {
    id: 'application',
    title: 'Applications',
    blurb: 'Products and features whose behavior depends on Jev decisions.',
  },
  { id: 'game_sim', title: 'Games, Robotics, and Simulation', blurb: 'Jev in a control loop.' },
  {
    id: 'research_eval',
    title: 'Research, Evals, and Reimplementations',
    blurb: 'Benchmarks, calibration studies, and open replicas.',
  },
  { id: 'learning', title: 'Learning', blurb: 'Tutorials, example galleries, and playgrounds.' },
  { id: 'meta_list', title: 'Other Lists', blurb: 'Community-maintained lists and directories.' },
  { id: 'other', title: 'Other', blurb: 'Genuine Jev projects that fit no category above.' },
]

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/ /g, '-')

function describe(e: Entry): string | null {
  let d = (e.description ?? '').replace(/\s+/g, ' ').trim()
  if (!d) return null
  d = d.charAt(0).toUpperCase() + d.slice(1)
  if (!/[.!?]$/.test(d)) d += '.'
  return d
}

function main() {
  const cur = readJson<{ generated_at: string; stats: any; entries: Entry[] }>(
    join(DATA, 'curated.json'),
    null as any,
  )
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
  out.push(
    `Missing project? [Open an issue](https://github.com/${REPO}/issues/new?template=submit.yml) with the link; the pipeline picks it up on the next run. Think Jev got one wrong? Edit \`data/overrides.yaml\` with a reason and open a pull request. Do not edit this README directly; it is regenerated.`,
  )
  out.push('')
  writeFileSync(join(ROOT, 'README.md'), out.join('\n'))
  console.error(`== README: ${picks.length} entries in ${present.length} sections`)
}

main()
