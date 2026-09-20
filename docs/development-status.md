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

- Public Home Page implemented (2026-09-20), route `src/app/(frontend)/page.tsx`
  (the existing `/` route — the old Payload-starter welcome content it
  replaced is gone). Server-rendered via one `getHomeData()` call
  (`src/app/(frontend)/getHomeData.ts`) that issues exactly three Local API
  queries total — upcoming Events, all published Districts, and all
  published Temples (used to compute a per-district Temple count and
  representative photo in memory) — plus a fourth for the most-recently-
  published Temples, regardless of how many cards are rendered from them
  (no per-card queries). All four use `overrideAccess: false` with no
  `user`, applying the same public `publishedOrAdmin` rule as the REST API.
  `export const revalidate = 60` makes the page ISR-cached rather than
  frozen at build time (Next would otherwise fully prerender it once, since
  it has no request-specific data) or fetched on every single request —
  matching `docs/architecture.md` §14's cache-first guidance.
  - Sections, in design order (`design/desktop/Landing Page.jpg`): hero
    (headline/subtext + a presentational search bar), Upcoming Festivals &
    Events (next 4 Events by `endDate`), a static heritage quote banner,
    Explore by Districts (up to 8 published Districts), Top Visited
    Temples (3 cards), and the shared "List your temple" `ComingSoonCta`.
    Reused `SiteHeader`/`SiteFooter`/`ComingSoonCta` unchanged — no
    duplicate header/footer was created.
  - Components: `src/components/home/` (`HomeHero`, `UpcomingEvents`,
    `HeritageBanner`, `DistrictsGrid`, `FeaturedTemples`), each hiding
    itself entirely when it has no data (same empty-state pattern as the
    Temple page).
  - Small reusable extractions (not Temple-specific behavior changes):
    `src/utilities/site.ts` (`SITE_URL` constant, now shared by the Home
    and Temple pages instead of being duplicated), `src/utilities/richText.ts`
    (`excerpt()`, a plain-text card-preview helper built on Payload's own
    `@payloadcms/richtext-lexical/plaintext` converter — not a hand-rolled
    Lexical walker), and one new icon (`SearchIcon`) added to the existing
    `src/components/icons/TempleIcons.tsx` set.
  - Content-model gaps resolved by owner decision (asked before building,
    not assumed): (1) District has no image/tagline field — each district
    card's photo is borrowed from one published Temple in that district via
    the existing `Temple.district` relationship (no schema change); the
    design's decorative taglines ("Northern Gate", etc.) have no data
    source and are omitted rather than invented. (2) "Top Visited Temples"
    implied view-count analytics that don't exist anywhere in this
    architecture — this section shows the most recently published Temples
    instead (`sort: '-createdAt'`), under the design's original heading.
  - Other assumptions: the hero search bar and "View All Districts"/"Upload
    your temple details" affordances are presentational only (disabled
    input/button, non-interactive label) since search and a districts-
    listing page are both still "Not Started" below — same treatment as
    the Temple page's not-yet-built nav targets; Event cards borrow their
    linked Temple's `heroImage` (Event has no image field) and are not
    links (no event detail route exists yet); Temple cards link to the
    real `/temples/[slug]` route.
  - **(2026-09-20 follow-up)** Hero, heritage-quote, and "List your temple"
    backgrounds replaced with static photos supplied directly as website
    assets under `public/images/home/` (`hero-banner.jpg`,
    `heritage-banner.png`, `list-temple-banner.jpg`) — **not** Payload
    Media, **not** uploaded to R2, no CMS field added, per explicit
    instruction. Rendered via `next/image` `fill` + `object-fit: cover`
    with a dark gradient overlay (in each component's own CSS module) for
    text readability, matching the existing hero/banner layouts unchanged.
    `ComingSoonCta` (`src/components/layout/ComingSoonCta.tsx`, shared by
    the Home and Temple pages) gained a `backgroundImageSrc` prop defaulting
    to `list-temple-banner.jpg`, so the "List your temple" CTA now shows
    this photo on every page it appears on (Home and Temple detail) without
    either call site needing to pass it explicitly. `pnpm lint`,
    `tsc --noEmit`, `pnpm test:int`, `pnpm build` re-run and pass.
  - Verified against the local dev server: `/` returns 200 with the real
    published Temple/District/Event content the owner has been adding via
    Payload Admin; a newly-created **draft** District (`test-district-draft-home-check`,
    left in place, not deleted) does not appear on the Home page; the
    Temple detail page, invalid-slug 404, and unauthenticated-write `403`
    all still work unchanged; a temporary future-dated Event (`TEST Upcoming
    Event — Home Page Preview`, left in place, not deleted) confirmed the
    Upcoming Events section's populated state, including the borrowed
    Temple photo via `next/image`/R2. `pnpm generate:types`, `tsc --noEmit`,
    `pnpm lint` (0 errors, same 5 pre-existing warnings), `pnpm test:int`,
    `pnpm build` all pass.
  - Not done in this task: detailed mobile visual matching against
    `design/mobile/` (a CSS-based review found only `max-width` usage and
    wrapping grids, no fixed pixel widths, so no overflow is expected — not
    a rendered-browser mobile pass); a real districts-listing page; real
    search; sitewide SEO (sitemap/robots.txt).

- Public Districts directory page implemented (2026-09-20), route
  `/districts` (`src/app/(frontend)/districts/page.tsx`) —
  `design/desktop/District wise temples.jpg`. This is a directory of
  **Districts only**; it does not render individual Temple cards or links
  (`design/desktop/District Temple.jpg`, the per-district Temple List page,
  is explicitly out of scope — "implemented separately" per the task brief).
  - **Route for the future per-district Temple List page**: asked the
    owner before building anything, since neither the project nor the
    design established this URL yet. Owner chose `/districts/[slug]`
    (recommended: matches the existing `/temples/[slug]` convention exactly,
    using District's existing `slug` field, `docs/content-model.md` §2).
    Each District card here links to `/districts/<slug>` now, even though
    that route doesn't exist yet (will 404 until built) — that page is a
    separate, not-yet-started task.
  - Data: `src/app/(frontend)/districts/getDistrictsData.ts`, two Local API
    queries total (not one per District, not a full Temple fetch): all
    published Districts, and every published Temple's `district` +
    `heroImage` references only (`select: { district: true, heroImage:
    true }`, no other Temple fields returned) to derive a per-district
    published-Temple count and a representative photo in memory — lighter
    than the Home page's equivalent query, which fetches full Temple
    documents. Both queries use `overrideAccess: false` with no `user`,
    applying the same public `publishedOrAdmin` rule as the REST API, so
    draft/review/archived Temples and Districts are excluded automatically
    (no manual status filtering needed).
  - Component: `src/components/districts/DistrictsDirectory.tsx` — page
    heading/subheading + a grid of District cards, each a `<Link
    href="/districts/<slug>">` wrapping the whole card (not a per-temple
    link, since no Temples are shown here). Uses the same "borrow a
    Temple's photo, no schema change" precedent already approved for the
    Home page's district teaser, since District still has no image field
    (`docs/content-model.md` §2); the design's decorative region tags
    ("SOUTH KERALA", etc.) have no data source and are omitted, same
    reasoning as the Home page's district taglines. Added `BuildingIcon` to
    the existing `src/components/icons/TempleIcons.tsx` set for the Temple
    count.
  - Reused `SiteHeader`/`SiteFooter`/`ComingSoonCta` unchanged; `export
    const revalidate = 60` (ISR), same rationale as the Home page.
  - Required by this task's own user-flow spec, not incidental: SiteHeader's
    "Districts wise Temples" nav item and the Home page's "View All
    Districts" button were previously disabled placeholders (no page to
    link to) — both now link to `/districts`, since the brief explicitly
    states "The Home Page 'View All Districts' action opens this District
    directory page."
  - Verified against the local dev server: `/districts` returns 200 and
    lists exactly the two currently-published Districts ("Kozhikode",
    "TEST District"), each showing an accurate published-Temple count (1
    each); the previously-created draft District
    (`test-district-draft-home-check`) does not appear; no `/temples/*`
    links appear anywhere on the page; the Home page, Temple detail page,
    invalid-slug 404, and unauthenticated-write 403 all still work
    unchanged. `pnpm generate:types` (no diff — confirms no schema change),
    `tsc --noEmit`, `pnpm lint` (0 errors, same 5 pre-existing warnings),
    `pnpm test:int`, `pnpm build` all pass (`/districts` builds as ISR,
    matching `/`).
  - Not done in this task: the per-district Temple List page at
    `/districts/[slug]` itself (separate task, per the brief); a rendered-
    browser mobile pass (same Playwright-binary limitation as prior tasks —
    substituted a CSS-based review, which found only `max-width`/media-query
    usage and no fixed pixel widths in the new files).

- District-specific Temple List page implemented (2026-09-20), route
  `/districts/[slug]` (`src/app/(frontend)/districts/[slug]/page.tsx`) —
  `design/desktop/District Temple.jpg`. Reuses the exact route convention
  the Districts directory page already established (`district.slug`), so
  Directory cards' existing `/districts/<slug>` links now resolve to a real
  page instead of a placeholder 404.
  - **Route decision**: none needed — the Districts directory task (just
    before this one) already asked the owner and settled on
    `/districts/[slug]`; this task reused it as instructed, no second
    routing decision was made.
  - Data: `src/app/(frontend)/districts/[slug]/getDistrictTemples.ts` — 2–3
    Local API queries per request (not one per Temple card): `getDistrictBySlug`
    (District lookup, wrapped in React `cache()` so `generateMetadata` and
    the page share one call), `getDistrictTemples` (published Temples
    `where: { district: { equals } }`, server-side paged via Payload's own
    `page`/`limit`, 8 per page), and `getDistrictHeroImage` (a `select`-narrowed,
    single-field query for one representative Temple photo, independent of
    the current page so the hero image doesn't change as you paginate). All
    three use `overrideAccess: false` with no `user`, so the public
    `publishedOrAdmin` rule excludes draft/review/archived Temples and
    excludes an unpublished District automatically — no manual status
    filtering needed, access control isn't bypassed. An out-of-range
    `?page=` (e.g. a stale link) re-fetches at the last real page instead of
    showing a false empty state — only in that edge case, not on normal
    requests.
  - Components: `src/components/districts/DistrictHero.tsx` (district name,
    a static "Kerala, India" label, the same presentational/disabled search
    bar pattern as the Home hero) and `DistrictTempleList.tsx` (the Temple
    list, empty state, and page-number pagination). Reused
    `SiteHeader`/`SiteFooter`/`ComingSoonCta` unchanged, and the existing
    `excerpt()` utility (already used by the Home page's Featured Temples)
    for each card's description line. Pagination is plain `<Link
    href="?page=N">`s — no client-side fetching, matching the design's
    numbered-pages layout exactly.
  - This route is naturally **dynamic** (`ƒ`), not ISR like the Home/
    Districts-directory pages — reading `searchParams` for `?page=` forces
    per-request rendering in Next.js, so no `revalidate` export was needed;
    every request already resolves fresh data.
  - Content-model gaps resolved by owner decision (asked before building,
    not assumed): (1) the design's bold "Main Deity: ..." line has no field
    anywhere in the Temple content model (`historyNarrative` is free-text
    richText, not structured deity data) — omitted entirely rather than
    invented; the card's description line is a real `historyNarrative`
    excerpt instead. (2) the design's district-hero paragraph made specific
    unverified claims about each district (e.g. "Known as the Cultural
    Capital of Kerala...") with no data source (District has no description
    field) — omitted; the hero shows only the district name and a generic
    "Kerala, India" label.
  - Other assumptions: the design's category badges ("ANCIENT", "POPULAR",
    etc.) and small icon badges have no backing field and are omitted, same
    reasoning as the Districts directory page's omitted region tags; the
    design's sidebar ("Most Visited", "Upcoming Festivals") was not part of
    this task's own functional description (which scoped the page to the
    Temple list itself) and was not built — happy to take on as a separate,
    explicitly-scoped task if wanted; the hero photo is borrowed from one of
    the district's Temples, same precedent as the Districts directory page.
  - Verified against the local dev server: both currently-published
    Districts ("Kozhikode", "TEST District") each show only their own
    Temple(s) — no cross-district leakage — linking correctly to
    `/temples/<slug>`; a nonexistent district slug 404s; the draft District
    from the Home page task (`test-district-draft-home-check`) 404s (not
    publicly accessible); a temporary published District with zero Temples
    (`test-district-zero-temples`, created via the Local API for this
    verification and left in place, not deleted, per standing instruction)
    renders the clean empty state instead of an error or false 404; an
    out-of-range `?page=99` on a 1-page district still returns 200 via the
    fallback above; the Home page, Districts directory, Temple detail page,
    and unauthenticated-write 403 all still work unchanged.
    `pnpm generate:types` (no diff), `tsc --noEmit`, `pnpm lint` (0 errors,
    same 5 pre-existing warnings), `pnpm test:int`, `pnpm build` all pass.
  - Not done in this task: the "Most Visited"/"Upcoming Festivals" sidebar
    shown in the design (see assumptions above — **Upcoming Festivals was
    added in a follow-up task below; Most Visited remains intentionally
    unbuilt**); a rendered-browser mobile pass (same Playwright-binary
    limitation as prior tasks — substituted a CSS-based review, which found
    only `max-width`/media-query/flex-basis usage, no fixed pixel widths, in
    the new files).

- District Temple List page updated (2026-09-20) with a District
  `description` field and an "Upcoming Festivals" sidebar.
  - **Schema change**: added `description` (`textarea`, optional, not
    localized) to the Districts collection (`src/collections/Districts.ts`),
    per explicit owner instruction — documented in
    `docs/content-model.md` §2. No other field was added or changed;
    `pnpm generate:types` diff touched only this one field
    (`District.description?: string | null`), confirming no unintended
    schema drift. Shown in `DistrictHero` directly below the district name
    when populated; renders nothing (no empty block) when absent — no
    invented fallback text. Also used, when present, as the page's SEO
    `description`/OG description in place of the previous generic sentence.
  - **Upcoming Festivals sidebar**: Events don't store a District
    (`docs/content-model.md` §4.1 — derived via Event → Temple → District,
    by design, not a gap); `getDistrictTemplesMeta()`
    (`src/app/(frontend)/districts/[slug]/getDistrictTemples.ts`) already
    collects every published Temple ID in the district for the hero-image
    lookup, so `getUpcomingFestivals(templeIds)` reuses that same ID list to
    query `events` with `where: { temple: { in: templeIds }, startDate: {
    greater_than: now } }, sort: 'startDate'` — one query, not one per Event
    or per Temple. `overrideAccess: false` (same public `publishedOrAdmin`
    rule) excludes draft/review/archived Events automatically; because
    `templeIds` itself only ever contains published Temples, an Event
    linked to a non-public Temple can never match the `in` filter, so no
    private Temple data can leak through this path. "Upcoming" is expressed
    as `startDate: { greater_than: now }` — the same condition the Events
    collection's own virtual `status` field (`src/collections/Events.ts`)
    already uses for its `'upcoming'` value, reused rather than
    reimplemented differently (virtual fields aren't queryable, so this is
    the DB-query form of that same rule, not a second definition). No
    `isUpcoming` field was added.
  - Component: `src/components/districts/UpcomingFestivalsSidebar.tsx` (+
    `.module.css`) — heading, one card per festival (day-of-month badge,
    name, formatted date, a real excerpt of the Event's own `description`
    via the existing `excerpt()` utility), hides itself entirely when there
    are no upcoming festivals. Non-interactive (no link) — there is no
    public Event Detail route, and the design doesn't present these items
    as clickable (no "View Details"-style affordance, unlike the Temple
    cards next to them) — per the task brief, no new route was invented.
    Added `CalendarIcon` to the existing
    `src/components/icons/TempleIcons.tsx` set for the heading.
  - **Most Visited is intentionally not implemented** — explicit owner
    instruction to leave it out entirely rather than show placeholder data
    (it would need view-count analytics that don't exist in this
    architecture, same gap already resolved elsewhere in this project by
    omission).
  - Layout: `page.tsx` now wraps `DistrictTempleList` and
    `UpcomingFestivalsSidebar` in a two-column CSS Grid (`.contentGrid` in
    `page.module.css`), collapsing to one column at `max-width: 900px`.
    `DistrictTempleList.module.css`'s `.section` had its own
    `max-width`/centering/side-padding removed in favor of the shared grid
    wrapper — a layout-only change; its rendering logic, pagination, and
    data are unchanged. `DistrictHero`, the Districts directory page, the
    Home page, Temple schema, Event schema (aside from the new query, no
    field changes), access control, R2, and the Google Maps integration
    were **not** touched.
  - Verified against the local dev server, using the two real published
    Events already in the CMS from a prior task (`TEST Upcoming Event —
    Home Page Preview`, 2026-10-04, and `Vishu Festival`, 2027-05-01, both
    linked to a Kozhikode temple) plus three new temporary records created
    via the Local API for this verification and left in place, not deleted,
    per standing instruction (a `description` value on the existing `TEST
    District` record; a `TEST Past Event — Verification` dated 2020 on a
    Kozhikode temple; both used solely to test the negative cases below):
    the description renders below the district name on `TEST District` and
    is absent (no empty element) on `Kozhikode`, which has none; Kozhikode's
    sidebar shows both real upcoming festivals sorted nearest-first
    (Oct 2026 before May 2027); `TEST District` (a different district, zero
    events of its own) shows no festivals — confirming cross-district
    exclusion; the 2020 past Event never appears; "Most Visited" text
    appears on neither page; existing pagination (including the
    out-of-range `?page=` fallback), the Districts directory, the Temple
    detail page, and unauthenticated-write `403` all still work unchanged.
    `pnpm generate:types` (diff limited to the one new field),
    `tsc --noEmit`, `pnpm lint` (0 errors, same 5 pre-existing warnings),
    `pnpm test:int`, `pnpm build` all pass. No new npm dependency was added
    (`package.json`/`pnpm-lock.yaml` unchanged).
  - Not done in this task: the "Most Visited" sidebar (explicitly excluded,
    see above); a rendered-browser mobile pass (same Playwright-binary
    limitation as prior tasks).

- Contact page implemented (2026-09-20), route `/contact`
  (`src/app/(frontend)/contact/page.tsx`) — `design/desktop/Contact us.jpg`.
  Fully static (no CMS query — everything on this page is either static
  copy or the hardcoded contact details below), so it builds as prerendered
  static content (`○`), same as `/`.
  - Sections, in design order: hero ("Connect with Where Is My Temple" —
    "Ambalam" replaced per the standing branding rule, CLAUDE.md §1/prior
    task), a "Send us a Message" form, a "Frequently Asked Questions"
    accordion, a "Heritage Headquarters" contact card, a "Preserving
    Sanctity" quote block, a "Follow Our Journey" social row, and the
    shared "List your temple" `ComingSoonCta`. Reused
    `SiteHeader`/`SiteFooter`/`ComingSoonCta` unchanged.
  - Components: `src/components/contact/` (`ContactHero`, `ContactForm`,
    `FaqSection`, `ContactSidebar`). `FaqSection` is the only Client
    Component on this page (a small `useState` expand/collapse for 3 FAQ
    items — no data fetching); everything else is a Server Component.
    Added `MailIcon`, `PhoneIcon`, `ChevronDownIcon`, `ShareIcon`,
    `CameraIcon`, `LinkIcon` to the existing
    `src/components/icons/TempleIcons.tsx` set.
  - **Real contact details, asked and provided by the owner before
    building** (the design's office address/email/phone were placeholder
    mockup values — CLAUDE.md §7/§8 forbid inventing factual contact
    info): Office — "Hilite Business Park, Kozhikode, Kerala"; Email —
    `contact@whereismytemple.com` (real `mailto:` link); Phone —
    `+91 9746105647` (real `tel:` link). Hardcoded as constants in
    `ContactSidebar.tsx`, the same pattern as the existing `SITE_URL`
    constant — there is no site-wide contact-info collection/field in the
    content model, and none was added (no schema change).
  - **No functional form/backend was built**, per the task's explicit
    instruction: no email service, API route, or new collection exists for
    contact submissions. `ContactForm` renders every field and the submit
    button `disabled`, with an explicit "Coming Soon" badge — the same
    non-functional pattern already used for the search bars and the
    newsletter form (`SiteFooter`), with the extra badge because a
    non-functional *form* could otherwise mislead a visitor into thinking a
    message was actually sent (unlike a disabled search box, where nothing
    is lost).
  - **FAQ answers**: the design shows the three questions collapsed with no
    answer text visible anywhere, and there's no CMS-backed FAQ content —
    each answer honestly renders "Answer coming soon" rather than inventing
    factual claims about temple rules, timings, or visitor access.
  - **"Follow Our Journey" social icons**: rendered as non-interactive
    (`aria-disabled`, no `href`) — there are no confirmed real social
    profile URLs to link to, and CLAUDE.md §7 forbids inventing them.
  - **"Preserving Sanctity" quote / "Heritage Archives" attribution**: kept
    as static decorative copy, the same treatment already established for
    the Home page's Heritage Banner quote — not presented as a claim about
    a real, named source.
  - **Heritage Headquarters photo panel**: the design's gray box has no
    real office photo behind it in the content model; rather than borrow an
    unrelated Temple photo (which would misrepresent it as a photo of the
    office — a different situation from District cards, where the borrowed
    photo genuinely depicts something in that district), it stays a plain
    decorative panel with a pin icon.
  - `SiteHeader`'s "Contact" nav item, previously a disabled placeholder,
    now links to `/contact` (same treatment as "Districts wise Temples" in
    an earlier task). "About Us" remains disabled — still no page for it.
  - Verified against the local dev server: `/contact` returns 200 with the
    real office address/email/phone (correct `mailto:`/`tel:` hrefs), zero
    "Ambalam" occurrences anywhere on the page, the "Coming Soon" badge and
    disabled fields on the form, all three FAQ questions present, and the
    header's Contact link resolving correctly; Home, Districts directory,
    the District Temple List page, and the Temple detail page all still
    return 200. `tsc --noEmit`, `pnpm lint` (0 errors, same 5 pre-existing
    warnings), `pnpm test:int`, `pnpm build` all pass (`/contact` builds
    static). No new npm dependency was added; no schema/collection change
    (`pnpm generate:types` wasn't needed — nothing in this task touched
    Payload collections).
  - Not done in this task: a real contact-form backend/email service; real
    FAQ answer content; real social media URLs; a rendered-browser mobile
    pass (same Playwright-binary limitation as prior tasks — a CSS-based
    review found only `max-width`/media-query usage, no fixed pixel widths,
    in the new files).

- About Us page implemented (2026-09-20), route `/about`
  (`src/app/(frontend)/about/page.tsx`) — `design/desktop/About us.jpg`.
  Fully static (no CMS query — every section is static copy or a reused
  static image asset), builds as prerendered content (`○`), same as `/`
  and `/contact`.
  - **Content decision — asked before writing anything**: this design is
    almost entirely organizational narrative copy (an origin story, mission
    statement, and specific program claims — restoration projects, "Vastu
    expert" partnerships, educational festivals) that isn't confirmed fact
    about this project (CLAUDE.md §4 scopes V1 to a temple directory/info
    site) and CLAUDE.md §7 / this task's own brief both explicitly forbid
    inventing mission statements, history, or program claims. Asked the
    owner how to handle it; **decision: publish the design's copy
    verbatim**, replacing only the brand name ("Ambalam" → "Where Is My
    Temple") — not the minimal/generic-copy default that was offered as
    the recommended option. One exception made unilaterally: the design's
    CTA button read "Support the Us" (an evident typo), corrected to
    "Support Us" — publishing an obvious typo verbatim wasn't treated as
    part of "the copy" the owner was deciding on.
  - Sections, in design order: hero ("Preserving the Spiritual Architecture
    of Kerala"), "Guardian of Sacred Legacies" intro, "Mission & Core
    Values" (Our Mission / Authenticity / Preservation cards), an
    "Accessibility" band, a closing "A Living Sanctuary of Knowledge" quote
    band with a non-functional "Support Us" CTA, and the shared "List your
    temple" `ComingSoonCta`. Reused `SiteHeader`/`SiteFooter`/`ComingSoonCta`
    unchanged.
  - Components: `src/components/about/` (`AboutHero`, `AboutIntro`,
    `MissionValues`, `AccessibilityBand`, `SanctuaryBand`) — all Server
    Components, no client JS on this page at all. Added `ShieldCheckIcon`,
    `SparkleIcon`, `EyeIcon`, `LeafIcon` to the existing
    `src/components/icons/TempleIcons.tsx` set (`BuildingIcon`, already
    existing, was reused for "Our Mission").
  - **Images**: the hero background reuses the existing static asset
    `public/images/home/hero-banner.jpg` (already used on the Home hero) —
    no new asset added, nothing uploaded to R2, no new CMS field. The
    design's small "Our Mission" photo strip and the "Accessibility"
    band's right-side image (a screenshot of a website mockup in the
    original design — not a real photo the project has) both stay plain
    decorative panels rather than substituting an unrelated Temple photo,
    which would misrepresent it — same reasoning as the Contact page's
    Heritage Headquarters photo panel decision.
  - **"Support Us" CTA**: no donation/support backend exists or was
    created; the button is non-functional (`aria-disabled`) with a "Coming
    Soon" badge, the same treatment as the "List your temple" CTA.
  - `SiteHeader`'s "About Us" nav item and the footer's "About Us" Quick
    Link, both previously disabled placeholders, now link to `/about`
    (same treatment "Districts wise Temples" and "Contact" got in earlier
    tasks). All four header nav items now have real pages; the footer's
    "Temple Directory" and "Cultural Festivals" links remain inactive —
    not part of this task, no confirmed matching route for either.
  - Verified against the local dev server: `/about` returns 200, zero
    "Ambalam" occurrences, "Where Is My Temple Heritage Trust" appears
    correctly, the CTA reads "Support Us" (not the design's typo) with its
    "Coming Soon" badge, all Mission & Core Values / Accessibility copy
    renders; the header and footer "About Us" links both resolve to
    `/about`; Home, Districts directory, the District Temple List page,
    the Temple detail page, and the Contact page all still return 200.
    `tsc --noEmit`, `pnpm lint` (0 errors, same 5 pre-existing warnings),
    `pnpm test:int`, `pnpm build` all pass (`/about` builds static). No new
    npm dependency was added; no schema/collection change.
  - Not done in this task: a rendered-browser mobile pass (same
    Playwright-binary limitation as prior tasks — a CSS-based review found
    only `max-width`/media-query usage, no fixed pixel widths, in the new
    files).

- Events & Festivals page implemented (2026-09-20), route `/events`
  (`src/app/(frontend)/events/page.tsx`) —
  `design/desktop/Events & Festivals.jpg`. Uses the existing Events
  collection only; no schema change (`pnpm generate:types` diff confirmed
  empty). ISR (`revalidate = 60`), same rationale as Home/Districts.
  - **Per explicit owner instruction, this page is not linked from
    `SiteHeader`** — the shared nav stays exactly as it was before this
    task (unlike the Districts/Contact/About pages in earlier tasks, which
    did get nav entries). The route exists and works; it's just not
    surfaced in the global nav yet.
  - **Two things omitted outright, not asked about** — both explicitly
    ruled out already, not genuinely ambiguous: the design's header
    user-account avatar icon (public user accounts are a deferred feature,
    CLAUDE.md §6) and the hero's "Malayalam Era 1199 / Medam–Edavam Season"
    widget plus the spotlight card's "(Medam - Edavam)" date annotation
    (CLAUDE.md §4 explicitly excludes Malayalam-calendar conversion from
    V1).
  - **Asked before building — event card links**: the design gives every
    card a differently-labeled link ("View Guide", "Virtual Queue", "Route
    Map", "Event Details", "Darshan Info"), implying several features that
    don't exist (no Event Detail route, no queue system, no route-map
    feature). Owner chose: every card links to its Event's linked Temple's
    real page (`/temples/[slug]`), labeled consistently "View Temple" —
    no new route created.
  - Sections, in design order: hero (static copy, no CMS/no search box —
    none was shown in this design, unlike Home/Contact/District), a
    "Spotlight Celebration" for the Event `spotlight` field (existing
    field — no new ranking/popularity mechanism), an "Upcoming Temple
    Utsavams" grid, and the shared "List your temple" `ComingSoonCta`. No
    pagination or filter/search UI was built — neither appears in this
    design (the grid's repeated cards in the mockup are a Figma placeholder
    artifact, not real pagination).
  - Data: `src/app/(frontend)/events/getEventsData.ts`, two Local API
    queries total (not one per card): the spotlighted Event (`spotlight:
    true`, `endDate` not yet passed) and the next batch of upcoming Events
    (`startDate: { greater_than: now }`, `sort: 'startDate'`, `depth: 2` so
    `temple.district` resolves). Both `overrideAccess: false`, so
    draft/review/archived Events are excluded automatically — same public
    `publishedOrAdmin` rule as the REST API. "Upcoming" reuses the exact
    condition the Event collection's own virtual `status` field already
    uses for `'upcoming'` (virtual fields aren't queryable, so this is the
    DB-query form of that rule, not a second definition) — no `isUpcoming`
    field added. District is never stored on Event; every District shown
    on this page is read from the populated `temple.district`
    (`docs/content-model.md` §4.1).
  - **Private-Temple defense in depth**: because Payload's relationship
    population inside `find` wasn't assumed to enforce the same access
    check a direct `find` would, every Event is re-checked in memory after
    fetching — `hasPublicTemple()` in `getEventsData.ts` drops any Event
    whose linked Temple isn't a populated, `published` document, before it
    ever reaches a component. This is the only path any Temple-derived data
    (name, locality, District) reaches this page.
  - Components: `src/components/events/` (`EventsHero`, `SpotlightEvent`,
    `EventsGrid`), all Server Components, no client JS on this page.
    `src/utilities/eventDate.ts` (new): `formatEventDateRange()` and
    `eventDurationLabel()` — both computed directly from the real stored
    `startDate`/`endDate`, not invented durations (the design's per-event
    duration phrases like "36-Hour Continuous Ritual" or "41-Day Vratham"
    have no backing field and aren't reproducible from day-only dates, so
    they're replaced with a generic computed "N-Day Event" instead).
    Reused `SiteHeader`/`SiteFooter`/`ComingSoonCta`/`PinIcon`/`excerpt()`/
    `resolveMediaUrl()` unchanged.
  - **Card category badges/pills**: the design's per-card labels ("MAJOR
    FESTIVAL", "WORLD RECORD GATHERING", "Palakkad District", etc.) have no
    dedicated field — they're rendered from the Event's own `keywords`
    array (real editor-entered tags, existing field), the first keyword as
    the prominent image badge and the rest as pills. Not a new taxonomy.
  - **Location**: the design shows some events spanning multiple
    temples/"Statewide" claims, which the schema doesn't support (an Event
    belongs to exactly one Temple, `docs/content-model.md` §4). Each card
    shows that Event's one real linked Temple's name plus its District.
  - Verified against the local dev server, using the two real published
    upcoming Events already in the CMS (`TEST Upcoming Event — Home Page
    Preview`, `Vishu Festival`, both linked to a Kozhikode temple) plus one
    new temporary spotlighted Event created via the Local API for this
    verification and left in place, not deleted, per standing instruction
    (`TEST Spotlight Event — Verification`): the spotlight section renders
    only when a qualifying spotlighted Event exists, correctly excluded
    from the grid below it; the grid shows both real upcoming Events with
    correctly derived District ("Tali Shiva Temple, Kozhikode"), correct
    keyword-derived badges/pills, and a correctly computed date range/day
    count; a 2020-dated past Event (from an earlier task, still in the CMS)
    never appears; every card's "View Temple" link resolves to the real
    Temple page; unauthenticated `POST /api/events` still returns `403`;
    the shared header was not modified (no `/events` link was added, per
    instruction); Home, About, Districts directory, the District Temple
    List page, the Temple detail page, and the Contact page all still
    return 200. `pnpm generate:types` (no diff), `tsc --noEmit`,
    `pnpm lint` (0 errors, same 5 pre-existing warnings), `pnpm test:int`,
    `pnpm build` all pass (`/events` builds as ISR, matching `/`). No new
    npm dependency was added.
  - Not done in this task: linking this page from the shared nav (per
    instruction); a real Event Detail page; filtering/search (not present
    in this design); a rendered-browser mobile pass (same Playwright-binary
    limitation as prior tasks — a CSS-based review found only
    `max-width`/media-query usage, no fixed pixel widths, in the new files).

## Not Started

- Public website beyond the Home, Temple detail, Districts directory,
  District Temple List, Contact, About Us, and Events & Festivals pages
  (the Events page isn't linked from the shared nav yet, per instruction)
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