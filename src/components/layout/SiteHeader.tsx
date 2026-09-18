import Link from 'next/link'

import styles from './SiteHeader.module.css'

/**
 * Minimal global nav matching design/desktop's header. "About Us",
 * "Districts wise Temples" and "Contact" have no pages yet (see
 * docs/development-status.md — public website is still Temple-detail-only),
 * so they render as inactive labels rather than dead links.
 */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Where Is My Temple
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          <Link href="/">Home</Link>
          <span className={styles.disabled}>About Us</span>
          <span className={styles.disabled}>Districts wise Temples</span>
          <span className={styles.disabled}>Contact</span>
        </nav>
      </div>
    </header>
  )
}
