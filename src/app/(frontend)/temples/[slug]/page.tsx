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
import { resolveMediaUrl } from '@/utilities/media'
import { SITE_URL } from '@/utilities/site'
import { getTemple } from './getTemple'
import { resolveLocale } from './locale'
import styles from './page.module.css'

type PageParams = { slug: string }
type PageSearchParams = { lang?: string | string[] }

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

  const title = temple.seo?.seoTitle || temple.name
  const description = temple.seo?.metaDescription || undefined
  const canonicalUrl = `${SITE_URL}/temples/${temple.slug}`
  const ogImage = resolveMediaUrl(temple.seo?.socialImage) ?? resolveMediaUrl(temple.heroImage)

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  }
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
