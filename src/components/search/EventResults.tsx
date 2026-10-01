import Link from 'next/link'

import type { PublicEvent } from '@/app/(frontend)/events/getEventsData'
import { CalendarIcon } from '@/components/icons/TempleIcons'
import { formatEventDateRange } from '@/utilities/eventDate'
import { formatIstDate } from '@/utilities/ist'
import styles from './EventResults.module.css'

/**
 * Event search results, styled after the District page's festival list
 * (day badge + name + date). There's no Event Detail route, so each result
 * links to its Temple's page (owner decision).
 */
export function EventResults({
  heading,
  events,
  emptyText,
}: {
  heading: string
  events: PublicEvent[]
  emptyText: string
}) {
  return (
    <section className={styles.section} aria-label={heading}>
      <h2 className={styles.heading}>
        <CalendarIcon className={styles.headingIcon} aria-hidden="true" />
        {heading}
      </h2>

      {events.length === 0 ? (
        <p className={styles.empty}>{emptyText}</p>
      ) : (
        <ul className={styles.list}>
          {events.map((event) => (
            <li key={event.id}>
              <Link href={`/temples/${event.temple.slug}`} className={styles.item}>
                <span className={styles.dayBadge}>
                  {formatIstDate(event.startDate, { day: 'numeric' })}
                </span>
                <span className={styles.body}>
                  <span className={styles.name}>{event.name}</span>
                  <span className={styles.date}>
                    {formatEventDateRange(event.startDate, event.endDate)}
                  </span>
                  <span className={styles.temple}>at {event.temple.name}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
