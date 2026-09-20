import Image from 'next/image'

import styles from './HeritageBanner.module.css'

/** Static marketing copy, like the footer tagline — not tied to any CMS
 * record. Background is a static website asset under public/images/home
 * (not Payload Media/R2 — see docs/development-status.md). */
export function HeritageBanner() {
  return (
    <section className={styles.banner}>
      <div className={styles.bgWrapper}>
        <Image
          src="/images/home/heritage-banner.png"
          alt=""
          fill
          sizes="100vw"
          className={styles.bgImage}
        />
        <div className={styles.overlay} />
      </div>
      <div className={styles.inner}>
        {/* Shown only on mobile (CSS), matching design/mobile's small
            "SACRED LEGACY" eyebrow badge — design/desktop's version of this
            section doesn't have one, so it stays hidden there. */}
        <p className={styles.eyebrow}>Sacred Legacy</p>
        <h2 className={styles.title}>The Sacred Heritage of Where Is My Temple</h2>
        <p className={styles.quote}>
          &ldquo;Where Is My Temple is more than just a directory &mdash; it is a living archive
          dedicated to the preservation and discovery of Kerala&apos;s profound temple culture.
          Our mission is to bridge ancient architecture with modern accessibility, ensuring that
          the stories, rituals, and spiritual significance of every sacred grove and grand gopuram
          remain vibrant for generations. From the hidden forest shrines of the Western Ghats to
          the coastal sanctuaries, we provide seekers and devotees with an authentic, informed
          window into the resilience and artistic majesty of our spiritual past, fostering a
          community of cultural reverence.&rdquo;
        </p>
      </div>
    </section>
  )
}
