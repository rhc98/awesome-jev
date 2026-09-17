/**
 * Compare latest Jev judgments against human labels in data/goldset.yaml.
 * Reports gate precision/recall/F1 across a threshold sweep, category agreement + confusion,
 * substance rank correlation, and a confidence-vs-accuracy reliability table.
 *
 * goldset.yaml format:
 *   owner/repo:
 *     genuine: true|false
 *     category: agent_tooling        # optional
 *     substance: 0|1|2|3             # optional
 *     note: free text                # optional
 */
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { parse as parseYaml } from 'yaml'
import type { Judgment } from './judge.js'
import { DATA, readJsonl, writeJson } from './lib/store.js'
import { QSET } from './questions.v2.js'

type Gold = { genuine: boolean; category?: string; substance?: number; note?: string }

function spearman(a: number[], b: number[]): number {
  const rank = (xs: number[]) => {
    const idx = xs.map((v, i) => [v, i] as const).sort((p, q) => p[0] - q[0])
    const r = new Array(xs.length)
    for (let i = 0; i < idx.length; ) {
      let j = i
      while (j + 1 < idx.length && idx[j + 1][0] === idx[i][0]) j++
      const avg = (i + j) / 2 + 1
      for (let k = i; k <= j; k++) r[idx[k][1]] = avg
      i = j + 1
    }
    return r
  }
  const ra = rank(a)
  const rb = rank(b)
  const n = a.length
  const d2 = ra.reduce((s, x, i) => s + (x - rb[i]) ** 2, 0)
  return 1 - (6 * d2) / (n * (n * n - 1))
}

function main() {
  const file = join(DATA, 'goldset.yaml')
  if (!existsSync(file)) throw new Error('data/goldset.yaml missing')
  const gold: Record<string, Gold> = parseYaml(readFileSync(file, 'utf8')) ?? {}
  const latest = new Map<string, Judgment>()
  for (const j of readJsonl<Judgment>(join(DATA, 'judgments.jsonl')))
    if (j.qset === QSET) latest.set(j.repo, j)

  const rows = Object.entries(gold)
    .filter(([repo]) => latest.has(repo))
    .map(([repo, g]) => ({ repo, g, a: (latest.get(repo) as Judgment).answers }))
  const missing = Object.keys(gold).filter(r => !latest.has(r))
  console.log(
    `goldset ${Object.keys(gold).length}, judged ${rows.length}, unjudged ${missing.length}`,
  )
  if (missing.length) console.log('  unjudged:', missing.join(', '))

  // ---- gate sweep ----
  console.log('\n== gate (genuine) threshold sweep')
  console.log('thr   TP  FP  FN  TN  prec  rec   F1')
  const sweep: any[] = []
  for (let t = 0.2; t <= 0.9; t += 0.1) {
    let TP = 0
    let FP = 0
    let FN = 0
    let TN = 0
    for (const r of rows) {
      const pred = r.a.genuine.noul >= t
      if (pred && r.g.genuine) TP++
      else if (pred && !r.g.genuine) FP++
      else if (!pred && r.g.genuine) FN++
      else TN++
    }
    const prec = TP / Math.max(1, TP + FP)
    const rec = TP / Math.max(1, TP + FN)
    const f1 = (2 * prec * rec) / Math.max(1e-9, prec + rec)
    sweep.push({ thr: +t.toFixed(1), TP, FP, FN, TN, prec, rec, f1 })
    console.log(
      `${t.toFixed(1)}  ${String(TP).padStart(3)} ${String(FP).padStart(3)} ${String(FN).padStart(3)} ${String(TN).padStart(3)}  ${prec.toFixed(2)}  ${rec.toFixed(2)}  ${f1.toFixed(2)}`,
    )
  }
  const errs = rows.filter(r => r.a.genuine.noul >= 0.6 !== r.g.genuine)
  if (errs.length) {
    console.log('  disagreements @0.6:')
    for (const r of errs)
      console.log(
        `    ${r.repo.padEnd(45)} jev=${r.a.genuine.noul.toFixed(2)} human=${r.g.genuine} ${r.g.note ?? ''}`,
      )
  }

  // ---- category ----
  const cat = rows.filter(r => r.g.category)
  if (cat.length) {
    const agree = cat.filter(r => r.a.category.choice === r.g.category).length
    console.log(
      `\n== category agreement ${agree}/${cat.length} = ${(agree / cat.length).toFixed(2)}`,
    )
    const conf: Record<string, Record<string, number>> = {}
    for (const r of cat) {
      const h = r.g.category as string
      const p = r.a.category.choice as string
      conf[h] ??= {}
      conf[h][p] = (conf[h][p] ?? 0) + 1
    }
    console.log('  human → jev:')
    for (const [h, m] of Object.entries(conf))
      console.log(
        `    ${h.padEnd(15)} ${Object.entries(m)
          .sort((a, b) => b[1] - a[1])
          .map(([p, n]) => `${p}:${n}`)
          .join(' ')}`,
      )
    // reliability: bucket by confidence
    console.log('  confidence → accuracy:')
    for (const [lo, hi] of [
      [0, 0.5],
      [0.5, 0.7],
      [0.7, 0.9],
      [0.9, 1.01],
    ]) {
      const b = cat.filter(r => r.a.category.confidence >= lo && r.a.category.confidence < hi)
      if (!b.length) continue
      const acc = b.filter(r => r.a.category.choice === r.g.category).length / b.length
      console.log(`    [${lo},${hi < 1.01 ? hi : 1}) n=${b.length} acc=${acc.toFixed(2)}`)
    }
  }

  // ---- substance ----
  const sub = rows.filter(r => typeof r.g.substance === 'number')
  if (sub.length >= 5) {
    const rho = spearman(
      sub.map(r => r.a.substance.score),
      sub.map(r => r.g.substance as number),
    )
    const mae =
      sub.reduce((s, r) => s + Math.abs(r.a.substance.score - (r.g.substance as number)), 0) /
      sub.length
    console.log(
      `\n== substance: spearman ${rho.toFixed(2)}, MAE ${mae.toFixed(2)} (n=${sub.length})`,
    )
  }

  writeJson(join(DATA, 'calibration.json'), {
    qset: QSET,
    computed_at: new Date().toISOString(),
    n: rows.length,
    gate_sweep: sweep,
    category_agreement: cat.length
      ? cat.filter(r => r.a.category.choice === r.g.category).length / cat.length
      : null,
  })
}

main()
