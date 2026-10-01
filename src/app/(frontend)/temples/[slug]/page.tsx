import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ComingSoonCta } from '@/components/layout/ComingSoonCta'
import { TempleHero } from '@/components/temple/TempleHero'
import { TempleQuickInfo } from '@/components/temple/TempleQuickInfo'
import { TempleHistory } from '@/components/temple/TempleHistory'
import { TempleDailyRituals } from '@/components/temple/TempleDailyRituals'
import { TempleGallery } from '@/components/temple/TempleGallery'
import { TemplePlanYourVisit } from '@/components/temple/TemplePlanYourVisit'
import { TempleContact } from '@/components/temple/TempleContact'
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
      <main>
        <TempleHero temple={temple} locale={locale} />
        <TempleQuickInfo temple={temple} locale={locale} />
        <TempleHistory temple={temple} locale={locale} />
        <TempleDailyRituals temple={temple} locale={locale} />
        <TempleGallery temple={temple} />
        <TemplePlanYourVisit temple={temple} />
        <TempleContact temple={temple} />
        <ComingSoonCta />
      </main>
      <SiteFooter />
    </div>
  )
}
