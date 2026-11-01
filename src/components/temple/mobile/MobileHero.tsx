import Image from 'next/image'
import Link from 'next/link'

import type { Temple } from '@/payload-types'
import type { TempleLocale } from '@/app/(frontend)/temples/[slug]/locale'
import { resolveMediaUrl } from '@/utilities/media'
import styles from './MobileHero.module.css'

export function MobileHero({ temple, locale }: { temple: Temple; locale: TempleLocale }) {
  const heroUrl = resolveMediaUrl(temple.heroImage)
  const heroAlt =
    typeof temple.heroImage === 'object' && temple.heroImage
      ? (temple.heroImage.alt ?? temple.name)
      : temple.name

  return (
    <section className={styles.hero}>
      {heroUrl ? (
        <Image
          src={heroUrl}
          alt={heroAlt}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 640px"
          className={styles.image}
        />
      ) : (
        <div className={styles.imageFallback} role="img" aria-label="Temple image unavailable" />
      )}
      <div className={styles.overlay} />

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

      <div className={styles.content} lang={locale}>
        <h1 className={styles.title}>{temple.name}</h1>
        {temple.tagline && <p className={styles.tagline}>{temple.tagline}</p>}
      </div>
    </section>
  )
}
