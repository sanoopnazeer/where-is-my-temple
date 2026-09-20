import Image from 'next/image'
import Link from 'next/link'

import type { Temple } from '@/payload-types'
import { resolveMediaUrl } from '@/utilities/media'
import { PinIcon } from '@/components/icons/TempleIcons'
import type { TempleLocale } from '@/app/(frontend)/temples/[slug]/locale'
import styles from './TempleHero.module.css'

export function TempleHero({ temple, locale }: { temple: Temple; locale: TempleLocale }) {
  const heroUrl = resolveMediaUrl(temple.heroImage)
  const heroAlt = typeof temple.heroImage === 'object' && temple.heroImage ? temple.heroImage.alt : temple.name
  const districtName = typeof temple.district === 'object' && temple.district ? temple.district.name : undefined

  return (
    <section className={styles.hero}>
      <div className={styles.imageWrapper}>
        {heroUrl ? (
          <Image
            src={heroUrl}
            alt={heroAlt}
            fill
            priority
            sizes="100vw"
            className={styles.image}
          />
        ) : (
          <div className={styles.imageFallback} role="img" aria-label="Temple image unavailable" />
        )}
        <div className={styles.overlay} />
      </div>

      <div className={styles.localeSwitch} role="group" aria-label="Language">
        <Link
          href="?lang=en"
          scroll={false}
          className={locale === 'en' ? styles.localeActive : styles.localeLink}
          aria-current={locale === 'en' ? 'true' : undefined}
        >
          EN
        </Link>
        <Link
          href="?lang=ml"
          scroll={false}
          className={locale === 'ml' ? styles.localeActive : styles.localeLink}
          aria-current={locale === 'ml' ? 'true' : undefined}
        >
          മലയാളം
        </Link>
      </div>

      <div className={styles.heroContent}>
        <h1 className={styles.title} lang={locale}>
          {temple.name}
        </h1>
        {districtName && (
          <span className={styles.districtTag}>
            <PinIcon className={styles.pinIcon} />
            {districtName}
          </span>
        )}
      </div>
    </section>
  )
}
