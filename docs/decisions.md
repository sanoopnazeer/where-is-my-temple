# Architecture Decisions

## ADR-001 — Use Payload CMS
Date: 2026-09-18
Decision: Payload CMS
Reason: Avoid building a custom admin panel.

## ADR-002 — Use MongoDB Atlas
Date: 2026-09-18
Decision: MongoDB Atlas
Reason: Existing MERN expertise and Payload compatibility.

## ADR-003 — Use one URL for Temple language switch
Date: 2026-09-18
Decision: Same URL, client/server-rendered locale switch.
Reason: Simpler V1 implementation.

## ADR-004 — Event district derived from Temple
Date: 2026-09-18
Decision: Do not duplicate district on Event.
Reason: Prevent inconsistent Temple/District relationships.

## ADR-005 — Collection-level access control (owner-directed)
Date: 2026-09-18
Decision:
- Districts, Temples, Events: public read limited to documents where
  `publicationStatus` equals `published`; draft/review documents are not
  publicly readable. Create/update/delete restricted to authenticated
  Payload users.
- Media: read stays public (no publication-status concept for Media);
  create/update/delete restricted to authenticated Payload users.
- No role-based access control in V1 — any authenticated user is treated
  as an admin, matching the existing single-admin-user model.
Reason: Owner decision. Implemented via two reusable native Payload access
functions: `src/access/isAdmin.ts` and `src/access/publishedOrAdmin.ts`.
`publishedOrAdmin` reads the `publicationStatus` field already specified for
Temple in `docs/content-model.md` §3.13, rather than introducing Payload's
built-in `versions.drafts`/`_status` mechanism, to avoid two competing
publish-state concepts.
Open item (resolved by ADR-006): `docs/content-model.md` only defined
`publicationStatus` on Temple. Districts and Events had no such field, so
they could not enforce "published-only" public read until one was added.

## ADR-006 — publicationStatus added to Districts and Events; collections implemented
Date: 2026-09-18
Decision: Add a `publicationStatus` field (`draft` / `review` / `published`
/ `archived`) to Districts and Events, identical to Temple's existing field
(docs/content-model.md §3.13). This is the project's single
publication-state concept for V1 across all three collections — Payload's
separate versions/drafts (`_status`) system is not used.
Implemented:
- `src/fields/publicationStatus.ts` — shared field factory used by
  Districts, Temples and Events.
- `src/collections/Districts.ts`, `src/collections/Temples.ts`,
  `src/collections/Events.ts` — created per `docs/content-model.md`, using
  `publishedOrAdmin` for read and `isAdmin` for create/update/delete.
- `src/payload.config.ts` — registered the three collections and added
  `localization: { locales: ['en', 'ml'], defaultLocale: 'en', fallback: true }`
  (required for the localized Temple fields; `fallback: true` means an
  empty Malayalam value falls back to English rather than rendering blank —
  a technical default, not a new product decision, and easy to flip later).
- Event `status` (Past/Ongoing/Upcoming) is a `virtual` field computed from
  `startDate`/`endDate` in an `afterRead` hook — never stored, per the
  existing "no `isUpcoming` field" rule.
Reason: Owner decision (follow-up to ADR-005) plus explicit instruction to
proceed with implementing Districts, Temples and Events per the approved
specification.

## ADR-007 — Cloudflare R2 media storage via the S3-compatible adapter
Date: 2026-09-18
Decision: Configure the existing `media` collection to store files in
Cloudflare R2 using Payload's `@payloadcms/storage-s3` adapter (R2's
S3-compatible API), pinned to `3.89.0` to match the rest of the
`@payloadcms/*` packages. Explicitly NOT using `@payloadcms/storage-r2`
(the Cloudflare Workers R2-binding adapter) — this app targets a
Node.js-compatible managed Next.js host, not the Workers runtime.
Implemented:
- `src/payload.config.ts` — added the `s3Storage` plugin: `region: 'auto'`,
  `endpoint: R2_ENDPOINT`, `forcePathStyle: true`,
  `disableLocalStorage: true`, credentials from `R2_ACCESS_KEY_ID` /
  `R2_SECRET_ACCESS_KEY`. Public URLs are generated from `R2_PUBLIC_URL`
  via a custom `generateFileURL`, so stored URLs are always
  `https://media.whereismytemple.com/<filename>`, independent of the R2
  endpoint's own URL shape.
- `package.json` — added `@payloadcms/storage-s3@3.89.0`.
- `.env.example` — already had `R2_BUCKET`, `R2_ACCESS_KEY_ID`,
  `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT`, `R2_PUBLIC_URL` (no change needed).
- `Media` collection (`src/collections/Media.ts`) and its ADR-005 access
  rules (public read, authenticated-admin create/update/delete) are
  unchanged — the storage backend is transparent to access control and to
  Payload's built-in upload metadata (filename, mimeType, filesize,
  width/height).
Reason: Owner decision, explicit instruction on which adapter to use, and
the approved architecture's existing "Media: Cloudflare R2" decision
(`docs/architecture.md` §3). See `docs/deployment.md` for environment
variables and verification results.

## ADR-008 — Google Maps Embed API for the V1 temple map
Date: 2026-09-18
Decision: Use the Google Maps Embed API, via a plain `<iframe>` in "place"
mode, as the V1 map provider for individual temple location pages.
Reason:
- Simplest possible implementation — no client-side mapping library, no
  JS SDK, no API-key-scoped billing surface beyond the Embed API itself.
- Reliable, well-established provider; a single-marker "place" embed is
  exactly what a single temple's location needs for V1.
- No mapping library required: not Leaflet, Mapbox, MapLibre, the Google
  Maps JavaScript API, Places API, or Geocoding API — only the Embed API's
  URL-based iframe interface.
Implemented:
- `src/components/TempleMap.tsx` (+ `TempleMap.module.css`) — a
  presentational, reusable component. Takes `latitude`/`longitude` as
  props (sourced directly from `Temple.latitude`/`Temple.longitude` —
  no new coordinate model, no extra database request). Renders nothing if
  either coordinate is missing or not a finite number. Builds the embed
  URL as `.../maps/embed/v1/place?key=...&q=<lat>,<lng>&zoom=15` — the
  coordinates themselves are the location query; no geocoding or places
  lookup is performed.
- Reads the key from `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` at render
  time; never hardcoded. If the key is unset: renders a plain placeholder
  instead of the iframe — a generic "Map is currently unavailable" message
  in production, a more descriptive local-dev hint otherwise — so a
  missing key never crashes the page or exposes implementation details to
  public users.
- No page currently exists to mount this component in (`docs/development-status.md`
  — "Public website" is still Not Started); building the Temple detail
  page and its "Map + temple marker" section is a separate, later task.
Scope excluded from V1 (per this decision): routing/directions, address
geocoding, place search/autocomplete, and any additional map markers
(nearby temples, transit points, etc.).
Future: if product requirements later need routing, multi-marker maps, or
custom map styling, this can be swapped for another provider — the
`TempleMap` component's props (`latitude`, `longitude`) stay the same
either way, since it already isolates the map from `Temple`'s stored
coordinates.

## ADR-009 — Make CMS fields optional except identity fields (owner-directed)

- **Date:** 2026-10-26
- **Decision:** remove `required: true` from every Payload field except
  `name` and `slug` on Districts/Temples and `name` on Events. This
  includes nested array sub-fields, Media `alt`, `publicationStatus` and
  `verificationStatus` (their `defaultValue`s are kept).
- **Why:** editors need to save partially filled records while data is
  still being researched/imported.
- **Consequences:** the public site must not assume these fields exist.
  Events without both dates (or without a published Temple) are skipped
  by `hasPublicTemple`; Temples without a District are skipped in district
  counts; missing times/alt/coordinates are handled at render time.
  `publicationStatus` is not enforced, so a record saved without one is
  treated as not published (public read only returns `published`).
  `src/payload-types.ts` was regenerated.
