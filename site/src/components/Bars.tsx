import { num, pct } from '@/lib/format'

/** A 0..1 probability rendered as a labelled horizontal bar. */
export function ProbBar({ label, value, hint }: { label: string; value: number; hint?: string }) {
  const width = `${Math.max(0, Math.min(1, value)) * 100}%`
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-[13px]">
        <span className="text-muted">{label}</span>
        <span className="font-mono tabular-nums">{value.toFixed(2)}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-track">
        <div className="h-full rounded-full bg-accent" style={{ width }} />
      </div>
      {hint ? <p className="mt-1 text-[12px] text-muted">{hint}</p> : null}
    </div>
  )
}

/** A 0..max score (used for substance / docs / novelty on a 0-3 scale). */
export function ScaleBar({
  label,
  value,
  max = 3,
}: {
  label: string
  value: number
  max?: number
}) {
  const width = `${Math.max(0, Math.min(1, value / max)) * 100}%`
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-[13px]">
        <span className="text-muted">{label}</span>
        <span className="font-mono tabular-nums">
          {num(value)} <span className="text-muted">/ {max}</span>
        </span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-track">
        <div className="h-full rounded-full bg-accent" style={{ width }} />
      </div>
    </div>
  )
}

/** Compact inline meter used on cards. */
export function MiniMeter({ label, value }: { label: string; value: number }) {
  const width = `${Math.max(0, Math.min(1, value)) * 100}%`
  return (
    <span className="flex items-center gap-1.5" title={`${label} ${pct(value)}`}>
      <span className="text-[11px] text-muted uppercase tracking-wide">{label}</span>
      <span className="h-1 w-12 overflow-hidden rounded-full bg-track">
        <span className="block h-full rounded-full bg-accent" style={{ width }} />
      </span>
      <span className="font-mono text-[11px] tabular-nums">{value.toFixed(2)}</span>
    </span>
  )
}
