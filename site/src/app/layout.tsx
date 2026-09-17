import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteNav } from '@/components/SiteNav'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://awesome-jev.xyz'),
  title: {
    default: 'Awesome Jev',
    template: '%s — Awesome Jev',
  },
  description: 'Projects built on Jev, curated by Jev.',
  openGraph: {
    title: 'Awesome Jev',
    description: 'Projects built on Jev, curated by Jev.',
    url: 'https://awesome-jev.xyz',
    siteName: 'Awesome Jev',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans text-[15px] leading-relaxed">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 sm:px-6">
          <SiteNav />
          <main className="flex-1 pb-16">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  )
}
