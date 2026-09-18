import { RichText } from '@payloadcms/richtext-lexical/react'

import type { Temple } from '@/payload-types'
import styles from './TempleHistory.module.css'

export function TempleHistory({ temple, locale }: { temple: Temple; locale: string }) {
  if (!temple.historyNarrative) return null

  return (
    <section className={styles.section}>
      <div className={styles.content} lang={locale}>
        <RichText data={temple.historyNarrative} />
      </div>
    </section>
  )
}
