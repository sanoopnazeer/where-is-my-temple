import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

/*
 * Temples.transitPoints[].type changed from free localized text to a fixed
 * select (road, bus, rail, air, metro). `up` maps the existing text (English
 * or Malayalam, stored as `{ en, ml }` or a plain string) to the closest
 * value by keyword; anything unrecognised becomes `road`, the previous
 * default icon. `down` writes the English label back as localized text.
 *
 * Idempotent: values that are already one of the select values are left alone.
 */

const VALUES = ['road', 'bus', 'rail', 'air', 'metro']
const LABELS: Record<string, string> = {
  road: 'Road',
  bus: 'Bus',
  rail: 'Rail',
  air: 'Air',
  metro: 'Metro',
}

type Doc = Record<string, unknown>

const isObject = (value: unknown): value is Doc =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

function toValue(raw: unknown): unknown {
  if (typeof raw === 'string' && VALUES.includes(raw)) return raw
  const text = isObject(raw)
    ? Object.values(raw).filter((part) => typeof part === 'string').join(' ')
    : typeof raw === 'string'
      ? raw
      : ''
  const value = text.toLowerCase()
  if (!value.trim()) return raw === undefined ? undefined : null
  if (/(metro|മെട്രോ)/.test(value)) return 'metro'
  if (/(train|rail|ട്രെയിൻ|റെയിൽ)/.test(value)) return 'rail'
  if (/(air|flight|plane|വിമാന|എയർ)/.test(value)) return 'air'
  if (/(bus|ബസ്)/.test(value)) return 'bus'
  return 'road'
}

function toLocalized(raw: unknown): unknown {
  if (typeof raw === 'string' && VALUES.includes(raw)) return { en: LABELS[raw] }
  return raw
}

async function run({ payload }: MigrateUpArgs | MigrateDownArgs, fn: (v: unknown) => unknown) {
  const collection = payload.db.collections['temples'].collection
  const docs = (await collection.find({}).toArray()) as Doc[]
  let updated = 0
  for (const doc of docs) {
    if (!Array.isArray(doc.transitPoints)) continue
    let changed = false
    const points = doc.transitPoints.map((point: unknown) => {
      if (!isObject(point) || !('type' in point)) return point
      const next = fn(point.type)
      if (next === point.type) return point
      changed = true
      return { ...point, type: next }
    })
    if (changed) {
      await collection.updateOne({ _id: doc._id as never }, { $set: { transitPoints: points } })
      updated++
    }
  }
  payload.logger.info(`Temples migrated: ${updated} of ${docs.length} documents changed`)
}

export async function up(args: MigrateUpArgs): Promise<void> {
  await run(args, toValue)
}

export async function down(args: MigrateDownArgs): Promise<void> {
  await run(args, toLocalized)
}
