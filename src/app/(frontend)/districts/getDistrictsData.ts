import { getPayload } from 'payload'

import config from '@/payload.config'
import type { District, Media } from '@/payload-types'

export interface DistrictListItem {
  district: District
  templeCount: number
  image?: Media
}

const MAX_DISTRICTS = 200
const MAX_TEMPLES_FOR_COUNT = 1000

/**
 * Districts directory data in two Local API calls total (not one per
 * District): all published Districts, and every published Temple's
 * `district` + `heroImage` references only (`select`, no other Temple
 * fields) to derive a per-district Temple count and a representative photo
 * in memory. Both use `overrideAccess: false` with no `user`, applying the
 * same public `publishedOrAdmin` rule the REST API uses. District has no
 * image field of its own (docs/content-model.md §2) — borrowing a Temple
 * photo follows the same owner-approved precedent as the Home page's
 * "Explore by Districts" section.
 */
export async function getDistrictsData(): Promise<DistrictListItem[]> {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const [districtsResult, templesResult] = await Promise.all([
    payload.find({
      collection: 'districts',
      sort: 'name',
      limit: MAX_DISTRICTS,
      overrideAccess: false,
    }),
    payload.find({
      collection: 'temples',
      select: { district: true, heroImage: true },
      depth: 1,
      limit: MAX_TEMPLES_FOR_COUNT,
      pagination: false,
      overrideAccess: false,
    }),
  ])

  const templeCountByDistrict = new Map<string, number>()
  const imageByDistrict = new Map<string, Media>()

  for (const temple of templesResult.docs) {
    const districtId = typeof temple.district === 'object' ? temple.district?.id : temple.district
    if (!districtId) continue

    templeCountByDistrict.set(districtId, (templeCountByDistrict.get(districtId) ?? 0) + 1)

    if (!imageByDistrict.has(districtId) && typeof temple.heroImage === 'object' && temple.heroImage) {
      imageByDistrict.set(districtId, temple.heroImage)
    }
  }

  return districtsResult.docs.map((district) => ({
    district,
    templeCount: templeCountByDistrict.get(district.id) ?? 0,
    image: imageByDistrict.get(district.id),
  }))
}
