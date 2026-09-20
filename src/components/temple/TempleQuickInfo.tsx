import type { Temple } from '@/payload-types'
import { ClockIcon, RuleIcon, ShirtIcon } from '@/components/icons/TempleIcons'
import styles from './TempleQuickInfo.module.css'

function formatTime(value: string): string {
  return new Date(value).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
}

export function TempleQuickInfo({ temple, locale }: { temple: Temple; locale: string }) {
  const darshanTimings = temple.darshanTimings ?? []
  const dressCode = temple.dressCode
  const hasDressCode = Boolean(dressCode?.men || dressCode?.women)
  const importantRules = temple.importantRules ?? []

  if (darshanTimings.length === 0 && !hasDressCode && importantRules.length === 0) {
    return null
  }

  return (
    <section className={styles.grid}>
      {darshanTimings.length > 0 && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.iconBadge}>
              <ClockIcon className={styles.icon} />
            </span>
            <h2 className={styles.cardTitle}>Darshan Timings</h2>
          </div>
          <ul className={styles.list}>
            {darshanTimings.map((timing, index) => (
              <li key={timing.id ?? index}>
                <span className={styles.label}>{timing.label}:</span>{' '}
                {formatTime(timing.openTime)} – {formatTime(timing.closeTime)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasDressCode && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.iconBadge}>
              <ShirtIcon className={styles.icon} />
            </span>
            <h2 className={styles.cardTitle}>Dress Code</h2>
          </div>
          <ul className={styles.list}>
            {dressCode?.men && (
              <li lang={locale}>
                <span className={styles.label}>Men:</span> {dressCode.men}
              </li>
            )}
            {dressCode?.women && (
              <li lang={locale}>
                <span className={styles.label}>Women:</span> {dressCode.women}
              </li>
            )}
          </ul>
        </div>
      )}

      {importantRules.length > 0 && (
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <span className={styles.iconBadge}>
              <RuleIcon className={styles.icon} />
            </span>
            <h2 className={styles.cardTitle}>Important Rules</h2>
          </div>
          <ul className={styles.list}>
            {importantRules.map((item, index) => (
              <li key={item.id ?? index} lang={locale}>
                {item.rule}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
