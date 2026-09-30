import Image from 'next/image'
import Link from 'next/link'

import type { FeaturedTemple } from '@/app/(frontend)/getHomeData'
import { resolveMediaUrl } from '@/utilities/media'
import { excerpt } from '@/utilities/richText'
import styles from './FeaturedTemples.module.css'

/**
 * "Top Visited Temples" implies view-count analytics that don't exist in
 * this architecture; per owner decision, this shows the most recently
 * published Temples instead (existing `createdAt` field, no schema
 * change) under the design's original heading. Links go to the real,
 * already-working `/temples/[slug]` route.
 */
export function FeaturedTemples({ temples }: { temples: FeaturedTemple[] }) {
  if (temples.length === 0) return null

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Top Visited Temples</h2>
      <div className={styles.grid}>
        {temples.map((temple) => {
          const heroImage = typeof temple.heroImage === 'object' ? temple.heroImage : undefined
          const imageUrl = resolveMediaUrl(heroImage)
          const districtName = typeof temple.district === 'object' ? temple.district.name : undefined
          const description = excerpt(temple.historyNarrative, 110)

          return (
            <article key={temple.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                {imageUrl ? (
                  <Image
                    src={imageUrl}
                    alt={heroImage?.alt ?? temple.name}
                    fill
                    loading="lazy"
                    sizes="(max-width: 720px) 100vw, 33vw"
                    className={styles.image}
                  />
                ) : (
                  <div className={styles.imageFallback} />
                )}
                {districtName && <span className={styles.districtBadge}>{districtName}</span>}
              </div>
              <div className={styles.body}>
                <h3 className={styles.name}>{temple.name}</h3>
                {description && <p className={styles.description}>{description}</p>}
                <Link href={`/temples/${temple.slug}`} className={styles.exploreLink}>
                  Explore More
                </Link>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
