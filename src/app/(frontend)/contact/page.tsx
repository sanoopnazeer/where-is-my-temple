import type { Metadata } from 'next'

import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { ComingSoonCta } from '@/components/layout/ComingSoonCta'
import { ContactHero } from '@/components/contact/ContactHero'
import { ContactForm } from '@/components/contact/ContactForm'
import { FaqSection } from '@/components/contact/FaqSection'
import { ContactSidebar } from '@/components/contact/ContactSidebar'
import { SITE_URL } from '@/utilities/site'
import styles from './page.module.css'

const TITLE = 'Contact — Where Is My Temple'
const DESCRIPTION =
  'Get in touch with Where Is My Temple for inquiries about temple rituals, heritage preservation, or contributing to our mission.'

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/contact`,
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <ContactHero />
        <div className={styles.contentGrid}>
          <div className={styles.mainColumn}>
            <ContactForm />
            <FaqSection />
          </div>
          <ContactSidebar />
        </div>
        <ComingSoonCta />
      </main>
      <SiteFooter />
    </div>
  )
}
