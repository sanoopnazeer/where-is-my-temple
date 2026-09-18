import styles from './ComingSoonCta.module.css'

/** "List your temple" CTA — Coming Soon per CLAUDE.md §4; not a functional submission flow. */
export function ComingSoonCta() {
  return (
    <section className={styles.banner}>
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
