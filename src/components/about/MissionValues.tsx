import { BuildingIcon, ShieldCheckIcon, SparkleIcon } from '@/components/icons/TempleIcons'
import styles from './MissionValues.module.css'

/**
 * Copy matches the design verbatim (owner decision — see AboutHero). The
 * design's small photo strip under "Our Mission" has no real photo asset
 * for this decorative section, so it's a plain gradient rather than an
 * unrelated Temple photo.
 */
export function MissionValues() {
  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>Foundation</p>
      <h2 className={styles.heading}>Mission &amp; Core Values</h2>

      <div className={styles.grid}>
        <div className={styles.card}>
          <span className={styles.iconBadge}>
            <BuildingIcon className={styles.icon} />
          </span>
          <h3 className={styles.cardTitle}>Our Mission</h3>
          <p className={styles.cardBody}>
            To protect and revitalize Kerala&apos;s temple heritage through meticulous digital
            documentation, sustainable restoration projects, and community-led cultural
            preservation initiatives that bridge the gap between antiquity and the future.
          </p>
          <div className={styles.cardImage} />
        </div>

        <div className={styles.card}>
          <span className={styles.iconBadge}>
            <ShieldCheckIcon className={styles.icon} />
          </span>
          <h3 className={styles.cardTitle}>Authenticity</h3>
          <p className={styles.cardBody}>
            Upholding the strict canonical traditions of Vastu Shastra in every project we endorse
            or undertake.
          </p>
        </div>

        <div className={styles.card}>
          <span className={styles.iconBadge}>
            <SparkleIcon className={styles.icon} />
          </span>
          <h3 className={styles.cardTitle}>Preservation</h3>
          <p className={styles.cardBody}>
            Ensuring that every stone, mural, and wooden beam is treated with the respect it
            deserves as a historical artifact.
          </p>
        </div>
      </div>
    </section>
  )
}
