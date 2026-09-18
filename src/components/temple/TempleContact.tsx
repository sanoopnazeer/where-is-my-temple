import type { Temple } from '@/payload-types'
import styles from './TempleContact.module.css'

export function TempleContact({ temple }: { temple: Temple }) {
  const contact = temple.contact
  const social = temple.socialLinks

  const hasContact = Boolean(contact?.phone || contact?.email || contact?.whatsapp || contact?.website)
  const hasSocial = Boolean(social?.instagram || social?.facebook || social?.youtube)

  if (!hasContact && !hasSocial) return null

  return (
    <section className={styles.section}>
      {hasContact && (
        <div className={styles.contactRow}>
          {contact?.phone && (
            <a href={`tel:${contact.phone}`} className={styles.contactLink}>
              {contact.phone}
            </a>
          )}
          {contact?.email && (
            <a href={`mailto:${contact.email}`} className={styles.contactLink}>
              {contact.email}
            </a>
          )}
          {contact?.whatsapp && (
            <a
              href={`https://wa.me/${contact.whatsapp.replace(/[^\d]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.contactLink}
            >
              WhatsApp
            </a>
          )}
          {contact?.website && (
            <a href={contact.website} target="_blank" rel="noopener noreferrer" className={styles.contactLink}>
              Website
            </a>
          )}
        </div>
      )}

      {hasSocial && (
        <div className={styles.socialRow}>
          {social?.instagram && (
            <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialIcon}>
              IG
            </a>
          )}
          {social?.facebook && (
            <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.socialIcon}>
              FB
            </a>
          )}
          {social?.youtube && (
            <a href={social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className={styles.socialIcon}>
              YT
            </a>
          )}
        </div>
      )}
    </section>
  )
}
