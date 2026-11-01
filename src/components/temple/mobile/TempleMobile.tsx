import type { ReactNode } from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'

import type { Temple } from '@/payload-types'
import type { TempleLocale } from '@/app/(frontend)/temples/[slug]/locale'
import { formatIstTimeShort, istHour } from '@/utilities/ist'
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

type Highlight = NonNullable<Temple['spiritualHighlights']>[number]
type TransitPoint = NonNullable<Temple['transitPoints']>[number]

const HIGHLIGHT_ICONS: Record<NonNullable<Highlight['icon']>, ReactNode> = {
  sacred: <SacredSymbolIcon />,
  gathering: <GatheringIcon />,
  offering: <OfferingIcon />,
  water: <WavesIcon />,
  bathing: <BathingIcon />,
}

function paragraphs(text: string | null | undefined): string[] {
  return (text ?? '')
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)
}

function timeRange(start?: string | null, end?: string | null): string | null {
  if (!start) return null
  return end ? `${formatIstTimeShort(start)} – ${formatIstTimeShort(end)}` : formatIstTimeShort(start)
}

function transitIcon(type: string | null | undefined): ReactNode {
  const value = (type ?? '').toLowerCase()
  if (/(train|rail|metro)/.test(value)) return <TrainIcon />
  if (/(air|flight|plane)/.test(value)) return <PlaneIcon />
  return <BusIcon />
}

function transitHeading(point: TransitPoint): string {
  const label = `By ${point.type ?? 'road'}`
  if (typeof point.distance !== 'number') return label
  return `${label} (${Number(point.distance.toFixed(2))} ${point.unit ?? 'km'})`
}

function hasText(value: string | null | undefined): value is string {
  return Boolean(value && value.trim())
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
  const darshan = (temple.darshanTimings ?? []).flatMap((timing) => {
    const time = timeRange(timing.openTime, timing.closeTime)
    return time && timing.openTime ? [{ id: timing.id, label: timing.label, time, open: timing.openTime }] : []
  })
  const advisory = hasText(temple.advisory) ? temple.advisory : undefined

  const rituals = (temple.dailyRituals ?? []).flatMap((ritual) => {
    const time = timeRange(ritual.startTime, ritual.endTime)
    return ritual.name && time ? [{ id: ritual.id, name: ritual.name, time }] : []
  })

  const significance = paragraphs(temple.spiritualSignificance)
  const hasSpiritualDetails =
    hasText(temple.presidingDeity) || hasText(temple.sacredLocation) || significance.length > 0
  const highlights = (temple.spiritualHighlights ?? []).filter((item) => hasText(item.title))
  const festivals = (temple.festivals ?? []).filter((item) => hasText(item.name))

  const guidelines: { id?: string | null; title?: string | null; text: string }[] = []
  const men = temple.dressCode?.men
  const women = temple.dressCode?.women
  if (hasText(men) || hasText(women)) {
    guidelines.push({
      id: 'dress-code',
      title: 'Dress Code',
      text: [hasText(men) ? `Men: ${men}` : '', hasText(women) ? `Women: ${women}` : '']
        .filter(Boolean)
        .join(' '),
    })
  }
  for (const rule of temple.importantRules ?? []) {
    if (hasText(rule.rule)) guidelines.push({ id: rule.id, title: rule.title, text: rule.rule })
  }

  const transitPoints = (temple.transitPoints ?? []).filter((point) => point.type || point.name)
  const hasReachContent = Boolean(temple.howToReach) || hasText(temple.address) || transitPoints.length > 0

  const hasCoordinates =
    typeof temple.latitude === 'number' && typeof temple.longitude === 'number'
  const coordinates = hasCoordinates ? `${temple.latitude},${temple.longitude}` : undefined
  const hasDirection = hasCoordinates || hasText(temple.directionNote)

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
              {darshan.map((item, index) => (
                <li key={item.id ?? index} className={`${styles.row} ${styles.darshanRow}`}>
                  <span className={styles.rowLabel} lang={locale}>
                    <span className={styles.rowIcon}>
                      {istHour(item.open) < 12 ? <SunriseIcon /> : <MoonIcon />}
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
              {rituals.map((ritual, index) => (
                <li key={ritual.id ?? index} className={styles.row}>
                  <span className={styles.rowLabel} lang={locale}>
                    {ritual.name}
                  </span>
                  <span className={styles.time}>{ritual.time}</span>
                </li>
              ))}
            </ul>
            {hasText(temple.ritualNote) && (
              <p className={styles.note} lang={locale}>
                {temple.ritualNote}
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

        {hasSpiritualDetails && (
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

        {hasReachContent && (
          <MobileCard
            icon={<SendIcon />}
            tone="lavender"
            eyebrow="Travel & Connectivity"
            title="How to Reach"
          >
            {temple.howToReach && (
              <div className={`${styles.prose} ${styles.intro}`}>
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
              {transitPoints.map((point, index) => (
                <div key={point.id ?? index} className={styles.box}>
                  <span className={styles.boxIcon}>{transitIcon(point.type)}</span>
                  <div>
                    <p className={styles.boxTitle}>{transitHeading(point)}</p>
                    <p className={styles.boxText}>
                      {hasText(point.description) ? point.description : point.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </MobileCard>
        )}

        {hasDirection && (
          <MobileCard
            icon={<SendIcon />}
            tone="lavender"
            eyebrow="Navigation & Orientation"
            title="Direction"
          >
            {hasText(temple.directionNote) && <p className={styles.intro}>{temple.directionNote}</p>}
            {hasCoordinates && coordinates && (
              <>
                <MobileMap
                  latitude={temple.latitude as number}
                  longitude={temple.longitude as number}
                  name={temple.name}
                  apiKey={mapsApiKey}
                />
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${coordinates}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.button} ${styles.buttonPrimary}`}
                >
                  <NavigateRouteIcon />
                  Get Navigation Route
                </a>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${coordinates}`}
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
