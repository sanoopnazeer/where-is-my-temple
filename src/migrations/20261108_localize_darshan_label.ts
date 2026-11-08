import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-mongodb'

/*
 * Temples.darshanTimings[].label became localized. Mongo stores a localized
 * value as `{ en: value, ml: value }`, so labels saved while the field was
 * plain are wrapped as `{ en: value }` (they were authored in English).
 * `down` unwraps the English value again.
 *
 * Idempotent: values that are already locale objects are left alone.
 */

const LOCALES = ['en', 'ml']

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

async function run({ payload }: MigrateUpArgs | MigrateDownArgs, fn: (v: unknown) => unknown) {
  const collection = payload.db.collections['temples'].collection
  const docs = (await collection.find({}).toArray()) as Doc[]
  let updated = 0
  for (const doc of docs) {
    if (!Array.isArray(doc.darshanTimings)) continue
    let changed = false
    const timings = doc.darshanTimings.map((timing: unknown) => {
      if (!isObject(timing) || !('label' in timing)) return timing
      const next = fn(timing.label)
      if (next === timing.label) return timing
      changed = true
      return { ...timing, label: next }
    })
    if (changed) {
      await collection.updateOne({ _id: doc._id as never }, { $set: { darshanTimings: timings } })
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
