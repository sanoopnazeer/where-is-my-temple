# Development Status

## Completed

- Payload project scaffolded
- MongoDB Atlas connected
- GitHub repository configured
- Payload admin working
- Initial admin user created
- Architecture documented
- Content model specified
- Access control implemented (`docs/decisions.md` ADR-005/ADR-006):
  `src/access/isAdmin.ts`, `src/access/publishedOrAdmin.ts`,
  `src/fields/publicationStatus.ts`
- Districts, Temples and Events collections implemented per
  `docs/content-model.md` (2026-09-18): `src/collections/Districts.ts`,
  `src/collections/Temples.ts`, `src/collections/Events.ts`; registered in
  `src/payload.config.ts` along with `en`/`ml` localization config.
  Verified against the running dev server: public read returns `200` with
  empty result sets on `/api/districts`, `/api/temples`, `/api/events`,
  `/api/media`; unauthenticated `POST /api/districts` correctly returns
  `403`; all six admin list/create pages for the new collections render
  without server errors. `tsc --noEmit` and `pnpm generate:types` both pass.

- CMS verification pass completed (2026-09-18) — all Definition of Done
  items in `docs/content-model.md` §13 exercised end-to-end with real
  requests against the local dev server (not just Local API simulation).
  See "CMS verification — test data" below for what was checked and what
  was left behind for manual admin-panel inspection.
- Fixed a pre-existing `eslint.config.mjs` bug (2026-09-18): it used the
  legacy `FlatCompat.extends('next/core-web-vitals', 'next/typescript')`
  shim, which crashes with the currently-installed `eslint-plugin-react`
  (circular flat-config object → `TypeError: Converting circular structure
  to JSON`). `eslint-config-next@16.3.3` already ships native ESLint 9 flat
  configs, so the shim is no longer needed — `eslint.config.mjs` now
  imports `eslint-config-next/core-web-vitals` and
  `eslint-config-next/typescript` directly. `pnpm lint` now passes (0
  errors, 5 pre-existing warnings in `src/app/my-route/route.ts` and the
  Playwright e2e stubs, unrelated to this work).

## In Progress

- Pre-implementation context review completed (2026-09-18). Confirmed the
  scaffold (default `create-payload-app` template) was consistent with
  `docs/architecture.md` and `docs/content-model.md` before any collection
  work started. Fixed a stale CLAUDE.md pointer (was referencing a
  non-existent spec filename; now points to `docs/content-model.md`).

- R2 media storage integration completed (2026-09-18, ADR-007): the
  existing `media` collection now stores files in Cloudflare R2 via
  `@payloadcms/storage-s3` (R2's S3-compatible API, not the Workers
  R2-binding adapter). Verified end-to-end against the real bucket/domain:
  upload succeeds, resulting `url` is `https://media.whereismytemple.com/<filename>`,
  the file is fetchable at that URL, no local disk copy is created,
  unauthenticated write stays `403`/read stays `200`, and delete actually
  removes the object from R2 (confirmed after the CDN cache entry
  expired). See `docs/deployment.md` for details and env vars.

- Google Maps Embed API map component built (2026-09-18, ADR-008):
  `src/components/TempleMap.tsx` (+ `TempleMap.module.css`). Reusable,
  presentational — takes `latitude`/`longitude` props (from
  `Temple.latitude`/`Temple.longitude`, no new fields, no extra DB
  request), renders a responsive Google Maps Embed "place" iframe
  (`loading="lazy"`, `allowFullScreen`,
  `referrerPolicy="strict-origin-when-cross-origin"`, no border,
  16:9 aspect ratio). Renders nothing if coordinates are missing/invalid;
  renders a clean placeholder (no error stack, no implementation details)
  if `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` is unset. No mapping package
  was added — plain iframe only. **Not yet wired into a page** — there is
  no temple detail page/route in the frontend yet (see "Not Started"
  below); this was scoped as component-only per owner confirmation.
  Required env var: `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` (added to
  `.env.example`, no real value committed).

  Manual verification performed (via a temporary, uncommitted
  `@testing-library/react` test, run once and deleted):
  1. Valid `latitude`/`longitude` + a key → renders an iframe with
     `src` exactly `https://www.google.com/maps/embed/v1/place?key=<key>&q=<lat>,<lng>&zoom=15`
     (the marker is inherent to Embed API "place" mode for a single
     coordinate — nothing further to configure).
  2. Missing/NaN coordinates → component renders `null` (nothing).
  3. Missing API key → renders a placeholder `div` (`role="img"`), no
     `<iframe>`, no error thrown, no implementation detail in the message.
  4. `tsc --noEmit`, `pnpm lint`, `pnpm generate:types`, `pnpm test:int`,
     `pnpm build` all pass with the component present.
  Remaining manual step (owner): obtain a real
  `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY` (restricted to the production
  domain(s) in Google Cloud Console) and set it in the real environment;
  visually confirm the embed in a browser once a temple page exists to
  mount `TempleMap` in.

- Public Temple Detail Page implemented (2026-09-18), route
  `src/app/(frontend)/temples/[slug]/page.tsx`. Server-rendered (no client
  data fetching); resolves the Temple by slug via the Local API with
  `overrideAccess: false` and no `user`, so it enforces the exact same
  `publishedOrAdmin` rule the public REST API uses — unpublished/draft/
  review/archived Temples and unknown slugs both 404 (`notFound()`), with no
  separate access-control logic duplicated in the route. `generateMetadata`
  and the page share one DB call per request via `getTemple.ts` (wrapped in
  React `cache()`).
  - Sections implemented, in design order: hero (image + name, with an
    `?lang=en|ml` locale switch — plain `<Link>`, no client JS), Darshan
    Timings/Dress Code/Important Rules quick-info cards, History (rendered
    via `@payloadcms/richtext-lexical/react`'s `RichText`), Daily Rituals,
    Gallery, Plan Your Visit (`howToReach` + transit points + a "Get
    Directions" link built from the Temple's own lat/lng — no extra
    geocoding request) with `TempleMap` alongside it, Contact/social links,
    and the "List your temple" CTA (non-functional, labeled "Coming Soon"
    per CLAUDE.md §4).
  - Components: `src/components/temple/` (`TempleHero`, `TempleQuickInfo`,
    `TempleHistory`, `TempleDailyRituals`, `TempleGallery`,
    `TemplePlanYourVisit`, `TempleContact`) and `src/components/layout/`
    (`SiteHeader`, `SiteFooter`, `ComingSoonCta`) — new, since no site
    chrome existed yet. Each Temple section hides itself entirely when its
    underlying field(s) are empty, rather than rendering an empty container.
  - `next.config.ts`: added `images.remotePatterns` for
    `media.whereismytemple.com` (the R2 public domain from ADR-007) — needed
    for `next/image` to optimize Temple hero/gallery images; not a new
    architectural decision, just wiring already-approved R2 media through
    Next's image pipeline.
  - Localization: only the fields listed in `docs/architecture.md` §10 /
    `docs/content-model.md` §5 switch language (name, historyNarrative,
    dailyRituals name/description, dressCode, importantRules), via the
    `locale` param on the Local API call. Static section headings/labels are
    intentionally kept English-only (not translated) to avoid introducing
    unreviewed Malayalam UI copy beyond the approved localized-fields list.
  - Verified end-to-end against the local dev server with temporary,
    clearly-labeled TEST content (created and fully deleted after
    verification — see below): published Temple renders (200); unpublished
    (draft) Temple 404s; invalid slug 404s; `?lang=ml` renders only
    Malayalam content (zero English strings present) and `?lang=en`/default
    renders only English; hero/gallery images load through `next/image`
    from the real R2 URL; `TempleMap` renders with valid coordinates and
    with the real embed key already present in local `.env`; a Temple with
    only the required fields (no hero/gallery/rituals/darshan/dress
    code/rules/contact) renders with every optional section cleanly absent
    (no empty cards/containers) and the map still renders since coordinates
    are always required on Temple.
  - Assumptions made (flagged here per CLAUDE.md §10, not decided
    unilaterally as new architecture): the route is `/temples/[slug]`
    (content-model has no explicit URL scheme); header/footer nav items and
    footer links with no corresponding page yet (About Us, Districts wise
    Temples, Contact, Temple Directory, Cultural Festivals, Preservation
    Initiatives, Privacy Policy, Terms of Service) render as inactive labels
    rather than dead links; the footer newsletter field is presentational
    only (no subscription backend exists); canonical/OG URLs use a
    hardcoded `https://whereismytemple.com` constant instead of a new
    `NEXT_PUBLIC_SITE_URL` env var, since the canonical domain is already a
    fixed decision and should point at production regardless of which
    environment renders the page.
  - Not done in this task (explicitly out of scope): pixel-perfect mobile
    layout matching `design/mobile/` (a basic CSS-based responsive review
    was done — grids/flex wrap, no fixed pixel widths beyond `max-width`, no
    horizontal overflow expected — but not a rendered-browser mobile visual
    pass); Districts-listing and other public pages; search/filtering; SEO
    beyond this one page (sitemap/robots.txt); Excel import.
  - Corrections applied (2026-09-18): the initial pass incorrectly used
    "Ambalam" (the label literally shown in the design mock) as the site
    brand in `SiteHeader`/`SiteFooter`; replaced with the correct product
    name "Where Is My Temple" (`src/components/layout/SiteHeader.tsx`,
    `SiteFooter.tsx`). Also reworked `TempleGallery` from a generic
    responsive grid into a desktop mosaic that matches
    `design/desktop/Temple Page.jpg`'s asymmetric layout — every full group
    of 4 gallery images renders as one tall left image + two uneven images
    top-right + one wide image bottom-right (CSS Grid `grid-template-areas`,
    `TempleGallery.module.css`); any leftover images that don't complete a
    group of 4 fall back to a plain even grid so no images are ever dropped
    or invented. Below a 720px viewport the mosaic collapses to a single
    stacked column (an interim responsive fallback — the real
    `design/mobile/` arrangement is still a later pass). No schema, routing,
    access control, localization, map, R2, or SEO code was touched for this
    correction; re-ran `pnpm lint`, `tsc --noEmit`, `pnpm test:int`,
    `pnpm build` — all pass.

## CMS test data (currently in the dev database)

Per owner instruction, temporary TEST content created while verifying the
Temple Detail Page is being **kept** (not deleted) for ongoing frontend
review — this supersedes the earlier "clean up after verification" pattern
for this specific record set. All content is clearly prefixed `TEST` and
uses placeholder contact info (`*@example.invalid` / `+91-00000-00000`) and
placeholder coordinates, never real temple data:

| Collection | Identifier | Notes |
|---|---|---|
| Districts | slug `test-district-temple-page` | published |
| Temples | slug `test-temple-page-preview` | published; 5 gallery images (4 form the mosaic, 1 is the leftover-grid case), hero image, daily ritual, darshan timing, dress code, important rule, transit point, contact, one social link |

View it at `/temples/test-temple-page-preview` (and `?lang=ml` for the
Malayalam pass, though this record's Malayalam translations were not
filled in — English will show via locale fallback). To remove later:
delete the Temple first (it references the District), then the District,
via Payload Admin or `DELETE /api/temples/<id>` / `DELETE /api/districts/<id>`.

## Not Started

- Public website beyond the Temple detail page (district listing, landing
  page, about/contact pages)
- Search
- Sitewide SEO (sitemap, robots.txt)
- Excel importer
- Production deployment

## CMS verification — test data

A one-off Local API script (`verify-content-model.tmp.ts`, not committed —
created and deleted within the same session) seeded minimal, clearly-marked
TEST content in the local/dev database and exercised every item in
`docs/content-model.md` §13's Definition of Done, plus the ADR-005/ADR-006
access-control rules, against the actual running dev server (not just
Local API bypass). All checks passed. See `docs/decisions.md` for anything
that would change the approved model — nothing did.

What was checked (all passed):

- District → Temple relationship resolves correctly.
- Event → Temple and Event → Temple → District derivation resolve
  correctly (no stored district field on Event).
- Event `status` (past/ongoing/upcoming) derives correctly from
  `startDate`/`endDate`; confirmed no stored `isUpcoming` field.
- Spotlight is independently, manually settable per Event.
- Localized Temple fields (`name`, `historyNarrative`, `dailyRituals[]`,
  `dressCode`, `importantRules[]`) store English and Malayalam separately.
- A field with no Malayalam value (`dressCode.women`) correctly falls back
  to the English value when read with `locale=ml` (current
  `fallback: true` config).
- Unauthenticated reads only ever returned `published` documents; `draft`,
  `review` and `archived` were all confirmed hidden (404) for Districts,
  Temples and Events; unauthenticated create/update/delete all returned
  `403` on Districts, Temples, Events and Media.
- Media read stayed public; unauthenticated Media create returned `403`.
- Admin list and edit screens for Districts/Temples/Events render (`200`)
  for the real seeded record IDs.
- `pnpm generate:types`, `tsc --noEmit`, `pnpm test:int`, `pnpm lint`,
  `pnpm build` all pass with the test data present.
- Extra check (not in the original DoD list, worth recording): a
  **published Event referencing a `draft` Temple does not leak the Temple's
  fields** through `depth`-populated relationships — Payload correctly
  falls back to returning just the Temple's ID for an unauthenticated
  request. Not a bug, but an editorial-workflow note: if a Temple is
  unpublished after its Events go live, those Events lose their populated
  Temple/District context for public readers until the Temple is
  republished. Worth keeping in mind for the eventual publish workflow.

Test records intentionally left in the dev database (all `publicationStatus:
"published"`, clearly named/prefixed, using placeholder contact info
`*@example.invalid` / `+91-00000-00000` and placeholder coordinates
`0, 0` — not real temple data) so they can be inspected in Payload Admin:

| Collection | Identifier | Notes |
|---|---|---|
| Districts | slug `test-district-verification` | name "TEST District — Verification (Do Not Use)" |
| Temples | slug `test-temple-verification` | name "TEST Temple — Verification (Do Not Use)"; 2 daily rituals, 1 transit point, 2 darshan timings, dress code, 2 important rules, contact/social links |
| Events | name "TEST Event — Ongoing (Verification)" | spans today, `spotlight: true` |
| Events | name "TEST Event — Past (Verification)" | fully in the past, `spotlight: false` |

**To remove:** open Payload Admin (`/admin`) and delete, in this order
(Events first, since they reference the Temple): both Events named above,
then the Temple (`test-temple-verification`), then the District
(`test-district-verification`). Equivalently, as an authenticated admin,
`DELETE /api/events/<id>`, `DELETE /api/temples/<id>`,
`DELETE /api/districts/<id>` for each record's ID (visible in its admin
edit-screen URL).