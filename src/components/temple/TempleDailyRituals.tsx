import type { Temple } from '@/payload-types'
import styles from './TempleDailyRituals.module.css'

export function TempleDailyRituals({ temple, locale }: { temple: Temple; locale: string }) {
  const rituals = temple.dailyRituals ?? []
  if (rituals.length === 0) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Daily Rituals</h2>
      <div className={styles.grid}>
        {rituals.map((ritual, index) => (
          <div key={ritual.id ?? index} className={styles.card} lang={locale}>
            <h3 className={styles.name}>{ritual.name}</h3>
            <p className={styles.description}>{ritual.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
