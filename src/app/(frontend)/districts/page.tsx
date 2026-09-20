import type { Metadata } from 'next'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ComingSoonCta } from '@/components/layout/ComingSoonCta'
import { DistrictsDirectory } from '@/components/districts/DistrictsDirectory'
import { SITE_URL } from '@/utilities/site'
import { getDistrictsData } from './getDistrictsData'
import styles from './page.module.css'

// No request-specific data is used, so Next would otherwise fully
// prerender this page once at build time and never reflect newly
// published Districts/Temples. Revalidate periodically instead — same
// cache-first-but-fresh approach as the Home page (docs/architecture.md §14).
export const revalidate = 60

const TITLE = 'Districts — Where Is My Temple'
const DESCRIPTION =
  "Explore temples across Kerala's districts. Browse every district to discover the number of temples documented in each."

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/districts` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/districts`,
    type: 'website',
  },
}

export default async function DistrictsPage() {
  const items = await getDistrictsData()

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <DistrictsDirectory items={items} />
        {/* This directory has little content above it (a heading plus one
            grid), so this banner is likely the Largest Contentful Paint
            element — priority makes Next.js load it eagerly instead of
            flagging it as an unoptimized LCP image. */}
        <ComingSoonCta priority />
      </main>
      <SiteFooter />
    </div>
  )
}
