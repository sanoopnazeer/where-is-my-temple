import Link from 'next/link'

import styles from './SiteHeader.module.css'

/** Minimal global nav matching design/desktop's header. All nav items now
 * have pages. */
export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          Where Is My Temple
        </Link>
        <nav className={styles.nav} aria-label="Primary">
          <Link href="/">Home</Link>
          <Link href="/about">About Us</Link>
          <Link href="/districts">District</Link>
          <Link href="/events">Festivals &amp; Events</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
