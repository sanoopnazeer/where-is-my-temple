import { LeafIcon } from '@/components/icons/TempleIcons'
import styles from './SanctuaryBand.module.css'

/**
 * Copy matches the design verbatim (owner decision — see AboutHero), except
 * the button label ("Support the Us" in the design, an evident typo,
 * corrected to "Support Us"). No donation/support backend exists, so the
 * button is non-functional with a "Coming Soon" badge — the same treatment
 * as the "List your temple" CTA (`ComingSoonCta`).
 */
export function SanctuaryBand() {
  return (
    <section className={styles.band}>
      <LeafIcon className={styles.icon} />
      <h2 className={styles.heading}>A Living Sanctuary of Knowledge</h2>
      <p className={styles.body}>
        &ldquo;Tradition is not the worship of ashes, but the preservation of fire.&rdquo; We
        invite you to join us in our journey to keep the eternal flame of Kerala&apos;s heritage
        burning bright for generations to come.
      </p>
      <span className={styles.button} aria-disabled="true">
        Support Us
        <span className={styles.badge}>Coming Soon</span>
      </span>
    </section>
  )
}
