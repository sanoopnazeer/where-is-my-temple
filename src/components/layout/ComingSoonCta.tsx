import Image from 'next/image'

import styles from './ComingSoonCta.module.css'

interface ComingSoonCtaProps {
  /** Static background photo, shown on every page this CTA appears on.
   * Static website asset under public/images/home — not Payload
   * Media/R2. Overridable per-caller if a page ever needs a different
   * image, but defaults to the shared "List your temple" banner. */
  backgroundImageSrc?: string
}

const DEFAULT_BACKGROUND_IMAGE_SRC = '/images/home/list-temple-banner.jpg'

/** "List your temple" CTA — Coming Soon per CLAUDE.md §4; not a functional submission flow. */
export function ComingSoonCta({
  backgroundImageSrc = DEFAULT_BACKGROUND_IMAGE_SRC,
}: ComingSoonCtaProps = {}) {
  return (
    <section className={styles.banner}>
      {backgroundImageSrc && (
        <div className={styles.bgWrapper}>
          <Image src={backgroundImageSrc} alt="" fill sizes="100vw" className={styles.bgImage} />
          <div className={styles.overlay} />
        </div>
      )}
      <div className={styles.inner}>
        <h2 className={styles.title}>List your temple</h2>
        <span className={styles.button} aria-disabled="true">
          Upload your temple details
          <span className={styles.badge}>Coming Soon</span>
        </span>
      </div>
    </section>
  )
}
