import type { ReactNode } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

import type { Temple } from '@/payload-types'
import type { TempleLocale } from '@/app/(frontend)/temples/[slug]/locale'
import {
  buildTempleView,
  hasText,
  type HighlightIcon,
  type TransitKind,
} from '../templeView'
import { BusIcon } from '@/components/icons/TempleIcons'
import { MobileCard } from './MobileCard'
import { MobileHero } from './MobileHero'
import { MobileMap } from './MobileMap'
import {
  BathingIcon,
  CheckCircleIcon,
  FlameIcon,
  GatheringIcon,
  InfoCircleIcon,
  MailOutlineIcon,
  MeditationIcon,
  MedalIcon,
  MoonIcon,
  NavigateRouteIcon,
  OfferingIcon,
  PartyIcon,
  PlaneIcon,
  SacredSymbolIcon,
  SendIcon,
  ShieldAtIcon,
  SparklesIcon,
  SunriseIcon,
  TempleBuildingIcon,
  TrainIcon,
  WavesIcon,
  ExternalLinkIcon,
} from './MobileIcons'
import styles from './TempleMobile.module.css'

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

export function TempleMobile({
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
  const hasCoordinates =
    typeof temple.latitude === 'number' && typeof temple.longitude === 'number'

  return (
    <div className={styles.root}>
      <MobileHero temple={temple} locale={locale} />

      <div className={styles.content}>
        {darshan.length > 0 && (
          <MobileCard
            icon={<ClockBadgeIcon />}
            tone="peach"
            eyebrow="Temple Timing & Advisory"
            title="Darshan & Timings"
          >
            <ul className={styles.rows}>
              {darshan.map((item) => (
                <li key={item.id} className={`${styles.row} ${styles.darshanRow}`}>
                  <span className={styles.rowLabel} lang={locale}>
                    <span className={styles.rowIcon}>
                      {item.isMorning ? <SunriseIcon /> : <MoonIcon />}
                    </span>
                    {item.label}
                  </span>
                  <span className={styles.time}>{item.time}</span>
                </li>
              ))}
            </ul>
            {advisory && (
              <p className={styles.advisory} lang={locale}>
                <InfoCircleIcon className={styles.advisoryIcon} />
                <span>
                  <strong>Advisory:</strong> {advisory}
                </span>
              </p>
            )}
          </MobileCard>
        )}

        {rituals.length > 0 && (
          <MobileCard
            icon={<FlameIcon />}
            tone="lavender"
            eyebrow="Sacred Daily Rituals"
            title="Ritual Schedule"
          >
            <ul className={styles.rows}>
              {rituals.map((ritual) => (
                <li key={ritual.id} className={styles.row}>
                  <span className={styles.rowLabel} lang={locale}>
                    {ritual.name}
                  </span>
                  {ritual.time && <span className={styles.time}>{ritual.time}</span>}
                </li>
              ))}
            </ul>
            {view.ritualNote && (
              <p className={styles.note} lang={locale}>
                {view.ritualNote}
              </p>
            )}
          </MobileCard>
        )}

        {temple.historyNarrative && (
          <MobileCard
            icon={<TempleBuildingIcon />}
            tone="lavender"
            eyebrow="Divine Heritage"
            title="About the Temple"
          >
            <div className={styles.prose} lang={locale}>
              <RichText data={temple.historyNarrative} />
            </div>
          </MobileCard>
        )}

        {view.hasSpiritualDetails && (
          <MobileCard
            icon={<MeditationIcon />}
            tone="peach"
            eyebrow="Sacred Heritage & Beliefs"
            title="Spiritual Details"
          >
            <div lang={locale}>
              {(hasText(temple.presidingDeity) || hasText(temple.sacredLocation)) && (
                <ul className={styles.items}>
                  {hasText(temple.presidingDeity) && (
                    <li className={styles.item}>
                      <span className={styles.itemIcon}>
                        <MedalIcon />
                      </span>
                      <span>
                        <span className={styles.itemLabel}>Presiding Deity</span>
                        <span className={styles.itemText}>{temple.presidingDeity}</span>
                      </span>
                    </li>
                  )}
                  {hasText(temple.sacredLocation) && (
                    <li className={styles.item}>
                      <span className={styles.itemIcon}>
                        <WavesIcon />
                      </span>
                      <span>
                        <span className={styles.itemLabel}>Sacred Location</span>
                        <span className={styles.itemText}>{temple.sacredLocation}</span>
                      </span>
                    </li>
                  )}
                </ul>
              )}
              {significance.length > 0 && (
                <div className={`${styles.prose} ${styles.proseDivided}`}>
                  {significance.map((text, index) => (
                    <p key={index}>{text}</p>
                  ))}
                </div>
              )}
            </div>
          </MobileCard>
        )}

        {highlights.length > 0 && (
          <MobileCard
            icon={<SparklesIcon />}
            tone="peach"
            eyebrow="Sanctified Traditions"
            title="Spiritual Highlights"
          >
            <ul className={styles.items} lang={locale}>
              {highlights.map((item, index) => (
                <li key={item.id ?? index} className={styles.item}>
                  <span className={styles.itemIcon}>{HIGHLIGHT_ICONS[item.icon ?? 'sacred']}</span>
                  <span>
                    <span className={styles.itemTitle}>{item.title}</span>
                    {hasText(item.description) && (
                      <span className={styles.itemText}>{item.description}</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </MobileCard>
        )}

        {festivals.length > 0 && (
          <MobileCard
            icon={<PartyIcon />}
            tone="lavender"
            eyebrow="Festive Calendar"
            title="Festivals & Celebrations"
          >
            <ul className={styles.festivals} lang={locale}>
              {festivals.map((festival, index) => (
                <li key={festival.id ?? index} className={styles.festival}>
                  <h3 className={styles.festivalName}>{festival.name}</h3>
                  {hasText(festival.description) && (
                    <p className={styles.festivalText}>{festival.description}</p>
                  )}
                </li>
              ))}
            </ul>
          </MobileCard>
        )}

        {(guidelines.length > 0 || hasText(temple.visitorGuidelinesIntro)) && (
          <MobileCard
            icon={<ShieldAtIcon />}
            tone="peach"
            eyebrow="Pilgrim Code & Protocol"
            title="Visitor Guidelines"
          >
            <div lang={locale}>
              {hasText(temple.visitorGuidelinesIntro) && (
                <p className={styles.intro}>{temple.visitorGuidelinesIntro}</p>
              )}
              {guidelines.length > 0 && (
                <ul className={styles.checks}>
                  {guidelines.map((item, index) => (
                    <li key={item.id ?? index}>
                      <CheckCircleIcon className={styles.checkIcon} />
                      <span>
                        {hasText(item.title) && <strong>{item.title}: </strong>}
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </MobileCard>
        )}

        {view.hasReach && (
          <MobileCard
            icon={<SendIcon />}
            tone="lavender"
            eyebrow="Travel & Connectivity"
            title="How to Reach"
          >
            {temple.howToReach && (
              <div className={`${styles.prose} ${styles.intro}`} lang={locale}>
                <RichText data={temple.howToReach} />
              </div>
            )}
            <div className={styles.boxes}>
              {hasText(temple.address) && (
                <div className={styles.box}>
                  <MailOutlineIcon className={styles.boxIcon} />
                  <div>
                    <p className={styles.boxTitle}>Postal Address</p>
                    <p className={styles.boxText}>{temple.address}</p>
                  </div>
                </div>
              )}
              {view.transit.map((point) => (
                <div key={point.id} className={styles.box}>
                  <span className={styles.boxIcon}>{TRANSIT_ICONS[point.kind]}</span>
                  <div lang={locale}>
                    <p className={styles.boxTitle}>{point.heading}</p>
                    <p className={styles.boxText}>{point.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </MobileCard>
        )}

        {view.hasDirection && (
          <MobileCard
            icon={<SendIcon />}
            tone="lavender"
            eyebrow="Navigation & Orientation"
            title="Direction"
          >
            {hasText(temple.directionNote) && (
              <p className={styles.intro} lang={locale}>
                {temple.directionNote}
              </p>
            )}
            {hasCoordinates && view.directionsUrl && view.mapsUrl && (
              <>
                <MobileMap
                  latitude={temple.latitude as number}
                  longitude={temple.longitude as number}
                  name={temple.name}
                  apiKey={mapsApiKey}
                />
                <a
                  href={view.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.button} ${styles.buttonPrimary}`}
                >
                  <NavigateRouteIcon />
                  Get Navigation Route
                </a>
                <a
                  href={view.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.button} ${styles.buttonSecondary}`}
                >
                  <ExternalLinkIcon />
                  Google Maps
                </a>
              </>
            )}
          </MobileCard>
        )}
      </div>
    </div>
  )
}

function ClockBadgeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  )
}
