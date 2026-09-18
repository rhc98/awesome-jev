import type { Metadata } from 'next'

export const SITE_URL = 'https://awesome-jev.xyz'
export const SITE_NAME = 'Awesome Jev'
export const SITE_DESCRIPTION = 'Projects built on Jev, curated by Jev.'
export const OG_IMAGE = { url: '/og.png', width: 1200, height: 630, alt: SITE_NAME }

type OG = NonNullable<Metadata['openGraph']>

/**
 * Next does not deep-merge `openGraph` between layout and page: a page that sets any
 * openGraph field drops the layout's images. Every page builds its openGraph through this
 * so the social card is never lost.
 */
export function openGraph(overrides: Partial<OG> = {}): OG {
  return {
    siteName: SITE_NAME,
    type: 'website',
    images: [OG_IMAGE],
    ...overrides,
  } as OG
}
