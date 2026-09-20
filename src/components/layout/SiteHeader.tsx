import Link from 'next/link'

import styles from './SiteHeader.module.css'

/**
 * Minimal global nav matching design/desktop's header. "About Us" and
 * "Contact" have no pages yet (see docs/development-status.md), so they
 * render as inactive labels rather than dead links. "Districts wise
 * Temples" links to the Districts directory page.
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
          <span className={styles.disabled}>Contact</span>
        </nav>
      </div>
    </header>
  )
}
