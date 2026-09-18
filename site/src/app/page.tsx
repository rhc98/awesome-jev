import type { Metadata } from 'next'
import Link from 'next/link'
import { Directory } from '@/components/Directory'
import { curated } from '@/lib/data'
import { formatDate } from '@/lib/format'
import { openGraph } from '@/lib/seo'

// Filters live in the query string; every combination is the same document.
export const metadata: Metadata = {
  alternates: { canonical: '/' },
  openGraph: openGraph({ url: '/' }),
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="num font-medium font-mono text-[22px] text-fg leading-7">{value}</span>
      <span className="cap">{label}</span>
    </div>
  )
}

export default function HomePage() {
  const { stats, generated_at } = curated

  return (
    <div>
      <section className="pt-8 pb-6">
        <h1 className="font-semibold text-[28px] leading-9 tracking-[-0.02em] sm:text-[32px] sm:leading-10">
          Awesome Jev
        </h1>
        <p className="mt-2 max-w-2xl text-body">
          Projects built on Jev, curated by Jev. Every repository below was collected from GitHub
          and judged by Jev in a single call. Code applies the policy; nothing was hand-picked.{' '}
          <Link href="/how-it-works" className="text-accent hover:underline">
            How it works
          </Link>
          .
        </p>

        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4 rounded-md bg-panel-alt px-4 py-3.5">
          <Stat label="judged" value={stats.total} />
          <Stat label="listed" value={stats.listed} />
          <Stat label="review" value={stats.review} />
          <Stat label="excluded" value={stats.excluded} />
          <Stat label="generated" value={formatDate(generated_at)} />
        </div>
      </section>

      <Directory />
    </div>
  )
}
