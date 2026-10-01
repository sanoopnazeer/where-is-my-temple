import type { Metadata } from 'next'
import Link from 'next/link'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { TempleCardList } from '@/components/districts/DistrictTempleList'
import { BuildingIcon, PinIcon } from '@/components/icons/TempleIcons'
import { EventResults } from '@/components/search/EventResults'
import { SearchForm } from '@/components/search/SearchForm'
import { MIN_SEARCH_LENGTH, isSearchable, normalizeSearchQuery } from '@/utilities/search'
import { getSearchResults } from './getSearchResults'
import styles from './page.module.css'

// Reads `searchParams` (`?q=`), so this route renders dynamically per
// request; result pages are kept out of search engine indexes.
export const metadata: Metadata = {
  title: 'Search — Where Is My Temple',
  description: 'Search Kerala temples, festivals and districts.',
  robots: { index: false, follow: true },
}

type PageSearchParams = { q?: string | string[] }

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<PageSearchParams>
}) {
  const query = normalizeSearchQuery((await searchParams).q)
  const results = isSearchable(query) ? await getSearchResults(query) : null
  const total = results ? results.temples.length + results.events.length + results.districts.length : 0

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main className={styles.main}>
        <section className={styles.intro}>
          <h1 className={styles.heading}>{results ? `Results for “${query}”` : 'Search'}</h1>
          <p className={styles.subheading}>Temples, festivals and districts across Kerala</p>
          <div className={styles.form}>
            <SearchForm
              action="/search"
              defaultValue={query}
              label="Search temples, events and districts"
            />
          </div>
        </section>

        {!results ? (
          <p className={styles.state}>
            {query
              ? `Enter at least ${MIN_SEARCH_LENGTH} characters to search.`
              : 'Search by temple name, pooja, locality, festival or district.'}
          </p>
        ) : total === 0 ? (
          <div className={styles.state}>
            <p>No temples, events or districts match “{query}”.</p>
            <p className={styles.stateLinks}>
              <Link href="/districts">Browse all districts</Link>
              <Link href="/events">See Festivals &amp; Events</Link>
            </p>
          </div>
        ) : (
          <div className={styles.results}>
            <p className={styles.summary}>
              {results.templeTotal} {results.templeTotal === 1 ? 'temple' : 'temples'} ·{' '}
              {results.events.length} {results.events.length === 1 ? 'event' : 'events'} ·{' '}
              {results.districtTotal} {results.districtTotal === 1 ? 'district' : 'districts'}
            </p>

            {results.temples.length > 0 && (
              <section className={styles.group} aria-label="Temples">
                <h2 className={styles.groupHeading}>
                  <BuildingIcon className={styles.groupIcon} aria-hidden="true" />
                  Temples ({results.templeTotal})
                </h2>
                <TempleCardList temples={results.temples} />
                {results.templeTotal > results.temples.length && (
                  <p className={styles.more}>
                    Showing the first {results.temples.length} of {results.templeTotal} temples —
                    refine your search to narrow them down.
                  </p>
                )}
              </section>
            )}

            {results.events.length > 0 && (
              <div className={styles.group}>
                <EventResults
                  heading={`Festivals & Events (${results.events.length})`}
                  events={results.events}
                  emptyText=""
                />
                {results.eventTotal > results.events.length && (
                  <p className={styles.more}>
                    <Link href="/events">See all Festivals &amp; Events →</Link>
                  </p>
                )}
              </div>
            )}

            {results.districts.length > 0 && (
              <section className={styles.group} aria-label="Districts">
                <h2 className={styles.groupHeading}>
                  <PinIcon className={styles.groupIcon} aria-hidden="true" />
                  Districts ({results.districtTotal})
                </h2>
                <ul className={styles.districtList}>
                  {results.districts.map((district) => (
                    <li key={district.id}>
                      <Link href={`/districts/${district.slug}`} className={styles.districtCard}>
                        <span className={styles.districtName}>{district.name}</span>
                        <span className={styles.districtLink}>View temples →</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {results.districtTotal > results.districts.length && (
                  <p className={styles.more}>
                    <Link href="/districts">View All Districts →</Link>
                  </p>
                )}
              </section>
            )}
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  )
}
