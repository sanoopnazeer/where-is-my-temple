import Link from 'next/link'

import styles from './SiteHeader.module.css'

/**
 * Minimal global nav matching design/desktop's header. "About Us" has no
 * page yet (see docs/development-status.md), so it renders as an inactive
 * label rather than a dead link. "Districts wise Temples" and "Contact"
 * link to their respective pages.
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
          <Link href="/districts">Districts wise Temples</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
