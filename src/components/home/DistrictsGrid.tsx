import Image from 'next/image'
import Link from 'next/link'

import type { DistrictCard } from '@/app/(frontend)/getHomeData'
import { resolveMediaUrl } from '@/utilities/media'
import styles from './DistrictsGrid.module.css'

/**
 * District has no image field (docs/content-model.md §2); per owner
 * decision, each card's photo is borrowed from one published Temple in
 * that district (existing relationship, no schema change). The decorative
 * taglines shown in the design ("Northern Gate", etc.) have no data source
 * and are intentionally omitted rather than invented.
 * "View All Districts" links to the Districts directory page (/districts).
 */
export function DistrictsGrid({ cards }: { cards: DistrictCard[] }) {
  if (cards.length === 0) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Explore by Districts</h2>
      <p className={styles.subheading}>
        Journey through Kerala&apos;s spiritual landscape, district by district, each offering
        unique architectural styles and local legends.
      </p>

      <div className={styles.grid}>
        {cards.map(({ district, templeCount, image }) => {
          const imageUrl = resolveMediaUrl(image)

          return (
            <div key={district.id} className={styles.card}>
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
              </div>
              <h3 className={styles.name}>{district.name}</h3>
              <p className={styles.count}>
                {templeCount} {templeCount === 1 ? 'Temple' : 'Temples'}
              </p>
            </div>
          )
        })}
      </div>

      <Link href="/districts" className={styles.viewAllButton}>
        View All Districts
      </Link>
    </section>
  )
}
