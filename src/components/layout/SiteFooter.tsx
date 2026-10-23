import Image from 'next/image'
import Link from 'next/link'

import styles from './SiteFooter.module.css'

/**
 * Minimal global footer matching design/desktop. Quick Links point to
 * the About, Districts and Events pages. The Resources entries (Fact Check/
 * Privacy/Terms) have no pages yet, so they render as inactive labels
 * rather than dead links.
 */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <div className={styles.brandColumn}>
          <Image
            src="/images/logo/logo-wordmark.png"
            alt="Where Is My Temple"
            width={2408}
            height={447}
            className={styles.brand}
          />
          <p className={styles.tagline}>
            Preserving the echoes of ancient stones and the spirit of timeless devotion across the
            land of Kerala.
          </p>
        </div>
        <div className={styles.quickColumn}>
          <h3 className={styles.columnTitle}>Quick Links</h3>
          <ul className={styles.linkList}>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>
              <Link href="/districts">District</Link>
            </li>
            <li>
              <Link href="/events">Festivals &amp; Events</Link>
            </li>
          </ul>
        </div>
        <div className={styles.resourcesColumn}>
          <h3 className={styles.columnTitle}>Resources</h3>
          <ul className={styles.linkList}>
            <li>Fact Check</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
      </div>
      <p className={styles.copyright}>
        &copy; {new Date().getFullYear()} Where&nbsp;Is&nbsp;My&nbsp;Temple. All rights reserved.
      </p>
    </footer>
  )
}
