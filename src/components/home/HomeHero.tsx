import Image from 'next/image'

import { SearchForm } from '@/components/search/SearchForm'
import styles from './HomeHero.module.css'

/**
 * Background is a static website asset under public/images/home (not
 * Payload Media/R2 — see docs/development-status.md). The search bar
 * submits to `/search?q=` (site-wide Temples/Events/Districts search).
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
        <SearchForm action="/search" label="Search temples, events and districts" />
      </div>
    </section>
  )
}
