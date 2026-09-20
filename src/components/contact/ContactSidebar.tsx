import { CameraIcon, LinkIcon, MailIcon, PhoneIcon, PinIcon, ShareIcon } from '@/components/icons/TempleIcons'
import styles from './ContactSidebar.module.css'

const OFFICE_ADDRESS = 'Hilite Business Park, Kozhikode, Kerala'
const CONTACT_EMAIL = 'contact@whereismytemple.com'
const CONTACT_PHONE = '+91 9746105647'

/**
 * Office address/email/phone are real values provided by the owner (not
 * from the CMS — there is no site-wide contact-info collection/field), so
 * they're hardcoded here like the existing `SITE_URL` constant rather than
 * invented or left as the design's placeholder mockup values. No schema
 * change. The gray photo panel in the design has no real office photo
 * behind it, so it stays a plain decorative panel (a pin icon) rather than
 * borrowing an unrelated Temple photo, which would misrepresent it as a
 * photo of the office. The quote and its "Heritage Archives" attribution
 * are static decorative copy, the same treatment already used for the Home
 * page's Heritage Banner quote — not a claim about a real source. Social
 * icons have no confirmed real profile URLs, so they're non-interactive
 * (no invented links), consistent with the site's other not-yet-built
 * affordances.
 */
export function ContactSidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.card}>
        <div className={styles.photoPanel}>
          <PinIcon className={styles.photoIcon} />
        </div>
        <div className={styles.cardBody}>
          <h2 className={styles.cardHeading}>Heritage Headquarters</h2>

          <div className={styles.infoRow}>
            <span className={styles.infoIconWrapper}>
              <PinIcon className={styles.infoIcon} />
            </span>
            <div>
              <p className={styles.infoLabel}>Office Location</p>
              <p className={styles.infoValue}>{OFFICE_ADDRESS}</p>
            </div>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoIconWrapper}>
              <MailIcon className={styles.infoIcon} />
            </span>
            <div>
              <p className={styles.infoLabel}>Email Address</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className={styles.infoLink}>
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.infoIconWrapper}>
              <PhoneIcon className={styles.infoIcon} />
            </span>
            <div>
              <p className={styles.infoLabel}>Phone Number</p>
              <a href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`} className={styles.infoLink}>
                {CONTACT_PHONE}
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.quoteCard}>
        <h3 className={styles.quoteHeading}>Preserving Sanctity</h3>
        <p className={styles.quoteText}>
          &ldquo;The temple is the body of the Divine, and our architecture is the language of
          devotion.&rdquo;
        </p>
        <p className={styles.quoteAttribution}>— Heritage Archives</p>
      </div>

      <div className={styles.followCard}>
        <span className={styles.followLabel}>Follow Our Journey</span>
        <div className={styles.followIcons}>
          <span className={styles.followIconButton} aria-disabled="true">
            <ShareIcon className={styles.followIcon} />
          </span>
          <span className={styles.followIconButton} aria-disabled="true">
            <CameraIcon className={styles.followIcon} />
          </span>
          <span className={styles.followIconButton} aria-disabled="true">
            <LinkIcon className={styles.followIcon} />
          </span>
        </div>
      </div>
    </div>
  )
}
