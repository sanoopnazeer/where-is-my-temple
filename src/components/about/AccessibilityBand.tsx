import { EyeIcon } from '@/components/icons/TempleIcons'
import styles from './AccessibilityBand.module.css'

/**
 * Copy matches the design verbatim (owner decision — see AboutHero). The
 * design's right-side image is a screenshot of a website mockup, not a
 * real photo the project has — rather than substitute an unrelated Temple
 * photo (which would misrepresent it), this stays a plain decorative panel.
 */
export function AccessibilityBand() {
  return (
    <section className={styles.band}>
      <div className={styles.inner}>
        <div className={styles.text}>
          <span className={styles.iconBadge}>
            <EyeIcon className={styles.icon} />
          </span>
          <h2 className={styles.heading}>Accessibility</h2>
          <p className={styles.body}>
            We believe that heritage belongs to everyone. Through our digital directory and
            educational festivals, we make the profound wisdom of Kerala&apos;s culture accessible
            to scholars, tourists, and the next generation alike.
          </p>
        </div>
        <div className={styles.imagePanel} aria-hidden="true" />
      </div>
    </section>
  )
}
