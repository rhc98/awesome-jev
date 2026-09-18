/**
 * Compare latest Jev judgments against human labels in data/goldset.yaml.
 * Prints and writes (data/calibration.json) the gate threshold sweep, category confusion and
 * confidence reliability, substance rank correlation, gate disagreements, cost/latency from the
 * stored judgments, and a diff against the previous question set where both were run.
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
type Row = { repo: string; g: Gold; a: Judgment['answers'] }

const USD_PER_1M_INPUT = 0.042 // list price, secondary source; output tokens are free

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

function gateStats(rows: Row[], thr: number) {
  let TP = 0
  let FP = 0
  let FN = 0
  let TN = 0
  for (const r of rows) {
    const pred = r.a.genuine.noul >= thr
    if (pred && r.g.genuine) TP++
    else if (pred && !r.g.genuine) FP++
    else if (!pred && r.g.genuine) FN++
    else TN++
  }
  const prec = TP / Math.max(1, TP + FP)
  const rec = TP / Math.max(1, TP + FN)
  const f1 = (2 * prec * rec) / Math.max(1e-9, prec + rec)
  return { thr: +thr.toFixed(1), TP, FP, FN, TN, prec, rec, f1 }
}

function categoryAgreement(rows: Row[]) {
  const cat = rows.filter(r => r.g.category)
  const agree = cat.filter(r => r.a.category.choice === r.g.category).length
  return { n: cat.length, agreement: cat.length ? agree / cat.length : null }
}

function percentile(xs: number[], p: number) {
  const s = [...xs].sort((a, b) => a - b)
  return s.length ? s[Math.min(s.length - 1, Math.floor(s.length * p))] : null
}

function main() {
  const file = join(DATA, 'goldset.yaml')
  if (!existsSync(file)) throw new Error('data/goldset.yaml missing')
  const gold: Record<string, Gold> = parseYaml(readFileSync(file, 'utf8')) ?? {}
  const all = readJsonl<Judgment>(join(DATA, 'judgments.jsonl'))
  const latest = new Map<string, Judgment>()
  const byQset = new Map<string, Map<string, Judgment>>()
  for (const j of all) {
    if (j.qset === QSET) latest.set(j.repo, j)
    if (!byQset.has(j.qset)) byQset.set(j.qset, new Map())
    byQset.get(j.qset)?.set(j.repo, j)
  }

  const rows: Row[] = Object.entries(gold)
    .filter(([repo]) => latest.has(repo))
    .map(([repo, g]) => ({ repo, g, a: (latest.get(repo) as Judgment).answers }))
  const missing = Object.keys(gold).filter(r => !latest.has(r))
  const curatedFile = join(DATA, 'curated.json')
  const gate: number = existsSync(curatedFile)
    ? (JSON.parse(readFileSync(curatedFile, 'utf8')).policy?.gate?.listed_min ?? 0.6)
    : 0.6
  console.log(
    `goldset ${Object.keys(gold).length}, judged ${rows.length}, unjudged ${missing.length}`,
  )
  if (missing.length) console.log('  unjudged:', missing.join(', '))

  // ---- gate sweep ----
  console.log('\n== gate (genuine) threshold sweep')
  console.log('thr   TP  FP  FN  TN  prec  rec   F1')
  const sweep = []
  for (let t = 0.2; t <= 0.9; t += 0.1) {
    const s = gateStats(rows, t)
    sweep.push(s)
    console.log(
      `${t.toFixed(1)}  ${String(s.TP).padStart(3)} ${String(s.FP).padStart(3)} ${String(s.FN).padStart(3)} ${String(s.TN).padStart(3)}  ${s.prec.toFixed(2)}  ${s.rec.toFixed(2)}  ${s.f1.toFixed(2)}`,
    )
  }
  const disagreements = rows
    .filter(r => r.a.genuine.noul >= gate !== r.g.genuine)
    .map(r => ({ repo: r.repo, jev: r.a.genuine.noul, human: r.g.genuine, note: r.g.note ?? '' }))
    .sort((a, b) => a.jev - b.jev)
  if (disagreements.length) {
    console.log(`  disagreements @${gate} (policy listed_min):`)
    for (const d of disagreements)
      console.log(`    ${d.repo.padEnd(45)} jev=${d.jev.toFixed(2)} human=${d.human} ${d.note}`)
  }

  // ---- category ----
  const cat = rows.filter(r => r.g.category)
  const { agreement } = categoryAgreement(rows)
  const confusion: { human: string; jev: string; count: number }[] = []
  const reliability: { lo: number; hi: number; n: number; acc: number }[] = []
  if (cat.length) {
    console.log(
      `\n== category agreement ${cat.filter(r => r.a.category.choice === r.g.category).length}/${cat.length} = ${(agreement as number).toFixed(2)}`,
    )
    const conf: Record<string, Record<string, number>> = {}
    for (const r of cat) {
      const h = r.g.category as string
      const p = r.a.category.choice as string
      conf[h] ??= {}
      conf[h][p] = (conf[h][p] ?? 0) + 1
    }
    console.log('  human → jev:')
    for (const [h, m] of Object.entries(conf)) {
      const cells = Object.entries(m).sort((a, b) => b[1] - a[1])
      for (const [p, n] of cells) confusion.push({ human: h, jev: p, count: n })
      console.log(`    ${h.padEnd(15)} ${cells.map(([p, n]) => `${p}:${n}`).join(' ')}`)
    }
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
      reliability.push({ lo, hi: hi < 1.01 ? hi : 1, n: b.length, acc })
      console.log(`    [${lo},${hi < 1.01 ? hi : 1}) n=${b.length} acc=${acc.toFixed(2)}`)
    }
  }

  // ---- substance ----
  const sub = rows.filter(r => typeof r.g.substance === 'number')
  let substance: { n: number; spearman: number; mae: number } | null = null
  if (sub.length >= 5) {
    const rho = spearman(
      sub.map(r => r.a.substance.score),
      sub.map(r => r.g.substance as number),
    )
    const mae =
      sub.reduce((s, r) => s + Math.abs(r.a.substance.score - (r.g.substance as number)), 0) /
      sub.length
    substance = { n: sub.length, spearman: rho, mae }
    console.log(
      `\n== substance: spearman ${rho.toFixed(2)}, MAE ${mae.toFixed(2)} (n=${sub.length})`,
    )
  }

  // ---- cost & latency, from every stored judgment on the current question set ----
  const calls = all.filter(j => j.qset === QSET)
  const inTok = calls.map(j => Number(j.usage?.input_tokens ?? 0))
  const outTok = calls.map(j => Number(j.usage?.output_tokens ?? 0))
  const lat = calls.map(j => j.latency_ms).filter(Number.isFinite)
  const inputTotal = inTok.reduce((a, b) => a + b, 0)
  const cost = {
    calls: calls.length,
    repos: latest.size,
    input_tokens_total: inputTotal,
    input_tokens_mean: calls.length ? Math.round(inputTotal / calls.length) : 0,
    output_tokens_mean: calls.length
      ? Math.round(outTok.reduce((a, b) => a + b, 0) / calls.length)
      : 0,
    latency_p50_ms: percentile(lat, 0.5),
    latency_p90_ms: percentile(lat, 0.9),
    usd_per_1m_input: USD_PER_1M_INPUT,
    usd_est: (inputTotal / 1e6) * USD_PER_1M_INPUT,
  }
  console.log(
    `\n== cost: ${cost.calls} calls, ${cost.input_tokens_mean} input tok/call, p50 ${cost.latency_p50_ms}ms, p90 ${cost.latency_p90_ms}ms, ≈$${cost.usd_est.toFixed(3)}`,
  )

  // ---- previous question set, on repos judged by both and present in the gold set ----
  const prevName = [...byQset.keys()]
    .filter(q => q !== QSET)
    .sort()
    .at(-1)
  let qset_diff: null | {
    prev: string
    n: number
    rows: { metric: string; prev: number | null; current: number | null }[]
  } = null
  if (prevName) {
    const prev = byQset.get(prevName) as Map<string, Judgment>
    const both: { cur: Row; old: Row }[] = rows
      .filter(r => prev.has(r.repo))
      .map(r => ({ cur: r, old: { ...r, a: (prev.get(r.repo) as Judgment).answers } }))
    if (both.length >= 10) {
      const cur = both.map(b => b.cur)
      const old = both.map(b => b.old)
      const mean = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null)
      const genOf = (rs: Row[], v: boolean) =>
        mean(rs.filter(r => r.g.genuine === v).map(r => r.a.genuine.noul))
      const gs = { prev: gateStats(old, gate), current: gateStats(cur, gate) }
      qset_diff = {
        prev: prevName,
        n: both.length,
        rows: [
          { metric: 'mean genuine, human true', prev: genOf(old, true), current: genOf(cur, true) },
          {
            metric: 'mean genuine, human false',
            prev: genOf(old, false),
            current: genOf(cur, false),
          },
          { metric: `gate precision @${gate}`, prev: gs.prev.prec, current: gs.current.prec },
          { metric: `gate recall @${gate}`, prev: gs.prev.rec, current: gs.current.rec },
          { metric: `gate F1 @${gate}`, prev: gs.prev.f1, current: gs.current.f1 },
          {
            metric: 'category agreement',
            prev: categoryAgreement(old).agreement,
            current: categoryAgreement(cur).agreement,
          },
          {
            metric: 'mean category confidence',
            prev: mean(old.map(r => r.a.category.confidence)),
            current: mean(cur.map(r => r.a.category.confidence)),
          },
        ],
      }
      console.log(`\n== ${prevName} → ${QSET} on ${both.length} shared gold repos`)
      for (const r of qset_diff.rows)
        console.log(
          `  ${r.metric.padEnd(30)} ${(r.prev ?? Number.NaN).toFixed(2)} → ${(r.current ?? Number.NaN).toFixed(2)}`,
        )
    }
  }

  writeJson(join(DATA, 'calibration.json'), {
    qset: QSET,
    computed_at: new Date().toISOString(),
    n: rows.length,
    gate_listed_min: gate,
    gate_sweep: sweep,
    category_agreement: agreement,
    category: { n: cat.length, agreement, confusion, reliability },
    substance,
    disagreements,
    cost,
    qset_diff,
  })
}

main()
