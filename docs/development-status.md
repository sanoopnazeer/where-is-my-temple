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

## Not Started

- R2 integration
- Public website
- Search
- SEO
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