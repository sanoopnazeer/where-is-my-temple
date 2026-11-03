import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

/*
 * Temples.howToReach, Temples.directionNote and Temples.transitPoints[]
 * (description, type, name) became localized. Mongo stores a localized value
 * as `{ en: value, ml: value }`, so values saved while the fields were
 * plain are wrapped as `{ en: value }` (they were authored in English).
 * `down` unwraps the English value again.
 *
 * Idempotent: values that are already locale objects are left alone.
 */

const LOCALES = ['en', 'ml']
const POINT_FIELDS = ['description', 'type', 'name'] as const

type Doc = Record<string, unknown>

const isObject = (value: unknown): value is Doc =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

// A localized value: an object keyed only by locale codes.
const isLocaleMap = (value: unknown): value is Doc =>
  isObject(value) &&
  Object.keys(value).length > 0 &&
  Object.keys(value).every((key) => LOCALES.includes(key))

const wrap = (value: unknown): unknown => {
  if (value === null || value === undefined || value === '' || isLocaleMap(value)) return value
  return { en: value }
}

const unwrap = (value: unknown): unknown => (isLocaleMap(value) ? (value.en ?? null) : value)

function transform(doc: Doc, fn: (value: unknown) => unknown): Doc {
  const $set: Doc = {}

  for (const field of ['howToReach', 'directionNote']) {
    if (field in doc) {
      const next = fn(doc[field])
      if (next !== doc[field]) $set[field] = next
    }
  }

  if (Array.isArray(doc.transitPoints)) {
    let changed = false
    const points = doc.transitPoints.map((point: unknown) => {
      if (!isObject(point)) return point
      const copy: Doc = { ...point }
      for (const field of POINT_FIELDS) {
        if (field in copy) {
          const next = fn(copy[field])
          if (next !== copy[field]) {
            copy[field] = next
            changed = true
          }
        }
      }
      return copy
    })
    if (changed) $set.transitPoints = points
  }

  return $set
}

async function run({ payload }: MigrateUpArgs | MigrateDownArgs, fn: (v: unknown) => unknown) {
  const collection = payload.db.collections['temples'].collection
  const docs = (await collection.find({}).toArray()) as Doc[]
  let updated = 0
  for (const doc of docs) {
    const $set = transform(doc, fn)
    if (Object.keys($set).length > 0) {
      await collection.updateOne({ _id: doc._id as never }, { $set })
      updated++
    }
  }
  payload.logger.info(`Temples migrated: ${updated} of ${docs.length} documents changed`)
}

export async function up(args: MigrateUpArgs): Promise<void> {
  await run(args, wrap)
}

export async function down(args: MigrateDownArgs): Promise<void> {
  await run(args, unwrap)
}
