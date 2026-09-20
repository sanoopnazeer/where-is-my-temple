import { RichText } from '@payloadcms/richtext-lexical/react'

import type { Temple } from '@/payload-types'
import { TempleMap } from '@/components/TempleMap'
import { BusIcon, DirectionsIcon } from '@/components/icons/TempleIcons'
import styles from './TemplePlanYourVisit.module.css'

export function TemplePlanYourVisit({ temple }: { temple: Temple }) {
  const transitPoints = temple.transitPoints ?? []
  const howToReach = temple.howToReach
  const hasCoordinates =
    typeof temple.latitude === 'number' && typeof temple.longitude === 'number'

  if (!howToReach && transitPoints.length === 0 && !hasCoordinates) {
    return null
  }

  const directionsUrl = hasCoordinates
    ? `https://www.google.com/maps/dir/?api=1&destination=${temple.latitude},${temple.longitude}`
    : undefined

  return (
    <section className={styles.section}>
      <div className={styles.columns}>
        <div className={styles.leftColumn}>
          <h2 className={styles.heading}>Plan Your Visit</h2>

          {howToReach && (
            <div className={styles.howToReach}>
              <RichText data={howToReach} />
            </div>
          )}

          {transitPoints.length > 0 && (
            <ul className={styles.transitList}>
              {transitPoints.map((point, index) => (
                <li key={point.id ?? index} className={styles.transitItem}>
                  <BusIcon className={styles.transitIcon} />
                  <span className={styles.transitDetails}>
                    <span className={styles.transitType}>By {point.type}</span>
                    <span className={styles.transitName}>
                      {point.name} ({point.distance} {point.unit})
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}

          {directionsUrl && (
            <a
              href={directionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.directionsButton}
            >
              <DirectionsIcon className={styles.directionsIcon} />
              Get Directions
            </a>
          )}
        </div>

        <div className={styles.mapWrapper}>
          <TempleMap
            latitude={temple.latitude}
            longitude={temple.longitude}
            className={styles.mapFill}
          />
        </div>
      </div>
    </section>
  )
}
