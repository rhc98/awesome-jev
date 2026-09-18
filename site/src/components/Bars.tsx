import { CATEGORY_GATE, GATE, SUBSTANCE_GATE } from '@/lib/data'
import { num } from '@/lib/format'

const clamp = (v: number) => Math.max(0, Math.min(1, v))

/**
 * The signature: a hairline track filled to a probability, with an ink tick at the policy
 * gate. Gates come from curated.policy (see lib/data); pass `gate={null}` for no tick.
 */
function Track({
  value,
  gate,
  size = 'sm',
}: {
  value: number
  gate?: number | null
  size?: 'sm' | 'lg'
}) {
  const h = size === 'lg' ? 'h-1.5' : 'h-[3px]'
  const tick = size === 'lg' ? 'h-3.5 -top-1' : 'h-[7px] -top-[2px]'
  return (
    <span className={`relative block w-full ${h} rounded-full bg-track`}>
      <span
        className={`absolute top-0 left-0 ${h} rounded-full bg-accent`}
        style={{ width: `${clamp(value) * 100}%` }}
      />
      {typeof gate === 'number' ? (
        <span
          aria-hidden="true"
          className={`absolute w-px bg-fg ${tick}`}
          style={{ left: `${clamp(gate) * 100}%` }}
        />
      ) : null}
    </span>
  )
}

/** 0..max quality score as `max` ink segments. Ink, not verdict blue: quality is not the gate. */
function Segments({
  value,
  max = 3,
  size = 'sm',
  gate,
}: {
  value: number
  max?: number
  size?: 'sm' | 'lg'
  gate?: number | null
}) {
  const h = size === 'lg' ? 'h-1.5' : 'h-[3px]'
  const tick = size === 'lg' ? 'h-3.5 -top-1' : 'h-[7px] -top-[2px]'
  return (
    <span className="flex w-full gap-[3px]">
      {Array.from({ length: max }, (_, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: segments are positional by definition
          key={i}
          className={`relative block flex-1 ${h} rounded-[2px] bg-track`}
        >
          <span
            className={`absolute top-0 left-0 ${h} rounded-[2px] bg-fg`}
            style={{ width: `${clamp(value - i) * 100}%` }}
          />
          {typeof gate === 'number' && gate >= i && gate < i + 1 ? (
            <span
              aria-hidden="true"
              className={`absolute w-px bg-accent ${tick}`}
              style={{ left: `${clamp(gate - i) * 100}%` }}
            />
          ) : null}
        </span>
      ))}
    </span>
  )
}

function GateLabel({ at, value }: { at: number; value: number }) {
  return (
    <div className="relative h-4">
      <span
        className="cap absolute -translate-x-1/2 whitespace-nowrap"
        style={{ left: `${clamp(at) * 100}%` }}
      >
        gate {num(value, 1)}
      </span>
    </div>
  )
}

/** Stacked label / value with a large verdict bar. Pass `gate` to draw and label the tick. */
export function ProbBar({
  label,
  value,
  gate,
  hint,
}: {
  label: string
  value: number
  gate?: number
  hint?: string
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-[13px]">
        <span className="text-body">{label}</span>
        <span className="num font-medium font-mono text-fg">{value.toFixed(2)}</span>
      </div>
      <div className="mt-1.5">
        <Track value={value} gate={gate} size="lg" />
      </div>
      {typeof gate === 'number' ? <GateLabel at={gate} value={gate} /> : null}
      {hint ? <p className="mt-1 text-[12px] text-muted">{hint}</p> : null}
    </div>
  )
}

/** Stacked label / value with a large segmented scale. */
export function ScaleBar({
  label,
  value,
  max = 3,
  gate,
}: {
  label: string
  value: number
  max?: number
  gate?: number
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3 text-[13px]">
        <span className="text-body">{label}</span>
        <span className="num font-medium font-mono text-fg">
          {num(value)} <span className="font-normal text-muted">/ {max}</span>
        </span>
      </div>
      <div className="mt-1.5">
        <Segments value={value} max={max} size="lg" gate={gate} />
      </div>
      {typeof gate === 'number' ? <GateLabel at={gate / max} value={gate} /> : null}
    </div>
  )
}

/** Inline cell for rows and cards: mono caption, track, figure. Fixed width so it stacks cleanly. */
export function VerdictCell({
  label,
  value,
  kind = 'prob',
  gate,
  className = '',
}: {
  label: string
  value: number
  kind?: 'prob' | 'scale' | 'category'
  /** Defaults to the policy gate for the kind; pass null for no tick. */
  gate?: number | null
  className?: string
}) {
  const g =
    gate === undefined
      ? kind === 'scale'
        ? SUBSTANCE_GATE
        : kind === 'category'
          ? CATEGORY_GATE
          : GATE
      : gate
  return (
    <span className={`flex w-full min-w-0 items-center gap-2 sm:w-44 ${className}`}>
      <span className="cap w-14 shrink-0">{label}</span>
      {kind === 'scale' ? <Segments value={value} gate={g} /> : <Track value={value} gate={g} />}
      <span className="num w-9 shrink-0 text-right font-medium font-mono text-[13px] text-fg">
        {value.toFixed(2)}
      </span>
    </span>
  )
}
