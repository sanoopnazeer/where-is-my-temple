import type { Metadata } from 'next'

/** Canonical production domain (CLAUDE.md §1) — used for canonical/OG URLs
 * regardless of which environment renders the page. */
export const SITE_URL = 'https://whereismytemple.com'

export const SITE_NAME = 'Where Is My Temple'

/** Existing site asset (public/images/home) used as the share image for
 * pages that have no content image of their own. */
export const DEFAULT_SHARE_IMAGE = `${SITE_URL}/images/home/hero-banner.jpg`

/** Absolute canonical URL for a site path ('/' is the bare domain). */
export function absoluteUrl(path: string): string {
  return path === '/' ? SITE_URL : `${SITE_URL}${path}`
}

/**
 * Title, description, canonical, Open Graph and Twitter/X metadata for a
 * public page, built the same way everywhere. Next.js replaces (not merges)
 * a parent's `openGraph`/`twitter`, so each page gets the full set here.
 */
export function pageMetadata({
  title,
  description,
  path,
  image = DEFAULT_SHARE_IMAGE,
  locale = 'en',
  noIndex = false,
}: {
  title: string
  description?: string
  path: string
  image?: string
  locale?: 'en' | 'ml'
  noIndex?: boolean
}): Metadata {
  const url = absoluteUrl(path)

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: locale === 'ml' ? 'ml_IN' : 'en_IN',
      type: 'website',
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  }
}
