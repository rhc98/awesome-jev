import type { ReactNode } from 'react'

export function Chip({
  children,
  tone = 'plain',
}: {
  children: ReactNode
  tone?: 'plain' | 'outline' | 'accent'
}) {
  const toneClass =
    tone === 'accent'
      ? 'border-accent bg-accent-soft text-accent'
      : tone === 'outline'
        ? 'border-line bg-transparent text-body'
        : 'border-transparent bg-chip text-body'
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[12px] leading-4 ${toneClass}`}
    >
      {children}
    </span>
  )
}
