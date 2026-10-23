import Image from 'next/image'

import styles from './AboutHero.module.css'

/**
 * Copy matches `design/desktop/About us.jpg` verbatim, with "Ambalam"
 * replaced by the approved brand name "Where Is My Temple" (owner
 * decision — publish the design's copy as-is except for the brand swap).
 * Background reuses the existing static website asset already used on the
 * Home hero (public/images/home/hero-banner.jpg) rather than a new photo —
 * no new asset was added, nothing uploaded to R2.
 */
export function AboutHero() {
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
        <h1 className={styles.title}>Preserving the Spiritual Architecture of Kerala</h1>
        <p className={styles.subtitle}>
          Where&nbsp;Is&nbsp;My&nbsp;Temple Heritage Trust is dedicated to the documentation, preservation, and
          celebration of the sacred architectural marvels that define the cultural landscape of
          Kerala.
        </p>
      </div>
    </section>
  )
}
