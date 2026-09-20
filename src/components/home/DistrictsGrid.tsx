import Image from 'next/image'
import Link from 'next/link'

import type { DistrictCard } from '@/app/(frontend)/getHomeData'
import { BuildingIcon } from '@/components/icons/TempleIcons'
import { resolveMediaUrl } from '@/utilities/media'
import styles from './DistrictsGrid.module.css'

/**
 * District has no image field (docs/content-model.md §2); per owner
 * decision, each card's photo is borrowed from one published Temple in
 * that district (existing relationship, no schema change). The decorative
 * taglines shown in the design ("Northern Gate", etc.) have no data source
 * and are intentionally omitted rather than invented.
 * Card markup/sizing matches the Districts directory page's cards
 * (`DistrictsDirectory`) — same aspect ratio, overlay, and card styling —
 * and each card links straight to that district's own Temple List page
 * (`/districts/[slug]`), not just to the directory. "View All Districts"
 * still links to the full directory (/districts).
 */
export function DistrictsGrid({ cards }: { cards: DistrictCard[] }) {
  if (cards.length === 0) return null

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <h2 className={styles.heading}>Explore by Districts</h2>
        <p className={styles.subheading}>
          Journey through Kerala&apos;s spiritual landscape, district by district, each offering
          unique architectural styles and local legends.
        </p>

        <div className={styles.grid}>
          {cards.map(({ district, templeCount, image }) => {
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
                  <h3 className={styles.name}>{district.name}</h3>
                  <p className={styles.count}>
                    <BuildingIcon className={styles.countIcon} />
                    {templeCount} {templeCount === 1 ? 'Temple' : 'Temples'}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>

        <Link href="/districts" className={styles.viewAllButton}>
          View All Districts
        </Link>
      </div>
    </section>
  )
}
