import type { ReactNode } from 'react'

import styles from './TempleMobile.module.css'

/** White section card from the mobile design: tinted icon badge, purple
 * eyebrow, section title, then the section body. */
export function MobileCard({
  icon,
  tone,
  eyebrow,
  title,
  children,
}: {
  icon: ReactNode
  tone: 'peach' | 'lavender'
  eyebrow: string
  title: string
  children: ReactNode
}) {
  return (
    <section className={styles.card}>
      <header className={styles.cardHeader}>
        <span className={`${styles.badge} ${tone === 'lavender' ? styles.badgeLavender : ''}`}>
          {icon}
        </span>
        <div className={styles.cardTitles}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 className={styles.cardTitle}>{title}</h2>
        </div>
      </header>
      {children}
    </section>
  )
}
