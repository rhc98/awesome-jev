/** Print a compact table of curated entries for eyeballing. `--status review` `--limit 40` */
import { join } from 'node:path'
import type { Entry } from './curate.js'
import { arg, DATA, readJson } from './lib/store.js'

const cur = readJson<{ stats: any; entries: Entry[] }>(join(DATA, 'curated.json'), {
  stats: {},
  entries: [],
})
const status = arg('status')
const limit = Number(arg('limit') ?? 60)
let rows = cur.entries
if (status) rows = rows.filter(e => e.status === status)
console.log(JSON.stringify(cur.stats))
console.log('status   gen  cat(conf)                sub doc nov comp ★     repo')
for (const e of rows.slice(0, limit)) {
  const j = e.jev
  console.log(
    `${e.status.padEnd(8)} ${j.genuine.toFixed(2)} ${(e.category + '(' + j.category_conf.toFixed(2) + ')').padEnd(24)} ${j.substance.toFixed(1)} ${j.docs.toFixed(1)} ${j.novelty.toFixed(1)} ${j.composite.toFixed(2)} ${String(e.stars).padEnd(5)} ${e.repo}${e.readme_pick ? ' *' : ''}`,
  )
}
