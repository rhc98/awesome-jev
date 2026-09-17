import type { ReactNode } from 'react'

export function Chip({
  children,
  tone = 'plain',
}: {
  children: ReactNode
  tone?: 'plain' | 'accent'
}) {
  const toneClass =
    tone === 'accent'
      ? 'border-accent/40 bg-accent-soft text-accent'
      : 'border-line bg-chip text-muted'
  return (
    <span
      className={`inline-flex items-center rounded border px-1.5 py-0.5 text-[11px] leading-4 ${toneClass}`}
    >
      {children}
    </span>
  )
}
