import Image from 'next/image'
import Link from 'next/link'

import type { PublicEvent } from '@/app/(frontend)/events/getEventsData'
import { PinIcon, SparkleIcon } from '@/components/icons/TempleIcons'
import { resolveMediaUrl } from '@/utilities/media'
import { excerpt } from '@/utilities/richText'
import { eventDurationLabel, formatEventDateRange } from '@/utilities/eventDate'
import styles from './SpotlightEvent.module.css'

/**
 * Uses the existing Event `spotlight` field only (`getEventsData.ts`) — no
 * new ranking/popularity mechanism. The design's "Grand Climax" line and
 * the "(Medam - Edavam)" Malayalam-calendar date annotation have no
 * backing field (Malayalam-calendar conversion is out of scope for V1,
 * CLAUDE.md §4) and are omitted rather than invented; "Key Ritual" maps to
 * the real `keyRitual` field. Links to the linked Temple's real detail
 * page — the design's varied labels ("36-Hour Continuous Ritual", etc.)
 * implied features (a dedicated event page) that don't exist.
 */
export function SpotlightEvent({ event }: { event: PublicEvent }) {
  const heroImage =
    typeof event.temple.heroImage === 'object' && event.temple.heroImage ? event.temple.heroImage : undefined
  const imageUrl = resolveMediaUrl(event.temple.heroImage)
  const districtName = typeof event.temple.district === 'object' && event.temple.district
      ? event.temple.district.name
      : undefined
  const description = excerpt(event.description, 220)

  return (
    <section className={styles.section}>
      <div className={styles.heading}>
        <SparkleIcon className={styles.headingIcon} />
        <h2 className={styles.headingText}>Spotlight Celebration</h2>
      </div>

      <div className={styles.card}>
        <div className={styles.imageWrapper}>
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={heroImage?.alt ?? event.name}
              fill
              sizes="(max-width: 900px) 100vw, 55vw"
              className={styles.image}
            />
          ) : (
            <div className={styles.imageFallback} />
          )}
        </div>

        <div className={styles.body}>
          <p className={styles.location}>
            <PinIcon className={styles.locationIcon} />
            {[event.temple.name, event.temple.locality, districtName].filter(Boolean).join(', ')}
          </p>
          <h3 className={styles.name}>{event.name}</h3>

          <div className={styles.metaRow}>
            <span className={styles.metaPill}>{formatEventDateRange(event.startDate, event.endDate)}</span>
            <span className={styles.metaPill}>{eventDurationLabel(event.startDate, event.endDate)}</span>
          </div>

          {description && <p className={styles.description}>{description}</p>}

          {event.keyRitual && (
            <div className={styles.ritual}>
              <span className={styles.ritualLabel}>Key Ritual</span>
              <span className={styles.ritualValue}>{event.keyRitual}</span>
            </div>
          )}

          <Link href={`/temples/${event.temple.slug}`} className={styles.link}>
            View Temple →
          </Link>
        </div>
      </div>
    </section>
  )
}
