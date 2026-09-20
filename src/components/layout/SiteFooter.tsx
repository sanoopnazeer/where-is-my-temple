import Link from 'next/link'

import styles from './SiteFooter.module.css'

/**
 * Minimal global footer matching design/desktop. "About Us" links to the
 * About page. Other link targets (Directory/Festivals/Preservation/Privacy/
 * Terms) have no pages yet, so they render as inactive labels rather than
 * dead links. The newsletter field is presentational only — no
 * subscription backend exists.
 */
export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.columns}>
        <div>
          <h2 className={styles.brand}>Where Is My Temple</h2>
          <p className={styles.tagline}>
            Preserving the echoes of ancient stones and the spirit of timeless devotion across the
            land of Kerala.
          </p>
        </div>
        <div>
          <h3 className={styles.columnTitle}>Quick Links</h3>
          <ul className={styles.linkList}>
            <li>
              <Link href="/about">About Us</Link>
            </li>
            <li>Temple Directory</li>
            <li>Cultural Festivals</li>
          </ul>
        </div>
        <div>
          <h3 className={styles.columnTitle}>Resources</h3>
          <ul className={styles.linkList}>
            <li>Preservation Initiatives</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
        <div>
          <h3 className={styles.columnTitle}>Newsletter</h3>
          <p className={styles.tagline}>Subscribe for spiritual updates and festival alerts.</p>
          <div className={styles.subscribeRow}>
            <input
              type="email"
              placeholder="Your email"
              disabled
              aria-label="Email address (newsletter signup coming soon)"
              className={styles.emailInput}
            />
            <button type="button" disabled className={styles.joinButton}>
              Join
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
