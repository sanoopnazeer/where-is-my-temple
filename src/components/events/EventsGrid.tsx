import Image from 'next/image'
import Link from 'next/link'

import type { PublicEvent } from '@/app/(frontend)/events/getEventsData'
import { PinIcon } from '@/components/icons/TempleIcons'
import { resolveMediaUrl } from '@/utilities/media'
import { excerpt } from '@/utilities/richText'
import { eventDurationLabel, formatEventDateRange } from '@/utilities/eventDate'
import styles from './EventsGrid.module.css'

/**
 * The design's per-card category badges ("MAJOR FESTIVAL", "WORLD RECORD
 * GATHERING", etc.) have no dedicated field — they're rendered from the
 * Event's own `keywords` array (real editor-entered tags), the first
 * keyword as the prominent image badge and the rest as pills, rather than
 * inventing a category taxonomy. Multi-temple location claims from the
 * design ("Sabarimala, Guruvayur & Statewide") aren't possible — an Event
 * belongs to exactly one Temple — so location shows that Temple's own
 * name/locality/District (via Temple → District). Links go to the linked
 * Temple's real page — there's no Event Detail route.
 */
export function EventsGrid({ events }: { events: PublicEvent[] }) {
  if (events.length === 0) {
    return (
      <section className={styles.section}>
        <h2 className={styles.heading}>Upcoming Temple Utsavams</h2>
        <p className={styles.empty}>No upcoming festivals are published yet. Check back soon.</p>
      </section>
    )
  }

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Upcoming Temple Utsavams</h2>
      <div className={styles.grid}>
        {events.map((event) => {
          const heroImage =
            typeof event.temple.heroImage === 'object' && event.temple.heroImage
              ? event.temple.heroImage
              : undefined
          const imageUrl = resolveMediaUrl(event.temple.heroImage)
          const districtName =
            typeof event.temple.district === 'object' ? event.temple.district.name : undefined
          const description = excerpt(event.description, 100)
          const keywords = (event.keywords ?? []).map((k) => k.keyword).filter(Boolean)
          const [badge, ...pills] = keywords

          return (
            <article key={event.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={heroImage?.alt ?? event.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 720px) 100vw, 33vw"
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.imageFallback} />
                )}
                {badge && <span className={styles.badge}>{badge}</span>}
                <span className={styles.dateBadge}>
                  {formatEventDateRange(event.startDate, event.endDate)}
                </span>
              </div>

              <div className={styles.body}>
                <p className={styles.location}>
                  <PinIcon className={styles.locationIcon} />
                  {[event.temple.name, districtName].filter(Boolean).join(', ')}
                </p>
                <h3 className={styles.name}>{event.name}</h3>
                {description && <p className={styles.description}>{description}</p>}

                {pills.length > 0 && (
                  <div className={styles.pillRow}>
                    {pills.map((keyword) => (
                      <span key={keyword} className={styles.pill}>
                        {keyword}
                      </span>
                    ))}
                    <span className={styles.pill}>{eventDurationLabel(event.startDate, event.endDate)}</span>
                  </div>
                )}

                <Link href={`/temples/${event.temple.slug}`} className={styles.link}>
                  View Temple →
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
