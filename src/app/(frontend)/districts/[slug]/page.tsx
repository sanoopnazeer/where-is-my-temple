import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ComingSoonCta } from '@/components/layout/ComingSoonCta'
import { DistrictHero } from '@/components/districts/DistrictHero'
import { DistrictTempleList } from '@/components/districts/DistrictTempleList'
import { UpcomingFestivalsSidebar } from '@/components/districts/UpcomingFestivalsSidebar'
import { EventResults } from '@/components/search/EventResults'
import { resolveMediaUrl } from '@/utilities/media'
import { isSearchable, normalizeSearchQuery } from '@/utilities/search'
import { SITE_NAME, pageMetadata } from '@/utilities/site'
import {
  getDistrictBySlug,
  getDistrictTemples,
  getDistrictTemplesMeta,
  getUpcomingFestivals,
  searchDistrictEvents,
} from './getDistrictTemples'
import styles from './page.module.css'

// Reads `searchParams` (`?page=` pagination and the `?q=` district-scoped
// search), which makes Next.js render this route dynamically per request
// rather than a candidate for ISR — unlike the Home and Districts-directory
// pages, so no `revalidate` export is needed here; every request already
// resolves fresh data.
type PageParams = { slug: string }
type PageSearchParams = { page?: string | string[]; q?: string | string[] }

function parsePage(pageParam: string | string[] | undefined): number {
  const raw = Array.isArray(pageParam) ? pageParam[0] : pageParam
  const parsed = Number.parseInt(raw ?? '1', 10)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<PageParams>
  searchParams: Promise<PageSearchParams>
}): Promise<Metadata> {
  const { slug } = await params
  const district = await getDistrictBySlug(slug)
  if (!district) return {}

  const { image } = await getDistrictTemplesMeta(district.id)
  const { q } = await searchParams

  // Canonical is always the plain District URL; `?q=` search results are
  // not public content of their own, so they're kept out of indexes.
  return pageMetadata({
    title: `Temples in ${district.name} — ${SITE_NAME}`,
    description: district.description || `Browse published temples in ${district.name}, Kerala.`,
    path: `/districts/${district.slug}`,
    image: resolveMediaUrl(image),
    noIndex: isSearchable(normalizeSearchQuery(q)),
  })
}

export default async function DistrictTemplePage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>
  searchParams: Promise<PageSearchParams>
}) {
  const { slug } = await params
  const { page: pageParam, q } = await searchParams
  const requestedPage = parsePage(pageParam)
  // Shorter than the minimum length = no search (the full list, as before)
  const normalizedQuery = normalizeSearchQuery(q)
  const query = isSearchable(normalizedQuery) ? normalizedQuery : ''

  const district = await getDistrictBySlug(slug)
  if (!district) {
    notFound()
  }

  const [{ templeIds, image: heroImage }, firstAttempt] = await Promise.all([
    getDistrictTemplesMeta(district.id),
    getDistrictTemples(district.id, requestedPage, query),
  ])

  // A stale/hand-edited ?page= beyond the real range would otherwise show a
  // false "no temples" empty state — fall back to the last real page.
  const { temples, page, totalPages } =
    firstAttempt.totalPages > 0 && requestedPage > firstAttempt.totalPages
      ? await getDistrictTemples(district.id, firstAttempt.totalPages, query)
      : firstAttempt

  const [upcomingFestivals, matchingEvents] = await Promise.all([
    getUpcomingFestivals(templeIds),
    query ? searchDistrictEvents(templeIds, query) : Promise.resolve([]),
  ])

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <DistrictHero district={district} image={heroImage} query={query} />
        <div className={styles.contentGrid}>
          <div className={styles.mainColumn}>
            {query && (
              <EventResults
                heading={`Festivals & Events in ${district.name} matching “${query}”`}
                events={matchingEvents}
                emptyText={`No ongoing or upcoming events in ${district.name} match “${query}”.`}
              />
            )}
            <DistrictTempleList
              district={district}
              temples={temples}
              page={page}
              totalPages={totalPages}
              query={query}
            />
          </div>
          <UpcomingFestivalsSidebar events={upcomingFestivals} />
        </div>
        <ComingSoonCta />
      </main>
      <SiteFooter />
    </div>
  )
}
