import styles from './TempleMap.module.css'

export interface TempleMapProps {
  /** Decimal latitude — Temple.latitude. No map renders if missing/invalid. */
  latitude?: number | null
  /** Decimal longitude — Temple.longitude. No map renders if missing/invalid. */
  longitude?: number | null
  /** Google Maps zoom level. Defaults to a level appropriate for a single building/compound. */
  zoom?: number
  className?: string
}

const DEFAULT_ZOOM = 15

function isValidCoordinate(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

/**
 * Renders a temple's location via the Google Maps Embed API ("place" mode),
 * using only the coordinates already stored on the Temple — no geocoding,
 * places lookup, or extra data fetch. See docs/decisions.md ADR-008.
 */
export function TempleMap({ latitude, longitude, zoom = DEFAULT_ZOOM, className }: TempleMapProps) {
  if (!isValidCoordinate(latitude) || !isValidCoordinate(longitude)) {
    return null
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY
  const frameClassName = className ? `${styles.mapFrame} ${className}` : styles.mapFrame
  const placeholderClassName = className ? `${styles.placeholder} ${className}` : styles.placeholder

  if (!apiKey) {
    return (
      <div className={placeholderClassName} role="img" aria-label="Map unavailable">
        {process.env.NODE_ENV === 'production'
          ? 'Map is currently unavailable.'
          : 'Map preview unavailable — set NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY in .env to enable it locally.'}
      </div>
    )
  }

  const src = `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(apiKey)}&q=${latitude},${longitude}&zoom=${zoom}`

  return (
    <iframe
      className={frameClassName}
      src={src}
      loading="lazy"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      title="Temple location map"
    />
  )
}
