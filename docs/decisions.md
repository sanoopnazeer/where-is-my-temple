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