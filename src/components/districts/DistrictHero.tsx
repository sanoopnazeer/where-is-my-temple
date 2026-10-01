import Image from 'next/image'

import type { District, Media } from '@/payload-types'
import { PinIcon } from '@/components/icons/TempleIcons'
import { SearchForm } from '@/components/search/SearchForm'
import { resolveMediaUrl } from '@/utilities/media'
import styles from './DistrictHero.module.css'

/**
 * District has no image field of its own (docs/content-model.md §2); the
 * background photo is borrowed from one of the district's Temples (same
 * precedent as the Districts directory page). `description` is real
 * editorial CMS content (added 2026-09-20) — shown only when populated, no
 * invented fallback text. The search bar searches within this District
 * only (`/districts/[slug]?q=`).
 */
export function DistrictHero({
  district,
  image,
  query = '',
}: {
  district: District
  image?: Media
  query?: string
}) {
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
        <SearchForm
          action={`/districts/${district.slug}`}
          defaultValue={query}
          label={`Search temples and events in ${district.name}`}
        />
      </div>
    </section>
  )
}
