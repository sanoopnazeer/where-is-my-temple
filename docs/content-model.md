# Where Is My Temple — Payload Collection Specification v0.2
## V1 Implementation Specification

**Project:** Where Is My Temple  
**Domain:** `whereismytemple.com`  
**Status:** Approved for V1 implementation  
**Version:** 0.2

> This document is the implementation source of truth for the V1 Payload content model. Do not add requirements not defined here. When unclear, ask the owner.

---

## 1. V1 Collections

```text
Users       existing
Media       existing
Districts   new
Temples     new
Events      new
```

### Explicitly not separate collections in V1

- Rituals — daily rituals are structured inside Temple.
- Deities — no confirmed need for a reusable Deity collection yet.
- Keywords — simple Event keyword/tag values only.

---

# 2. Districts

### Purpose

Reusable Kerala district reference data.

### Fields

| Field | Payload type | Required | Localized | Notes |
|---|---|---:|---:|---|
| `name` | text | Yes | No | English district name |
| `slug` | text | Yes | No | Stable public identifier |
| `description` | textarea | No | No | Editorial description shown on the district page hero. English only for V1. Added once the district page design required it (2026-09-20). |
| `publicationStatus` | select | Yes | No | `draft` / `review` / `published` / `archived` — same model as Temple (§3.13). Public read requires `published`. |

V1 Malayalam localization is limited to the confirmed Temple-page fields. District names remain English-only for now.
Do not add further descriptions/images/SEO fields beyond `description` unless required by the final district page design.

# 3. Temples

## 3.1 Identity

| Field | Type | Required | Localized | Notes |
|---|---|---:|---:|---|
| `name` | localized text | Yes | Yes | English + Malayalam |
| `slug` | text | Yes | No | Stable public URL identifier |

The public Temple page displays one selected language at a time.

---

## 3.2 Location

| Field | Type | Required | Notes |
|---|---|---:|---|
| `district` | relationship → District | Yes | One District |
| `locality` | text | No | Local place/area; keep optional if reliable data is unavailable |
| `taluk` | text | No | Optional |
| `address` | textarea/rich text | Yes | Full address |
| `latitude` | number | Yes | Decimal latitude |
| `longitude` | number | Yes | Decimal longitude |

The coordinates power the V1 map marker.

Do not store a map iframe as the source of truth.

---

## 3.3 History / Narrative

| Field | Type | Required | Localized |
|---|---|---:|---:|
| `historyNarrative` | localized rich text | Yes | Yes |

English and Malayalam versions are maintained separately.

---

## 3.4 Daily Rituals

Daily rituals are a **repeatable structured array inside Temple**, not a separate collection.

### Ritual fields

| Field | Type | Required | Localized |
|---|---|---:|---:|
| `name` | localized text | Yes | Yes |
| `description` | localized rich text/text | Yes | Yes |
| `startTime` | time/text | Yes | No |
| `endTime` | time/text | No | No |

The exact Payload field type for time should follow Payload's current capabilities and the application's existing conventions. Store consistent time values; do not store arbitrary display strings if a structured time representation is practical.

Example conceptual data:

```text
Nirmalyam Darshan
05:00
05:30
```

---

## 3.5 Media

### Hero image

| Field | Type | Required | Notes |
|---|---|---:|---|
| `heroImage` | relationship → Media | No | One image; public UI should have an approved fallback when absent |

### Gallery

| Field | Type | Required | Notes |
|---|---|---:|---|
| `gallery` | relationship → Media, many | No | Multiple images |

Actual image binaries are stored outside MongoDB; planned storage is Cloudflare R2.

---

## 3.6 Plan Your Visit

| Field | Type | Required | Localized | Notes |
|---|---|---:|---:|---|
| `howToReach` | rich text/text | No | No | English only in V1 |

Do not create route-specific fields such as `fromKozhikode`, `fromKannur`, etc.

---

## 3.7 Transit Points

Repeatable array.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `type` | select/text | Yes | Example: railway, bus, airport |
| `name` | text | Yes | Transit point name |
| `distance` | number | Yes | Numeric value |
| `unit` | select | Yes | `m`, `km` |

Example:

```text
Railway | Guruvayur Railway Station | 1 | km
Bus     | KSRTC Bus Stand          | 500 | m
```

---

## 3.8 Darshan Timings

Repeatable array.

| Field | Type | Required | Notes |
|---|---|---:|---|
| `label` | text | Yes | Example: Morning Darshan |
| `openTime` | time/text | Yes | Opening time |
| `closeTime` | time/text | Yes | Closing time |

Avoid hardcoding fixed concepts like only morning/evening into the schema.

---

## 3.9 Dress Code

Localized group.

| Field | Type | Required | Localized |
|---|---|---:|---:|
| `men` | localized rich text/text | No | Yes |
| `women` | localized rich text/text | No | Yes |

Only one language is displayed publicly at a time.

---

## 3.10 Important Rules

Repeatable localized array.

| Field | Type | Required | Localized |
|---|---|---:|---:|
| `rule` | localized rich text/text | Yes | Yes |

Do not create fixed fields like `rule1`, `rule2`, `rule3`.

---

## 3.11 Contact

Optional fields:

| Field | Type |
|---|---|
| `phone` | text |
| `email` | email/text |
| `whatsapp` | text |
| `website` | URL/text |

---

## 3.12 Social Links

Optional:

| Field | Type |
|---|---|
| `instagram` | URL/text |
| `facebook` | URL/text |
| `youtube` | URL/text |

---

## 3.13 Editorial / Verification

| Field | Type | Required | Notes |
|---|---|---:|---|
| `publicationStatus` | select | Yes | draft/review/published/archived as approved |
| `verificationStatus` | select | Yes | verified/unverified or equivalent |
| `sourceType` | select/text | No | Provenance |
| `sourceUrl` | URL/text | No | Source reference |
| `lastVerifiedAt` | date | No | Last verification |
| `verifiedBy` | text/user relationship | No | Implementation choice may depend on workflow |

Do not merge publication status and verification status.

---

## 3.14 SEO

Support page-level SEO fields where required by the public site.

At minimum the model should allow:

- SEO title override
- Meta description
- Social/share image where needed

Do not add unnecessary SEO fields without a UI/use case.

---

# 4. Events

Events are first-class CMS records.

## Fields

| Field | Payload type | Required | Localized | Notes |
|---|---|---:|---:|---|
| `name` | text | Yes | No | Event/festival name |
| `description` | rich text/text | Yes | No | Event details |
| `temple` | relationship → Temple | Yes | No | Exactly one Temple |
| `keyRitual` | text | No | No | Highlighted ritual |
| `startDate` | date | Yes | No | Date-only concept |
| `endDate` | date | Yes | No | Date-only concept |
| `keywords` | array of text/tag values | No | No | Examples below |
| `featured` / `spotlight` | checkbox/select | Yes | No | Manual editorial selection |
| `publicationStatus` | select | Yes | No | `draft` / `review` / `published` / `archived` — same model as Temple (§3.13). Public read requires `published`. |

### Example keywords

```text
pongala offering
medam 1
panchavadyam
elephant procession
```

Do not create a separate Keyword collection in V1.

---

## 4.1 Event District

Do **not** add an Event district field.

District is derived through:

```text
Event → Temple → District
```

This avoids inconsistent duplicated data.

---

## 4.2 Event status

Do **not** store an `isUpcoming` field or manually maintained event status.

Calculate at runtime:

```text
endDate < today
→ Past

startDate <= today <= endDate
→ Ongoing

startDate > today
→ Upcoming
```

This powers automatic upcoming-event sections.

---

## 4.3 Event spotlight

The internal team manually selects the Spotlight/Featured event.

Normal upcoming-event ordering is date-driven.

Spotlight selection is editorial and independent of the automatic upcoming calculation.

---

# 5. Localization Rules

V1 bilingual fields are:

```text
Temple.name
Temple.historyNarrative
Temple.dailyRituals[].name
Temple.dailyRituals[].description
Temple.dressCode.men
Temple.dressCode.women
Temple.importantRules[].rule
```

English-only Temple field:

```text
Temple.howToReach
```

The public UI shows either English or Malayalam, never both simultaneously.

The same canonical Temple URL is used in V1.

Separate Malayalam URLs are deferred.

---

# 6. Relationship Diagram

Relationships:

- Temple → exactly one District
- Temple → many Daily Ritual entries (embedded/repeatable)
- Temple → Media (hero and gallery)
- Event → exactly one Temple
- Event → District is derived through Event → Temple → District

---

# 7. Media / R2 Boundary

The Payload Media collection holds application/media metadata.

Cloudflare R2 holds the binary image objects.

Do not store large temple photographs directly in MongoDB.

The R2 integration is a separate implementation step after the basic collections are verified.

---

# 8. Validation Expectations

At minimum:

### District

- English name required
- unique slug

### Temple

- English + Malayalam name required
- district required
- latitude/longitude required
- valid coordinate ranges
- slug required and stable
- localized fields must support both languages where marked required
- start time should be valid when ritual exists
- gallery references must point to valid Media records

### Event

- name required
- exactly one Temple required
- start date required
- end date required
- end date must not be before start date
- keywords are optional
- spotlight is manually controlled

Do not invent additional business rules beyond the approved product requirements.

---

# 9. Indexing / Query Considerations

After collections are implemented, add only indexes justified by actual V1 queries.

Expected important lookup dimensions include:

- Temple slug
- Temple district
- Event temple
- Event start/end dates
- Event keywords if supported efficiently

The public site should not perform an N+1 query pattern for Temple/Event listings.

---

# 10. Payload Implementation Rules

Claude must:

1. Read `CLAUDE.md`.
2. Read `docs/architecture.md`.
3. Read this specification.
4. Inspect the existing generated Payload project.
5. Preserve the existing Users collection.
6. Preserve Media until the R2 integration phase.
7. Implement only Districts, Temples and Events in the first collection task.
8. Generate/update Payload types and import map as needed.
9. Run lint, typecheck/tests/build.
10. Update documentation and development status.
11. Avoid unrelated frontend work.

Claude must not:

- create a Ritual collection
- create a Deity collection
- create a Keyword collection
- add Event district storage
- add `isUpcoming`
- build authority accounts
- build public submissions
- configure R2 during the first collection task
- redesign the public frontend during the first collection task

---

# 11. Excel Import Mapping — Initial Direction

Temple spreadsheet core columns should eventually include:

```text
name_en
name_ml
slug
district
locality
taluk
address
latitude
longitude
history_en
history_ml
how_to_reach
phone
email
whatsapp
website
instagram
facebook
youtube
```

Event spreadsheet core columns:

```text
event_name
description
temple
key_ritual
start_date
end_date
keywords
featured
```

Repeatable Temple structures such as rituals, rules and transit points should be represented in a dedicated import strategy rather than cramming multiple records into arbitrary text columns.

The exact final workbook format should be implemented after the Payload fields are created and tested.

---

# 12. Deferred V1+ Changes

Do not implement yet:

- annual event recurrence
- Malayalam calendar date conversion
- standalone ritual pages
- nearby temples
- public submissions
- temple authority accounts
- public user accounts
- comments/reviews
- dedicated search service
- Redis
- complex moderation
- advanced recommendation engine

---

# 13. Definition of Done — Collection Layer

The collection implementation is considered complete when:

- Districts works in Payload Admin.
- Temples works in Payload Admin.
- Events works in Payload Admin.
- Temple → District relationship works.
- Event → Temple relationship works.
- Event → District can be derived through Temple.
- Localized Temple fields accept English and Malayalam.
- V1 public language switch requirement can be supported without duplicating records.
- Daily rituals are repeatable.
- Transit points are repeatable.
- Darshan timings are repeatable.
- Important rules are repeatable and localized.
- Event start/end dates validate correctly.
- Event state can be derived from dates.
- Spotlight is manually selectable.
- Existing Users collection still works.
- Existing Media collection still works.
- Generated types/build/lint/tests pass.
- Documentation is updated.

---

# 14. Access Control

Districts, Temples and Events share one publication-state concept: the
`publicationStatus` select field (`draft` / `review` / `published` /
`archived`), already defined for Temple in §3.13 and now also present on
District (§2) and Event (§4).

Rules:

- Public (unauthenticated) read: only documents where `publicationStatus`
  equals `published`. Draft/review/archived documents are never returned
  to public requests.
- Authenticated Payload users: full read (including draft/review/archived)
  and full create/update/delete.
- No public create/update/delete on any collection.
- Media: read stays public (Media has no publication-state concept);
  create/update/delete require an authenticated Payload user.
- No role-based access control in V1 — any authenticated Payload user is
  treated as an admin, matching the single-admin-user model.

This is implemented with Payload's native access-control functions, not
Payload's separate versions/drafts (`_status`) system — the two are not
used together. See `src/access/isAdmin.ts`, `src/access/publishedOrAdmin.ts`
and `src/fields/publicationStatus.ts`, and `docs/decisions.md` ADR-005/ADR-006.

---

## Final Rule

**When a requirement is unclear, stop and ask the owner. Do not invent product behavior.**
