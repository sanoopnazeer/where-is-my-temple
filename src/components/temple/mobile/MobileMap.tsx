'use client'

import { useState } from 'react'

import { MarkerTempleIcon } from './MobileIcons'
import styles from './MobileMap.module.css'

const MIN_ZOOM = 8
const MAX_ZOOM = 20
const DEFAULT_ZOOM = 15

function formatCoordinates(latitude: number, longitude: number): string {
  const lat = `${Math.abs(latitude).toFixed(4)}° ${latitude >= 0 ? 'N' : 'S'}`
  const lng = `${Math.abs(longitude).toFixed(4)}° ${longitude >= 0 ? 'E' : 'W'}`
  return `${lat}, ${lng}`
}

/** Map card from the mobile design: Google Maps embed (same API key and
 * coordinates as `TempleMap`, ADR-008) with the coordinate chip, the temple
 * name pin and working zoom buttons laid over it. */
export function MobileMap({
  latitude,
  longitude,
  name,
  apiKey,
}: {
  latitude: number
  longitude: number
  name: string
  apiKey?: string
}) {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM)

  return (
    <div className={styles.map}>
      {apiKey ? (
        <iframe
          className={styles.frame}
          src={`https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(apiKey)}&q=${latitude},${longitude}&zoom=${zoom}`}
          loading="lazy"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          title="Temple location map"
        />
      ) : (
        <div className={styles.placeholder} role="img" aria-label="Map unavailable" />
      )}

      <span className={styles.coordinates}>
        <span className={styles.dot} />
        {formatCoordinates(latitude, longitude)}
      </span>

      <div className={styles.zoom}>
        <button
          type="button"
          aria-label="Zoom in"
          disabled={zoom >= MAX_ZOOM}
          onClick={() => setZoom((value) => Math.min(MAX_ZOOM, value + 1))}
        >
          +
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          disabled={zoom <= MIN_ZOOM}
          onClick={() => setZoom((value) => Math.max(MIN_ZOOM, value - 1))}
        >
          −
        </button>
      </div>

      <span className={styles.pin}>
        <MarkerTempleIcon className={styles.pinIcon} />
        {name}
      </span>
    </div>
  )
}
