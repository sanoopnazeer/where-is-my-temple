import { RichText } from '@payloadcms/richtext-lexical/react'

import type { Temple } from '@/payload-types'
import { TempleMap } from '@/components/TempleMap'
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
      <h2 className={styles.heading}>Plan Your Visit</h2>
      <div className={styles.columns}>
        <div>
          {howToReach && (
            <div className={styles.howToReach}>
              <RichText data={howToReach} />
            </div>
          )}

          {transitPoints.length > 0 && (
            <ul className={styles.transitList}>
              {transitPoints.map((point, index) => (
                <li key={point.id ?? index}>
                  <span className={styles.transitType}>{point.type}</span>
                  {point.name} ({point.distance} {point.unit})
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
              Get Directions
            </a>
          )}
        </div>

        <div className={styles.mapWrapper}>
          <TempleMap latitude={temple.latitude} longitude={temple.longitude} />
        </div>
      </div>
    </section>
  )
}
