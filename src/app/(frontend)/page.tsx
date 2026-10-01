import type { Metadata } from 'next'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ComingSoonCta } from '@/components/layout/ComingSoonCta'
import { HomeHero } from '@/components/home/HomeHero'
import { UpcomingEvents } from '@/components/home/UpcomingEvents'
import { HeritageBanner } from '@/components/home/HeritageBanner'
import { DistrictsGrid } from '@/components/home/DistrictsGrid'
import { FeaturedTemples } from '@/components/home/FeaturedTemples'
import { JsonLd } from '@/components/seo/JsonLd'
import { pageMetadata } from '@/utilities/site'
import { websiteJsonLd } from '@/utilities/structuredData'
import { getHomeData } from './getHomeData'
import styles from './page.module.css'

// No request-specific data is used, so Next would otherwise fully
// prerender this page once at build time and never reflect newly
// published content. Revalidate periodically instead — cache-friendly
// (docs/architecture.md §14) while keeping published changes reasonably
// fresh, without forcing every request to hit the database.
export const revalidate = 60

const TITLE = 'Where Is My Temple — Discover Kerala’s Sacred Temples'
const DESCRIPTION =
  'Discover thousands of ancient sanctuaries, timeless rituals, and the rich cultural heritage of Kerala’s sacred temples, organized by district.'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/',
})

export default async function HomePage() {
  const { upcomingEvents, districtCards, featuredTemples } = await getHomeData()

  return (
    <div className={styles.page}>
      <JsonLd data={websiteJsonLd()} />
      <SiteHeader />
      <main>
        <HomeHero />
        <UpcomingEvents events={upcomingEvents} />
        <HeritageBanner />
        <DistrictsGrid cards={districtCards} />
        <FeaturedTemples temples={featuredTemples} />
        <ComingSoonCta />
      </main>
      <SiteFooter />
    </div>
  )
}
