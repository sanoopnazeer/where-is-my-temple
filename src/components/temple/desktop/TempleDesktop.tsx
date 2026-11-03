import type { ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'

import type { Temple } from '@/payload-types'
import type { TempleLocale } from '@/app/(frontend)/temples/[slug]/locale'
import { resolveMediaUrl } from '@/utilities/media'
import { BuildingIcon, ClockIcon, PinIcon } from '@/components/icons/TempleIcons'
import {
  BathingIcon,
  ChecklistIcon,
  CompassIcon,
  DropletIcon,
  GatheringIcon,
  HandIcon,
  HangerIcon,
  InfoCircleIcon,
  LotusIcon,
  MapFoldIcon,
  MoonIcon,
  NavigateRouteIcon,
  OfferingIcon,
  PartyIcon,
  PinOutlineIcon,
  PlaneIcon,
  SacredSymbolIcon,
  SendIcon,
  SparklesIcon,
  TrainIcon,
  WarningIcon,
  WavesIcon,
  MedalIcon,
  MeditationIcon,
} from '../mobile/MobileIcons'
import {
  BusIcon,
  FacebookIcon,
  InstagramIcon,
  LinkIcon,
  MailIcon,
  PhoneIcon,
  WhatsappIcon,
  YoutubeIcon,
} from '@/components/icons/TempleIcons'
import { MobileMap } from '../mobile/MobileMap'
import {
  buildContactLinks,
  buildTempleView,
  hasText,
  type ContactKind,
  type HighlightIcon,
  type TransitKind,
} from '../templeView'
import { DesktopCard } from './DesktopCard'
import styles from './TempleDesktop.module.css'

const HIGHLIGHT_ICONS: Record<HighlightIcon, ReactNode> = {
  sacred: <SacredSymbolIcon />,
  gathering: <GatheringIcon />,
  offering: <OfferingIcon />,
  water: <WavesIcon />,
  bathing: <BathingIcon />,
}

const TRANSIT_ICONS: Record<TransitKind, ReactNode> = {
  train: <TrainIcon />,
  air: <PlaneIcon />,
  road: <BusIcon />,
}

const CONTACT_ICONS: Record<ContactKind, ReactNode> = {
  phone: <PhoneIcon />,
  whatsapp: <WhatsappIcon />,
  email: <MailIcon />,
  website: <LinkIcon />,
  instagram: <InstagramIcon />,
  facebook: <FacebookIcon />,
  youtube: <YoutubeIcon />,
}

// The design gives each festival / guideline its own glyph; the CMS has no
// icon field for them, so they cycle through the design's set in order.
const FESTIVAL_ICONS = [<MoonIcon key="m" />, <DropletIcon key="d" />, <BuildingIcon key="b" />]
const GUIDELINE_ICONS = [
  <HangerIcon key="h" />,
  <HandIcon key="a" />,
  <WarningIcon key="w" />,
  <InfoCircleIcon key="i" />,
]

export function TempleDesktop({
  temple,
  locale,
  mapsApiKey,
}: {
  temple: Temple
  locale: TempleLocale
  mapsApiKey?: string
}) {
  const view = buildTempleView(temple, locale)
  const { darshan, advisory, rituals, significance, highlights, festivals, guidelines } = view

  const heroUrl = resolveMediaUrl(temple.heroImage)
  const heroAlt =
    typeof temple.heroImage === 'object' && temple.heroImage
      ? (temple.heroImage.alt ?? temple.name)
      : temple.name
  const district =
    typeof temple.district === 'object' && temple.district ? temple.district.name : undefined
  const locationLine = [temple.locality, district, 'Kerala'].filter(hasText).join(', ')
  const hasCoordinates = typeof temple.latitude === 'number' && typeof temple.longitude === 'number'
  const locationName = hasText(temple.locality) ? temple.locality : temple.name

  const contactLinks = buildContactLinks(temple)

  const hasSideColumn =
    darshan.length > 0 ||
    rituals.length > 0 ||
    view.hasSpiritualDetails ||
    highlights.length > 0 ||
    guidelines.length > 0 ||
    hasText(temple.visitorGuidelinesIntro)

  return (
    <div className={styles.root}>
      <section className={styles.hero}>
        {heroUrl ? (
          <Image
            src={heroUrl}
            alt={heroAlt}
            fill
            priority
            sizes="100vw"
            className={styles.heroImage}
          />
        ) : (
          <div className={styles.heroFallback} role="img" aria-label="Temple image unavailable" />
        )}
        <div className={styles.heroOverlay} />

        <div className={styles.localeSwitch} role="group" aria-label="Language">
          <Link
            href="?lang=en"
            scroll={false}
            className={locale === 'en' ? styles.localeActive : styles.localeLink}
            aria-current={locale === 'en' ? 'true' : undefined}
          >
            EN
          </Link>
          <Link
            href="?lang=ml"
            scroll={false}
            className={locale === 'ml' ? styles.localeActive : styles.localeLink}
            aria-current={locale === 'ml' ? 'true' : undefined}
          >
            മലയാളം
          </Link>
        </div>

        <div className={styles.heroContent} lang={locale}>
          {locationLine && (
            <span className={styles.locationChip} lang="en">
              <PinIcon className={styles.chipPin} />
              {locationLine}
            </span>
          )}
          <h1 className={styles.heroTitle}>{temple.name}</h1>
          {temple.tagline && <p className={styles.heroTagline}>{temple.tagline}</p>}
        </div>
      </section>

      <div className={`${styles.grid} ${hasSideColumn ? '' : styles.gridSingle}`}>
        <div className={styles.column}>
          {temple.historyNarrative && (
            <DesktopCard
              icon={<BuildingIcon />}
              eyebrow="Divine Heritage"
              title="About the Temple"
              aside={district ? <span className={styles.districtChip}>{district}</span> : undefined}
            >
              <div className={`${styles.prose} ${styles.lead}`} lang={locale}>
                <RichText data={temple.historyNarrative} />
              </div>
            </DesktopCard>
          )}

          {festivals.length > 0 && (
            <DesktopCard
              icon={<PartyIcon />}
              tone="purple"
              eyebrow="Festive Calendar"
              title="Festivals & Celebrations"
            >
              <ul className={styles.festivals} lang={locale}>
                {festivals.map((festival, index) => (
                  <li key={festival.id ?? index}>
                    <h3 className={styles.festivalName}>
                      <span className={styles.festivalIcon}>
                        {FESTIVAL_ICONS[index % FESTIVAL_ICONS.length]}
                      </span>
                      {festival.name}
                    </h3>
                    {hasText(festival.description) && (
                      <p className={styles.lead}>{festival.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </DesktopCard>
          )}

          {view.hasReach && (
            <DesktopCard
              icon={<SendIcon />}
              tone="teal"
              eyebrow="Travel & Connectivity"
              title="How to Reach"
            >
              {temple.howToReach && (
                <div className={`${styles.prose} ${styles.lead} ${styles.reachIntro}`} lang={locale}>
                  <RichText data={temple.howToReach} />
                </div>
              )}
              <ul className={styles.reachList}>
                {hasText(temple.address) && (
                  <li className={styles.reachItem}>
                    <span className={styles.reachIcon}>
                      <PinOutlineIcon />
                    </span>
                    <div>
                      <p className={styles.reachTitle}>Postal Address</p>
                      <p className={styles.reachText}>{temple.address}</p>
                    </div>
                  </li>
                )}
                {view.transit.map((point) => (
                  <li key={point.id} className={styles.reachItem}>
                    <span className={styles.reachIcon}>{TRANSIT_ICONS[point.kind]}</span>
                    <div lang={locale}>
                      <p className={styles.reachTitle}>{point.heading}</p>
                      <p className={styles.reachText}>{point.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </DesktopCard>
          )}

          {view.hasDirection && (
            <DesktopCard
              icon={<CompassIcon />}
              eyebrow="Navigation & Orientation"
              title="Direction"
              aside={
                hasText(temple.locality) ? (
                  <span className={styles.districtChip}>
                    <span className={styles.liveDot} />
                    {temple.locality}
                  </span>
                ) : undefined
              }
            >
              {hasText(temple.directionNote) && (
                <p className={`${styles.lead} ${styles.reachIntro}`} lang={locale}>
                  {temple.directionNote}</p>
              )}
              {hasCoordinates && view.directionsUrl && view.mapsUrl && (
                <div className={styles.mapBox}>
                  <MobileMap
                    latitude={temple.latitude as number}
                    longitude={temple.longitude as number}
                    name={temple.name}
                    apiKey={mapsApiKey}
                    height={290}
                  />
                  <div className={styles.mapBar}>
                    <div className={styles.mapPlace}>
                      <p className={styles.mapPlaceName}>
                        <PinOutlineIcon />
                        {locationName} Location
                      </p>
                      {hasText(temple.address) && (
                        <p className={styles.mapAddress}>{temple.address}</p>
                      )}
                    </div>
                    <div className={styles.mapButtons}>
                      <a
                        href={view.directionsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.buttonPrimary}
                      >
                        <NavigateRouteIcon />
                        Get Navigation Route
                      </a>
                      <a
                        href={view.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.buttonSecondary}
                      >
                        <MapFoldIcon />
                        Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </DesktopCard>
          )}

          {contactLinks.length > 0 && (
            <DesktopCard
              icon={<PhoneIcon />}
              tone="teal"
              eyebrow="Get in Touch"
              title="Contact & Social Links"
            >
              <ul className={styles.reachList}>
                {contactLinks.map((link) => (
                  <li key={link.kind} className={styles.reachItem}>
                    <span className={styles.reachIcon}>{CONTACT_ICONS[link.kind]}</span>
                    <div>
                      <p className={styles.reachTitle}>{link.label}</p>
                      <a
                        href={link.href}
                        className={styles.contactLink}
                        {...(link.href.startsWith('http')
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {link.value}
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
            </DesktopCard>
          )}
        </div>

        {hasSideColumn && (
          <div className={styles.column}>
            {darshan.length > 0 && (
              <DesktopCard
                icon={<ClockIcon />}
                eyebrow="Temple Timing & Advisory"
                title="Temple Timings"
                compact
              >
                <ul className={styles.tiles}>
                  {darshan.map((item) => (
                    <li key={item.id} className={styles.tile}>
                      <span className={styles.tileLabel} lang={locale}>
                        {item.label}
                      </span>
                      <span className={styles.tileTime}>{item.time}</span>
                    </li>
                  ))}
                </ul>
                {advisory && (
                  <div className={styles.notice} lang={locale}>
                    <p className={styles.noticeHeading}>
                      <InfoCircleIcon />
                      Darshan Timing Advisory
                    </p>
                    <p>{advisory}</p>
                  </div>
                )}
              </DesktopCard>
            )}

            {rituals.length > 0 && (
              <DesktopCard
                icon={<SparklesIcon />}
                eyebrow="Sacred Daily Rituals"
                title="Ritual Schedule"
                compact
              >
                <ul className={styles.rituals}>
                  {rituals.map((ritual) => (
                    <li key={ritual.id}>
                      <span className={styles.ritualName} lang={locale}>
                        {ritual.name}
                      </span>
                      {ritual.time && <span className={styles.ritualTime}>{ritual.time}</span>}
                    </li>
                  ))}
                </ul>
                {view.ritualNote && (
                  <p className={`${styles.notice} ${styles.noticeInline}`} lang={locale}>
                    <InfoCircleIcon />
                    <span>{view.ritualNote}</span>
                  </p>
                )}
              </DesktopCard>
            )}

            {view.hasSpiritualDetails && (
              <DesktopCard
                icon={<MeditationIcon />}
                eyebrow="Sacred Heritage & Beliefs"
                title="Spiritual Details"
                compact
              >
                <div lang={locale}>
                  {hasText(temple.presidingDeity) && (
                    <div className={styles.detailBox}>
                      <span className={styles.detailIcon}>
                        <MedalIcon />
                      </span>
                      <div>
                        <p className={styles.detailLabel}>Presiding Deity</p>
                        <p className={styles.detailValue}>{temple.presidingDeity}</p>
                      </div>
                    </div>
                  )}
                  {hasText(temple.sacredLocation) && (
                    <div className={styles.detailBox}>
                      <span className={`${styles.detailIcon} ${styles.detailIconPurple}`}>
                        <WavesIcon />
                      </span>
                      <div>
                        <p className={`${styles.detailLabel} ${styles.detailLabelPurple}`}>
                          Sacred Location
                        </p>
                        <p className={styles.detailValue}>{temple.sacredLocation}</p>
                      </div>
                    </div>
                  )}
                  {significance.length > 0 && (
                    <div className={styles.small}>
                      {significance.map((text, index) => (
                        <p key={index}>{text}</p>
                      ))}
                    </div>
                  )}
                </div>
              </DesktopCard>
            )}

            {highlights.length > 0 && (
              <DesktopCard
                icon={<LotusIcon />}
                tone="purple"
                eyebrow="Sanctified Traditions"
                title="Spiritual Highlights"
                compact
              >
                <ul className={styles.highlights} lang={locale}>
                  {highlights.map((item, index) => (
                    <li key={item.id ?? index}>
                      <span className={styles.highlightIcon}>
                        {HIGHLIGHT_ICONS[item.icon ?? 'sacred']}
                      </span>
                      <p>
                        <strong>{item.title}</strong>
                        {hasText(item.description) && <>: {item.description}</>}
                      </p>
                    </li>
                  ))}
                </ul>
              </DesktopCard>
            )}

            {(guidelines.length > 0 || hasText(temple.visitorGuidelinesIntro)) && (
              <DesktopCard
                icon={<ChecklistIcon />}
                eyebrow="Pilgrim Code & Protocol"
                title="Visitor Guidelines"
                compact
              >
                <div lang={locale}>
                  {hasText(temple.visitorGuidelinesIntro) && (
                    <p className={`${styles.small} ${styles.guidelinesIntro}`}>
                      {temple.visitorGuidelinesIntro}
                    </p>
                  )}
                  {guidelines.length > 0 && (
                    <ul className={styles.guidelines}>
                      {guidelines.map((item, index) => (
                        <li key={item.id}>
                          <span className={styles.guidelineIcon}>
                            {GUIDELINE_ICONS[index % GUIDELINE_ICONS.length]}
                          </span>
                          <p>
                            {hasText(item.title) && <strong>{item.title}: </strong>}
                            {item.text}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </DesktopCard>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
