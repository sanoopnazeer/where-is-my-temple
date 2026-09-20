import styles from './ContactHero.module.css'

/** Static marketing copy, like the Home hero — not tied to any CMS record. */
export function ContactHero() {
  return (
    <section className={styles.hero}>
      <h1 className={styles.title}>Connect with Where Is My Temple</h1>
      <p className={styles.subtitle}>
        Whether you have inquiries about temple rituals, heritage preservation, or contributing to
        our mission, our team is here to guide you.
      </p>
    </section>
  )
}
