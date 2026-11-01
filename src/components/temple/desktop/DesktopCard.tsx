import type { ReactNode } from 'react'

import styles from './TempleDesktop.module.css'

/** Card from the desktop Temple design: tinted icon badge, coloured eyebrow,
 * title, optional right-aligned chip, a rule, then the body. `compact` is the
 * narrower right-column variant. */
export function DesktopCard({
  icon,
  tone = 'brown',
  eyebrow,
  title,
  aside,
  compact = false,
  children,
}: {
  icon: ReactNode
  tone?: 'brown' | 'purple' | 'teal'
  eyebrow: string
  title: string
  aside?: ReactNode
  compact?: boolean
  children: ReactNode
}) {
  const toneClass = tone === 'purple' ? styles.purple : tone === 'teal' ? styles.teal : ''

  return (
    <section className={`${styles.card} ${compact ? styles.cardCompact : ''} ${toneClass}`}>
      <header className={styles.cardHeader}>
        <span className={styles.badge}>{icon}</span>
        <div className={styles.cardTitles}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.cardTitle}>{title}</h2>
        </div>
        {aside}
      </header>
      {children}
    </section>
  )
}
