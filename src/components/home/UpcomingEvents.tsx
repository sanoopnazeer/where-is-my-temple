import Image from 'next/image'

import type { Event } from '@/payload-types'
import { resolveMediaUrl } from '@/utilities/media'
import { excerpt } from '@/utilities/richText'
import styles from './UpcomingEvents.module.css'

function formatEventDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
}

/**
 * Event has no image field of its own (docs/content-model.md §4), so each
 * card borrows the linked Temple's heroImage — an existing relationship,
 * not a new field. No event detail page exists yet, so cards are
 * presentational only (no link).
 */
export function UpcomingEvents({ events }: { events: Event[] }) {
  if (events.length === 0) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Upcoming Festivals &amp; Events</h2>
      <div className={styles.grid}>
        {events.map((event) => {
          const temple = typeof event.temple === 'object' ? event.temple : undefined
          const heroImage = temple && typeof temple.heroImage === 'object' ? temple.heroImage : undefined
          const imageUrl = resolveMediaUrl(heroImage)
          const description = excerpt(event.description, 90)

          return (
            <article key={event.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={heroImage?.alt ?? event.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 720px) 100vw, 25vw"
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.imageFallback} />
                )}
              </div>
              <div className={styles.body}>
                <span className={styles.date}>{formatEventDate(event.startDate)}</span>
                <h3 className={styles.name}>{event.name}</h3>
                {description && <p className={styles.description}>{description}</p>}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
