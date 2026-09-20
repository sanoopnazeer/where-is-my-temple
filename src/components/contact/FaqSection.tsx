'use client'

import { useState } from 'react'

import { ChevronDownIcon } from '@/components/icons/TempleIcons'
import styles from './FaqSection.module.css'

/**
 * The design shows these three questions collapsed, with no answer text
 * visible anywhere — there's no CMS-backed FAQ content and no real answer
 * copy to draw from, so each answer honestly says "Answer coming soon"
 * rather than inventing factual claims about temple rules/timings/access.
 */
const FAQS = [
  'How can I contribute to temple preservation?',
  'Are there specific timings for temple visits?',
  'Can international tourists visit the heritage sites?',
]

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Frequently Asked Questions</h2>
      <ul className={styles.list}>
        {FAQS.map((question, index) => {
          const isOpen = openIndex === index

          return (
            <li key={question} className={styles.item}>
              <button
                type="button"
                className={styles.question}
                aria-expanded={isOpen}
                onClick={() => setOpenIndex(isOpen ? null : index)}
              >
                {question}
                <ChevronDownIcon className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`} />
              </button>
              {isOpen && <p className={styles.answer}>Answer coming soon.</p>}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
