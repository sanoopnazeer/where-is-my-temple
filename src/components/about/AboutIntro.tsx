import styles from './AboutIntro.module.css'

/** Copy matches the design verbatim, with "Ambalam" replaced by "Where Is
 * My Temple" (owner decision — see AboutHero). */
export function AboutIntro() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>
        Guardian of
        <br />
        Sacred Legacies
      </h2>
      <div className={styles.body}>
        <p>
          Where Is My Temple Heritage Trust emerged from a collective of architects, historians,
          and devotees who recognized the fragile state of Kerala&apos;s unique temple traditions.
          We operate at the intersection of spiritual reverence and academic rigor.
        </p>
        <p>
          Our organization serves as a central repository for knowledge, connecting traditional
          &lsquo;Vastu&rsquo; experts with modern conservation technologies. By documenting every
          &lsquo;Sreekovil&rsquo; and &lsquo;Koothambalam&rsquo;, we ensure that the wisdom of our
          ancestors is never lost to time.
        </p>
      </div>
    </section>
  )
}
