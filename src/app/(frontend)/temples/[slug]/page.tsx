import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ComingSoonCta } from '@/components/layout/ComingSoonCta'
import { TempleMobile } from '@/components/temple/mobile/TempleMobile'
import { TempleDesktop } from '@/components/temple/desktop/TempleDesktop'
import { JsonLd } from '@/components/seo/JsonLd'
import type { Temple } from '@/payload-types'
import { resolveMediaUrl } from '@/utilities/media'
import { excerpt } from '@/utilities/richText'
import { SITE_NAME, pageMetadata } from '@/utilities/site'
import { templeJsonLd } from '@/utilities/structuredData'
import { getTemple } from './getTemple'
import { resolveLocale } from './locale'
import styles from './page.module.css'

type PageParams = { slug: string }
type PageSearchParams = { lang?: string | string[] }

/** The editor's SEO description, else an excerpt of the Temple's own
 * history in the selected language — never invented copy. */
function templeDescription(temple: Temple): string | undefined {
  return temple.seo?.metaDescription || excerpt(temple.historyNarrative, 160)
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<PageParams>
  searchParams: Promise<PageSearchParams>
}): Promise<Metadata> {
  const { slug } = await params
  const { lang } = await searchParams
  const locale = resolveLocale(lang)

  const temple = await getTemple(slug, locale)
  if (!temple) return {}

  // One URL per Temple in both languages (CLAUDE.md §4): the canonical never
  // carries `?lang=`, while title/description follow the selected language.
  return pageMetadata({
    title: temple.seo?.seoTitle || `${temple.name} — ${SITE_NAME}`,
    description: templeDescription(temple),
    path: `/temples/${temple.slug}`,
    image: resolveMediaUrl(temple.seo?.socialImage) ?? resolveMediaUrl(temple.heroImage),
    locale,
  })
}

export default async function TemplePage({
  params,
  searchParams,
}: {
  params: Promise<PageParams>
  searchParams: Promise<PageSearchParams>
}) {
  const { slug } = await params
  const { lang } = await searchParams
  const locale = resolveLocale(lang)

  const temple = await getTemple(slug, locale)
  if (!temple) {
    notFound()
  }

  return (
    <div className={styles.page}>
      <JsonLd data={templeJsonLd(temple, templeDescription(temple))} />
      <SiteHeader />
      {/* Two layouts from the designs: design/mobile/Temple Page.png below
          768px, design/desktop/Temple Page.png from 768px up. Header, CTA and
          footer are shared. */}
      <div className={styles.mobileOnly}>
        <TempleMobile
          temple={temple}
          locale={locale}
          mapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY}
        />
      </div>
      <div className={styles.desktopOnly}>
        <TempleDesktop
          temple={temple}
          locale={locale}
          mapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY}
        />
      </div>
      <ComingSoonCta />
      <SiteFooter />
    </div>
  )
}
