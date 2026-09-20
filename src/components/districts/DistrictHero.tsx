import Image from 'next/image'

import type { District, Media } from '@/payload-types'
import { PinIcon, SearchIcon } from '@/components/icons/TempleIcons'
import { resolveMediaUrl } from '@/utilities/media'
import styles from './DistrictHero.module.css'

/**
 * District has no image field of its own (docs/content-model.md §2); the
 * background photo is borrowed from one of the district's Temples (same
 * precedent as the Districts directory page). `description` is real
 * editorial CMS content (added 2026-09-20) — shown only when populated, no
 * invented fallback text. The search bar is presentational only, same as
 * the Home page's hero — search isn't built yet.
 */
export function DistrictHero({ district, image }: { district: District; image?: Media }) {
  const imageUrl = resolveMediaUrl(image)

  return (
    <section className={styles.hero}>
      <div className={styles.bgWrapper}>
        {imageUrl ? (
          <Image src={imageUrl} alt="" fill priority sizes="100vw" className={styles.bgImage} />
        ) : (
          <div className={styles.bgFallback} />
        )}
        <div className={styles.overlay} />
      </div>
      <div className={styles.content}>
        <p className={styles.location}>
          <PinIcon className={styles.locationIcon} />
          Kerala, India
        </p>
        <h1 className={styles.title}>{district.name}</h1>
        {district.description && <p className={styles.description}>{district.description}</p>}
        <div className={styles.searchBar}>
          <div className={styles.searchField}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="search"
              placeholder="Search for Temples, Poojas, or Locations"
              disabled
              aria-label="Search (coming soon)"
              className={styles.searchInput}
            />
          </div>
          <span className={styles.exploreButton} aria-disabled="true">
            Explore
          </span>
        </div>
      </div>
    </section>
  )
}
