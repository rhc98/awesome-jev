import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Not found', robots: { index: false } }

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="font-semibold text-2xl tracking-tight">Not found</h1>
      <p className="mt-2 text-muted">That page is not part of the curated index.</p>
      <Link href="/" className="mt-4 inline-block text-accent hover:underline">
        Back to the index
      </Link>
    </div>
  )
}
