import Image from 'next/image'
import Link from 'next/link'

import type { DistrictListItem } from '@/app/(frontend)/districts/getDistrictsData'
import { BuildingIcon, SearchIcon } from '@/components/icons/TempleIcons'
import { resolveMediaUrl } from '@/utilities/media'
import styles from './DistrictsDirectory.module.css'

/**
 * District has no image field of its own (docs/content-model.md §2); each
 * card's photo is borrowed from one published Temple in that district, the
 * same owner-approved precedent used by the Home page's district teaser.
 * The design's decorative region tags (e.g. "SOUTH KERALA") have no data
 * source in the content model and are intentionally omitted rather than
 * invented — this page only shows what District actually has: name and a
 * derived published-Temple count.
 */
export function DistrictsDirectory({ items }: { items: DistrictListItem[] }) {
  return (
    <section className={styles.section}>
      {/* Eyebrow badge and search field are shown only on mobile (CSS) —
          design/mobile has both, design/desktop has neither. The search
          field is presentational only, matching the Home hero's disabled
          search bar (no search backend exists yet — CLAUDE.md §6). */}
      <p className={styles.eyebrow}>Sacred Heritage Directory</p>
      <h1 className={styles.heading}>Explore Temples Across Kerala</h1>
      <p className={styles.subheading}>
        Journey through Kerala&apos;s spiritual landscape, district by district, each offering
        unique architectural styles and local legends.
      </p>

      <div className={styles.searchBar}>
        <SearchIcon className={styles.searchIcon} />
        <input
          type="search"
          placeholder="Search district, temple or region..."
          disabled
          aria-label="Search (coming soon)"
          className={styles.searchInput}
        />
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>No districts are available yet.</p>
      ) : (
        <div className={styles.grid}>
          {items.map(({ district, templeCount, image }) => {
            const imageUrl = resolveMediaUrl(image)

            return (
              <Link
                key={district.id}
                href={`/districts/${district.slug}`}
                className={styles.card}
              >
                <div className={styles.imageWrapper}>
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={image?.alt ?? district.name}
                      fill
                      loading="lazy"
                      sizes="(max-width: 720px) 50vw, 25vw"
                      className={styles.image}
                    />
                  ) : (
                    <div className={styles.imageFallback} />
                  )}
                  <div className={styles.overlay} />
                </div>
                <div className={styles.cardBody}>
                  <h2 className={styles.name}>{district.name}</h2>
                  <p className={styles.count}>
                    <BuildingIcon className={styles.countIcon} />
                    {templeCount} {templeCount === 1 ? 'Temple' : 'Temples'}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </section>
  )
}
