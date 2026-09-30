import type { Temple } from '@/payload-types'
import { formatIstTime } from '@/utilities/ist'
import styles from './TempleDailyRituals.module.css'

type Ritual = NonNullable<Temple['dailyRituals']>[number]

/** "03:00 am", or "05:00 am – 05:30 am" when an end time exists; null
 * without a start time (never an invented or partial timing). */
function ritualTimeLabel({ startTime, endTime }: Ritual): string | null {
  if (!startTime) return null
  return endTime ? `${formatIstTime(startTime)} – ${formatIstTime(endTime)}` : formatIstTime(startTime)
}

export function TempleDailyRituals({ temple, locale }: { temple: Temple; locale: string }) {
  const rituals = temple.dailyRituals ?? []
  if (rituals.length === 0) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Daily Rituals</h2>
      <div className={styles.grid}>
        {rituals.map((ritual, index) => {
          const time = ritualTimeLabel(ritual)

          return (
            <div key={ritual.id ?? index} className={styles.card} lang={locale}>
              {/* Times are English/IST in both languages (mobile design's time pill) */}
              {time && (
                <span className={styles.time} lang="en">
                  {time}
                </span>
              )}
              <h3 className={styles.name}>{ritual.name}</h3>
              <p className={styles.description}>{ritual.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
