import Image from 'next/image'
import Link from 'next/link'

import type { District, Temple } from '@/payload-types'
import { PinIcon } from '@/components/icons/TempleIcons'
import { resolveMediaUrl } from '@/utilities/media'
import { excerpt } from '@/utilities/richText'
import styles from './DistrictTempleList.module.css'

function buildPageHref(slug: string, page: number): string {
  return page <= 1 ? `/districts/${slug}` : `/districts/${slug}?page=${page}`
}

/**
 * Published Temples belonging to one District, as a vertical list (matching
 * `design/desktop/District Temple.jpg`). The design's "Main Deity" line has
 * no field anywhere in the Temple content model (docs/content-model.md §3);
 * per owner decision it's omitted rather than invented — the description
 * line is a real excerpt of the Temple's own `historyNarrative` instead
 * (same `excerpt()` utility already used for the Home page's Featured
 * Temples). Category badges and the design's sidebar ("Most Visited",
 * "Upcoming Festivals") aren't backed by any field/relationship this task
 * was scoped to use and weren't requested in the task's own functional
 * spec, so they're not built here.
 */
export function DistrictTempleList({
  district,
  temples,
  page,
  totalPages,
}: {
  district: District
  temples: Temple[]
  page: number
  totalPages: number
}) {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Temples in {district.name}</h2>

      {temples.length === 0 ? (
        <p className={styles.empty}>
          No published temples in {district.name} yet. Check back soon.
        </p>
      ) : (
        <>
          <ul className={styles.list}>
            {temples.map((temple) => {
              const heroImage = typeof temple.heroImage === 'object' ? temple.heroImage : undefined
              const imageUrl = resolveMediaUrl(heroImage)
              const description = excerpt(temple.historyNarrative, 160)

              return (
                <li key={temple.id} className={styles.card}>
                  <Link href={`/temples/${temple.slug}`} className={styles.cardLink}>
                    <div className={styles.imageWrapper}>
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={heroImage?.alt ?? temple.name}
                          fill
                          loading="lazy"
                          sizes="(max-width: 480px) 96px, 220px"
                          className={styles.image}
                        />
                      ) : (
                        <div className={styles.imageFallback} />
                      )}
                    </div>
                    <div className={styles.body}>
                      <h3 className={styles.name}>{temple.name}</h3>
                      {temple.locality && (
                        <p className={styles.locality}>
                          <PinIcon className={styles.localityIcon} />
                          {temple.locality}
                        </p>
                      )}
                      {description && <p className={styles.description}>{description}</p>}
                      <span className={styles.viewDetails}>View Details →</span>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>

          {totalPages > 1 && (
            <nav className={styles.pagination} aria-label="Temple list pages">
              {page > 1 ? (
                <Link href={buildPageHref(district.slug, page - 1)} className={styles.pageLink}>
                  Prev
                </Link>
              ) : (
                <span className={`${styles.pageLink} ${styles.pageLinkDisabled}`} aria-disabled="true">
                  Prev
                </span>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
                <Link
                  key={pageNumber}
                  href={buildPageHref(district.slug, pageNumber)}
                  className={`${styles.pageLink} ${pageNumber === page ? styles.pageLinkActive : ''}`}
                  aria-current={pageNumber === page ? 'page' : undefined}
                >
                  {pageNumber}
                </Link>
              ))}

              {page < totalPages ? (
                <Link href={buildPageHref(district.slug, page + 1)} className={styles.pageLink}>
                  Next
                </Link>
              ) : (
                <span className={`${styles.pageLink} ${styles.pageLinkDisabled}`} aria-disabled="true">
                  Next
                </span>
              )}
            </nav>
          )}
        </>
      )}
    </section>
  )
}
