import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ComingSoonCta } from '@/components/layout/ComingSoonCta'
import { DistrictHero } from '@/components/districts/DistrictHero'
import { DistrictTempleList } from '@/components/districts/DistrictTempleList'
import { UpcomingFestivalsSidebar } from '@/components/districts/UpcomingFestivalsSidebar'
import { SITE_URL } from '@/utilities/site'
import {
  getDistrictBySlug,
  getDistrictTemples,
  getDistrictTemplesMeta,
  getUpcomingFestivals,
} from './getDistrictTemples'
import styles from './page.module.css'

// Reads `searchParams` (the `?page=` pagination param), which makes Next.js
// render this route dynamically per request rather than a candidate for
// ISR — unlike the Home and Districts-directory pages, so no `revalidate`
// export is needed here; every request already resolves fresh data.
type PageParams = { slug: string }
type PageSearchParams = { page?: string | string[] }

function parsePage(pageParam: string | string[] | undefined): number {
  const raw = Array.isArray(pageParam) ? pageParam[0] : pageParam
  const parsed = Number.parseInt(raw ?? '1', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

export async function generateMetadata({
  params,
}: {
  params: Promise<PageParams>
}): Promise<Metadata> {
  const { slug } = await params
  const district = await getDistrictBySlug(slug)
  if (!district) return {}

  const title = `Temples in ${district.name} — Where Is My Temple`
  const description = district.description || `Browse published temples in ${district.name}, Kerala.`
  const canonicalUrl = `${SITE_URL}/districts/${district.slug}`

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
    },
  }
}

export default async function DistrictTemplePage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>
  searchParams: Promise<PageSearchParams>
}) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  const requestedPage = parsePage(pageParam)

  const district = await getDistrictBySlug(slug)
  if (!district) {
    notFound()
  }

  const [{ templeIds, image: heroImage }, firstAttempt] = await Promise.all([
    getDistrictTemplesMeta(district.id),
    getDistrictTemples(district.id, requestedPage),
  ])

  // A stale/hand-edited ?page= beyond the real range would otherwise show a
  // false "no temples" empty state — fall back to the last real page.
  const { temples, page, totalPages } =
    firstAttempt.totalPages > 0 && requestedPage > firstAttempt.totalPages
      ? await getDistrictTemples(district.id, firstAttempt.totalPages)
      : firstAttempt

  const upcomingFestivals = await getUpcomingFestivals(templeIds)

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <DistrictHero district={district} image={heroImage} />
        <div className={styles.contentGrid}>
          <DistrictTempleList district={district} temples={temples} page={page} totalPages={totalPages} />
          <UpcomingFestivalsSidebar events={upcomingFestivals} />
        </div>
        <ComingSoonCta />
      </main>
      <SiteFooter />
    </div>
  )
}
