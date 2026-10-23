'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import { CloseIcon, MenuIcon, SearchIcon } from '@/components/icons/TempleIcons'
import styles from './SiteHeader.module.css'

const NAV_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/districts', label: 'District' },
  { href: '/events', label: 'Festivals & Events' },
  { href: '/contact', label: 'Contact' },
]

/** Minimal global nav matching design/desktop's header. All nav items now
 * have pages. Sticky on desktop; on mobile the same nav items collapse into
 * a hamburger-triggered menu, matching design/mobile's header (logo, search
 * icon, hamburger). The search icon opens the site-wide `/search` page. */
export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} onClick={() => setIsMenuOpen(false)}>
          <Image
            src="/images/logo/logo-dark.png"
            alt="Where Is My Temple"
            width={2987}
            height={551}
            priority
            className={styles.logoImage}
          />
        </Link>

        <nav className={styles.nav} aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <Link key={item.href} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className={styles.mobileControls}>
          <Link
            href="/search"
            className={styles.searchIcon}
            aria-label="Search"
            onClick={() => setIsMenuOpen(false)}
          >
            <SearchIcon aria-hidden="true" />
          </Link>
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <nav
        id="mobile-nav"
        aria-label="Mobile"
        className={styles.mobileNav}
        data-open={isMenuOpen}
        hidden={!isMenuOpen}
      >
        {NAV_ITEMS.map((item) => (
          <Link key={item.href} href={item.href} onClick={() => setIsMenuOpen(false)}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}
