import Image from 'next/image'

import { SearchIcon } from '@/components/icons/TempleIcons'
import styles from './HomeHero.module.css'

/**
 * Background is a static website asset under public/images/home (not
 * Payload Media/R2 — see docs/development-status.md). The search bar is
 * presentational only — search is a separate, not-yet-built phase, so it's
 * rendered disabled rather than wired to a route that doesn't exist yet.
 */
export function HomeHero() {
  return (
    <section className={styles.hero}>
      <div className={styles.bgWrapper}>
        <Image
          src="/images/home/hero-banner.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className={styles.bgImage}
        />
        <div className={styles.overlay} />
      </div>
      <div className={styles.content}>
        <h1 className={styles.title}>Connect with the Divine Essence</h1>
        <p className={styles.subtitle}>
          Discover thousands of ancient sanctuaries, timeless rituals, and the rich cultural
          heritage of Kerala&apos;s sacred temples.
        </p>
        <div className={styles.searchBar}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="search"
            placeholder="Search for Temples, Poojas, or Locations"
            disabled
            aria-label="Search (coming soon)"
            className={styles.searchInput}
          />
          <span className={styles.exploreButton} aria-disabled="true">
            Explore
          </span>
        </div>
      </div>
    </section>
  )
}
