import type { Metadata } from 'next'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ComingSoonCta } from '@/components/layout/ComingSoonCta'
import { AboutHero } from '@/components/about/AboutHero'
import { AboutIntro } from '@/components/about/AboutIntro'
import { MissionValues } from '@/components/about/MissionValues'
import { SanctuaryBand } from '@/components/about/SanctuaryBand'
import { pageMetadata } from '@/utilities/site'
import styles from './page.module.css'

const TITLE = 'About Us — Where Is My Temple'
const DESCRIPTION =
  'Where Is My Temple is dedicated to the documentation, preservation, and celebration of the sacred architectural marvels that define the cultural landscape of Kerala.'

export const metadata: Metadata = pageMetadata({
  title: TITLE,
  description: DESCRIPTION,
  path: '/about',
})

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <AboutHero />
        <AboutIntro />
        <MissionValues />
        <SanctuaryBand />
        <ComingSoonCta />
      </main>
      <SiteFooter />
    </div>
  )
}
