import type { Metadata } from 'next'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ComingSoonCta } from '@/components/layout/ComingSoonCta'
import { EventsHero } from '@/components/events/EventsHero'
import { SpotlightEvent } from '@/components/events/SpotlightEvent'
import { EventsGrid } from '@/components/events/EventsGrid'
import { pageMetadata } from '@/utilities/site'
import { getEventsData } from './getEventsData'
import styles from './page.module.css'

// No request-specific data is used, so Next would otherwise fully
// prerender this page once at build time and never reflect newly
// published Events. Revalidate periodically instead, same as the Home and
// Districts directory pages (docs/architecture.md §14).
export const revalidate = 60

const TITLE = 'Festivals & Events — Where Is My Temple'
const DESCRIPTION =
  'Discover upcoming temple festivals and Utsavams across Kerala, with details on rituals, dates, and the temples that host them.'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/events',
})

export default async function EventsPage() {
  const { spotlightEvent, upcomingEvents } = await getEventsData()

  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <EventsHero />
        {spotlightEvent && <SpotlightEvent event={spotlightEvent} />}
        <EventsGrid events={upcomingEvents} />
        <ComingSoonCta />
      </main>
      <SiteFooter />
    </div>
  )
}
