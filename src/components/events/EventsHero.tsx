import styles from './EventsHero.module.css'

/**
 * Static marketing copy, like the Home/Contact/District hero subtitles —
 * not tied to any CMS record and makes no claims about specific
 * temples/festivals. The design's "Malayalam Era 1199 / Medam–Edavam
 * Season" widget is intentionally not built — V1 explicitly excludes
 * Malayalam-calendar conversion (CLAUDE.md §4).
 */
export function EventsHero() {
  return (
    <section className={styles.hero}>
      <p className={styles.eyebrow}>Kerala Temple Heritage Almanac</p>
      <h1 className={styles.title}>Sacred Celebrations &amp; Temple Festivals of Kerala</h1>
      <p className={styles.subtitle}>
        Experience the divine symphony of Chenda Melam, majestic elephant pageantry, seasonal
        Utsavams, and age-old temple rituals echoing through God&apos;s Own Country.
      </p>
    </section>
  )
}
