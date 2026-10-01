import type { Metadata } from 'next'
import { Anek_Malayalam, Plus_Jakarta_Sans } from 'next/font/google'
import React from 'react'

import { SITE_NAME, SITE_URL } from '@/utilities/site'
import './styles.css'

// Site-wide typefaces: Plus Jakarta Sans for English, Anek Malayalam for
// Malayalam-language content (applied via the `:lang(ml)` rule in
// styles.css). Loaded once here so every page under (frontend) gets both.
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-english',
  display: 'swap',
})

const anekMalayalam = Anek_Malayalam({
  subsets: ['malayalam', 'latin'],
  variable: '--font-malayalam',
  display: 'swap',
  // Width axis enabled so the temple name heading can use the condensed
  // end of this variable font via `font-stretch` (see TempleHero.module.css).
  axes: ['wdth'],
})

// Site-wide fallbacks only; every public page sets its own full metadata
// via `pageMetadata()` (src/utilities/site.ts).
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description:
    'Discover thousands of ancient sanctuaries, timeless rituals, and the rich cultural heritage of Kerala’s sacred temples, organized by district.',
  applicationName: SITE_NAME,
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={`${plusJakartaSans.variable} ${anekMalayalam.variable}`}>
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}
