import type { Event } from '@/payload-types'
import { CalendarIcon } from '@/components/icons/TempleIcons'
import { formatIstDate } from '@/utilities/ist'
import { excerpt } from '@/utilities/richText'
import styles from './UpcomingFestivalsSidebar.module.css'

function formatFestivalDate(startDate: string): string {
  return formatIstDate(startDate, { month: 'long', day: 'numeric', year: 'numeric' })
}

/**
 * `design/desktop/District Temple.jpg`'s "Most Visited" sidebar section is
 * intentionally not implemented — it would need view-count analytics that
 * don't exist anywhere in this architecture, and the owner asked to leave
 * it out entirely rather than show placeholder data. Festival items are
 * non-interactive: there's no public Event Detail route yet, and the
 * design doesn't present these as clickable (no "View Details"-style
 * affordance, unlike the Temple cards next to them).
 */
export function UpcomingFestivalsSidebar({ events: allEvents }: { events: Event[] }) {
  // Dates are optional in the CMS; an event without a start date can't be shown.
  const events = allEvents.filter(
    (event): event is Event & { startDate: string } => typeof event.startDate === 'string',
  )
  if (events.length === 0) return null

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.heading}>
        <CalendarIcon className={styles.headingIcon} />
        Upcoming Festivals
      </h2>
      <ul className={styles.list}>
        {events.map((event) => {
          const description = excerpt(event.description, 110)
          const day = formatIstDate(event.startDate, { day: 'numeric' })

          return (
            <li key={event.id} className={styles.item}>
              <span className={styles.dayBadge}>{day}</span>
              <div className={styles.itemBody}>
                <h3 className={styles.itemName}>{event.name}</h3>
                <p className={styles.itemDate}>{formatFestivalDate(event.startDate)}</p>
                {description && <p className={styles.itemDescription}>{description}</p>}
              </div>
            </li>
          )
        })}
      </ul>
    </aside>
  )
}
