import Image from 'next/image'

import styles from './ComingSoonCta.module.css'

interface ComingSoonCtaProps {
  /** Static background photo, shown on every page this CTA appears on.
   * Static website asset under public/images/home — not Payload
   * Media/R2. Overridable per-caller if a page ever needs a different
   * image, but defaults to the shared "List your temple" banner. */
  backgroundImageSrc?: string
  /** Set on pages short enough that this banner renders above the fold
   * (e.g. the Districts directory), so Next.js can eagerly load/preload
   * it instead of flagging it as an unoptimized LCP image. Defaults to
   * false since on most pages this banner is the last section, below
   * the fold, where lazy-loading is preferred. */
  priority?: boolean
}

const DEFAULT_BACKGROUND_IMAGE_SRC = '/images/home/list-temple-banner.jpg'

/** "List your temple" CTA — Coming Soon per CLAUDE.md §4; not a functional submission flow. */
export function ComingSoonCta({
  backgroundImageSrc = DEFAULT_BACKGROUND_IMAGE_SRC,
  priority = false,
}: ComingSoonCtaProps = {}) {
  return (
    <section className={styles.banner}>
      {backgroundImageSrc && (
        <div className={styles.bgWrapper}>
          <Image
            src={backgroundImageSrc}
            alt=""
            fill
            sizes="100vw"
            priority={priority}
            className={styles.bgImage}
          />
          <div className={styles.overlay} />
        </div>
      )}
      <div className={styles.inner}>
        <h2 className={styles.title}>List your temple</h2>
        {/* Shown only on mobile (CSS) — design/mobile's version of this
            banner has this line, design/desktop's doesn't. */}
        <p className={styles.subtitle}>
          Help devotees across the globe connect with your sacred sanctuary
        </p>
        <span className={styles.button} aria-disabled="true">
          Upload your temple details
          <span className={styles.badge}>Coming Soon</span>
        </span>
      </div>
    </section>
  )
}
