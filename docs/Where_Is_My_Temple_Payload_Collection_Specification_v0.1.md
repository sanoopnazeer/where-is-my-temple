# Where Is My Temple — Payload Collection Specification v0.1

**Status:** V1 content-model baseline  
**Project:** Where Is My Temple  
**Domain:** `whereismytemple.com`  
**CMS:** Payload CMS  
**Database:** MongoDB Atlas  
**Date:** 18 September 2026

> This specification is the implementation baseline for Payload collections. It is intentionally narrower than the long-term architecture. Claude must not add collections or fields merely because they may be useful later. When a requirement is unclear, ask before implementing.

## 1. Development sequence

Yes: the **working Payload collection specification should be completed before feature development of the public website**.

The current project scaffold, GitHub connection, MongoDB connection, and Payload admin are already development foundations. We should now lock the content model before asking Claude to build public temple/event pages.

Recommended sequence:

```text
Figma + confirmed requirements
        ↓
Payload collection specification   ← this document
        ↓
Implement Payload collections
        ↓
Create sample content in CMS
        ↓
Verify relationships + localization
        ↓
Implement public website pages
        ↓
Data importer / Excel workflow
        ↓
SEO / performance / production hardening
```

## 2. V1 collections

### Existing collections to keep

- `users` — Payload authentication/admin users
- `media` — Payload upload/media collection

### New collections

- `districts`
- `temples`
- `events`

### Not a V1 collection

- Rituals — daily rituals are embedded repeatable data on a Temple because V1 does not require a standalone ritual directory/detail page.
- Deities — no separate collection unless a later confirmed search/relationship requirement justifies it.
- Keywords — simple tag arrays are sufficient in V1.

### V1 global

- `homepage-settings` — one manually selected Spotlight Celebration event.

## 3. Localization strategy

Payload supports localization at the field level. Configure project locales:

- `en` — default locale
- `ml` — Malayalam

Only explicitly approved fields are localized. Non-localized fields remain single-value fields.

### Public UX

Use a single canonical Temple URL and a language switch:

```text
EN | മലയാളം
```

Only one language is displayed at a time. Do not create `/ml/...` routes in V1.

### Localized Temple fields

- Temple name
- History / narrative
- Daily ritual name
- Daily ritual description
- Dress code — men
- Dress code — women
- Important rules

### English-only / language-neutral in V1

- Slug
- District
- Locality
- Taluk
- Address
- Latitude / longitude
- How to reach
- Transit point data
- Darshan timings
- Contact/social URLs
- Event fields
- Keywords
- Editorial/system metadata

If later we decide Malayalam should be SEO-indexable through separate URLs, that is a routing/SEO change and should be treated as a new decision.

## 4. Collection: Users

**Slug:** `users`  
**Status:** existing Payload collection

Purpose: admin authentication.

V1:

- Keep the existing Payload authentication collection.
- No public registration.
- No temple-authority roles in V1.
- Do not expose the Users collection publicly.

Future authority accounts can be introduced later with roles and scoped permissions.

## 5. Collection: Media

**Slug:** `media`  
**Status:** existing Payload collection; modify configuration as needed

Purpose: temple/event imagery and public media.

### Required behavior

- Upload-enabled collection.
- Image files ultimately stored in Cloudflare R2.
- MongoDB stores media metadata/reference, not large image binaries.
- Support image sizes/responsive variants where appropriate.
- Support meaningful alt text and caption.

### Recommended metadata fields

| Field | Type | Required | Notes |
|---|---|---:|---|
| Alt text | text | Yes for published public images | Accessibility/SEO |
| Caption | text/textarea | No | Human-readable image caption |
| Category | select | No | Keep small: temple, festival, ritual, general |

Do not invent additional media taxonomy until the actual content workflow requires it.

### R2 integration

Use Payload's S3 storage adapter with Cloudflare R2's S3-compatible API when the application is hosted in a normal Node.js environment. Payload's current docs explicitly document R2 through `@payloadcms/storage-s3`; the dedicated R2 adapter is intended for Cloudflare Workers.

## 6. Collection: Districts

**Slug:** `districts`  
**Purpose:** reusable Kerala district reference.

### Fields

| Field | Payload type | Required | Localized | Notes |
|---|---|---:|---:|---|
| Name | text | Yes | No | English district name |
| Slug | text | Yes | No | Unique, lowercase, URL-safe |

### Validation / indexes

- `name` required.
- `slug` required and unique.
- Index `slug` for route lookup.

Do not add Malayalam district fields in V1 because Malayalam content is currently scoped to Temple pages.

## 7. Collection: Temples

**Slug:** `temples`  
**Purpose:** primary public content entity.

### 7.1 Identity

| Field | Payload type | Required | Localized | Notes |
|---|---|---:|---:|---|
| Name | text | Yes | Yes | English + Malayalam |
| Slug | text | Yes | No | Unique public URL identifier |

The English and Malayalam values live in the same localized field.

### 7.2 Location

| Field | Payload type | Required | Localized | Notes |
|---|---|---:|---:|---|
| District | relationship → districts | Yes | No | Single relationship |
| Locality / Place | text | Yes | No | Useful locality/place name |
| Taluk | text | No | No | Only where known/needed |
| Address | textarea | Yes | No | English V1 |
| Latitude | number | Yes | No | Decimal latitude |
| Longitude | number | Yes | No | Decimal longitude |

### Validation

- Latitude between `-90` and `90`.
- Longitude between `-180` and `180`.
- District must reference an existing published/usable District record.
- Latitude/longitude are the source of truth for the V1 map marker.

### 7.3 History / narrative

| Field | Payload type | Required | Localized | Notes |
|---|---|---:|---:|---|
| History / Narrative | richText | Yes for publish | Yes | English + Malayalam |

Use rich text so editorial content can contain headings/paragraphs/links without storing HTML manually.

### 7.4 Daily rituals

**Field:** `dailyRituals[]`  
**Payload type:** array  
**Localized parent:** No  
**Localized nested fields:** Yes, only where specified

| Nested field | Payload type | Required | Localized | Notes |
|---|---|---:|---:|---|
| Ritual name | text | Yes | Yes | English + Malayalam |
| Description | textarea/richText | No | Yes | English + Malayalam |
| Start time | text | Yes | No | Store a simple time value; no timezone/date semantics |
| End time | text | No | No | Optional |

Do not create a separate `rituals` collection in V1.

### Time representation

Use a consistent display/storage format for times, e.g. `05:00 AM`, or a normalized `HH:mm` plus frontend formatting. Do not use arbitrary free-form time strings such as mixed prose.

### 7.5 Media

| Field | Payload type | Required | Notes |
|---|---|---:|---|
| Hero image | upload → media | Yes for publish | One image |
| Gallery | upload → media, hasMany | No | Multiple images |

### 7.6 Plan your visit

| Field | Payload type | Required | Localized | Notes |
|---|---|---:|---:|---|
| How to reach | richText/textarea | No | No | English only in V1 |

Do not localize this field in V1.

### 7.7 Transit points

**Field:** `transitPoints[]`  
**Payload type:** array

| Nested field | Payload type | Required | Notes |
|---|---|---:|---|
| Type | select | Yes | railway, bus, airport, metro, other |
| Name | text | Yes | Transit point name |
| Distance | number | Yes | Non-negative |
| Unit | select | Yes | m or km |

Do not hardcode fields such as `railwayStationName` or `busStandName`.

### 7.8 Darshan timings

**Field:** `darshanTimings[]`  
**Payload type:** array

| Nested field | Payload type | Required |
|---|---|---:|
| Label | text | Yes |
| Open time | text | Yes |
| Close time | text | Yes |

This supports arbitrary schedules such as Morning Darshan / Evening Darshan without hardcoding only two periods.

### 7.9 Dress code

**Group:** `dressCode`

| Nested field | Payload type | Required | Localized |
|---|---|---:|---:|
| Men | textarea | No | Yes |
| Women | textarea | No | Yes |

Only one language is shown to visitors at a time.

### 7.10 Important rules

**Field:** `importantRules[]`  
**Payload type:** array

| Nested field | Payload type | Required | Localized |
|---|---|---:|---:|
| Rule | textarea | Yes | Yes |

No rule should be stored as a large numbered blob if it can be represented as individual array entries.

### 7.11 Contact / social links

V1 fields should stay limited to channels actually required by the design/content workflow.

| Field | Payload type | Required |
|---|---|---:|
| Email | email | No |
| WhatsApp | text/url | No |
| Instagram | text/url | No |
| Facebook | text/url | No |

If the final Figma mapping confirms additional channels, add them deliberately rather than inventing a full social-media schema.

### 7.12 Editorial / verification

| Field | Payload type | Required | Public? | Notes |
|---|---|---:|---:|---|
| Publication status | select | Yes | Filtered | draft, review, published, archived |
| Verification status | select | Yes | Optional display | unverified, verified |
| Source type | select | No | No | Internal provenance |
| Source URL | url | No | No | Provenance |
| Last verified at | date | No | No | Internal |

For V1, public APIs/pages must expose only content meeting the intended publication/read rules. Draft/review/archived content must not leak to public pages.

### 7.13 SEO

| Field | Payload type | Required | Notes |
|---|---|---:|---|
| Meta title | text | No | Optional override |
| Meta description | textarea | No | Optional override |
| Social image | upload → media | No | Optional |

Canonical URL is generated from the fixed domain + route + slug; do not store arbitrary canonical URLs per Temple in V1.

## 8. Collection: Events

**Slug:** `events`  
**Purpose:** temple-linked festivals/events displayed in event/festival discovery pages.

### Fields

| Field | Payload type | Required | Localized | Notes |
|---|---|---:|---:|---|
| Name | text | Yes | No | Festival/event name; English V1 |
| Slug | text | Yes | No | Unique public URL identifier |
| Description | richText | Yes | No | English V1 |
| Temple | relationship → temples | Yes | No | Exactly one Temple |
| Key ritual | text | No | No | English V1 |
| Start date | date | Yes | No | Date-only UX |
| End date | date | Yes | No | Must be same or after start |
| Keywords | array of text | No | No | Search/discovery tags |
| Media | upload → media, hasMany | No | No | Event imagery |
| Publication status | select | Yes | No | draft, review, published, archived |
| Verification status | select | Yes | No | unverified, verified |
| Source type | select | No | No | Internal provenance |
| Source URL | url | No | No | Internal provenance |
| Last verified at | date | No | No | Internal |
| Meta title | text | No | No | Optional SEO override |
| Meta description | textarea | No | No | Optional SEO override |

### District handling

Do **not** store a second editable district field on Event.

District is derived through:

```text
Event → Temple → District
```

The Event admin/public UI may display the derived district, but it is not a second source of truth.

### Date validation

`endDate >= startDate`.

Use Payload's date field with a day-only picker/UX. The application must treat these as Kerala calendar dates rather than meaningful event timestamps.

### Automatic event status

Do not store `isUpcoming`.

Derive the status from today's date in the `Asia/Kolkata` business timezone:

```text
startDate > today
    → upcoming

startDate <= today <= endDate
    → ongoing

endDate < today
    → past
```

Upcoming event query for the website:

```text
endDate >= today
AND
startDate > today
ORDER BY startDate ASC
```

If an event is ongoing, it can be surfaced separately as `ongoing` rather than being incorrectly labeled upcoming.

### Keywords

Use a simple repeatable tag array, for example:

```text
pongala offering
medam 1
panchavadyam
```

Do not create a separate Keywords collection in V1.

## 9. Global: Homepage Settings

**Slug:** `homepage-settings`

Purpose: manually choose the one current Spotlight Celebration shown on the homepage.

### Field

| Field | Payload type | Required |
|---|---|---:|
| Spotlight event | relationship → events | No |

V1 behavior:

- Owner/editor selects the spotlight event manually in Payload.
- The homepage reads this relationship.
- Normal Upcoming Events are still calculated automatically from event dates.

Do not add `isSpotlight` booleans to every Event unless a later requirement specifically calls for multiple simultaneous spotlight slots.

## 10. Public read rules

The public site must only render content intended for publication.

Conceptually:

```text
Public page
   ↓
Published Temple / Event / District
   ↓
Render
```

Admin users can work with draft/review/unverified records according to Payload access rules.

The exact access function implementation should be handled by Claude using Payload's access-control conventions, but the product behavior is fixed by this specification.

## 11. Slugs and uniqueness

### Temple slug

- required
- unique
- human readable
- based primarily on English temple name
- must be stable once published

### Event slug

Events should also have stable readable URLs if individual event pages are part of the final public UX.

Recommended generated form:

```text
<temple-slug>-<event-name-slug>
```

The exact event URL is subject to the final public-page routing decision; do not invent a conflicting route structure.

### District slug

- required
- unique
- URL-safe

## 12. MongoDB / index intentions

At minimum, prepare indexes for frequently queried fields:

### Districts

- `slug` unique

### Temples

- `slug` unique
- district relationship
- latitude/longitude geospatial index when nearby search is implemented

### Events

- `startDate`
- `endDate`
- temple relationship
- publication status

Do not add a large index set without a query requirement. Payload supports field indexing and MongoDB adapter configuration; indexes should reflect real queries.

## 13. Excel import baseline

The CMS is the runtime content tool. Excel is the initial data-collection workflow.

### Temples sheet — initial columns

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
phone_or_contact_if_confirmed
email
whatsapp
instagram
facebook
```

Repeatable/nested data such as rituals, rules, transit points, and timings should be represented in separate sheets rather than forcing multiple values into one Temple row.

Suggested related sheets:

```text
Temples
TempleRituals
TempleTransitPoints
TempleDarshanTimings
TempleRules
Events
```

The exact import format will be finalized before the importer is implemented.

## 14. Sample data to enter before frontend development

Before public pages are built, create at least:

- 2 Districts
- 2 Temples
- each Temple with at least 2 rituals
- each Temple with a hero image
- at least 1 gallery image
- at least 1 set of darshan timings
- at least 1 dress-code entry
- at least 2 rules
- at least 2 Events
- at least 1 ongoing/upcoming Event
- at least 1 past Event
- 1 manually selected Spotlight Event

This is the minimum fixture set needed to verify the relationships and automatic event status logic.

## 15. Implementation guardrails for Claude

Claude must:

1. Read this specification before modifying collections.
2. Preserve the existing `users` and `media` collections unless changes are explicitly required by this specification.
3. Create only `districts`, `temples`, `events`, plus the `homepage-settings` global for V1.
4. Enable Payload localization for `en` and `ml` and mark only approved fields as localized.
5. Keep daily rituals embedded on Temple for V1.
6. Keep Event linked to exactly one Temple.
7. Derive Event district from Temple.
8. Compute event status from dates; do not store `isUpcoming`.
9. Keep Spotlight selection in `homepage-settings`.
10. Generate/update Payload TypeScript types after schema changes.
11. Run lint/typecheck/tests/build after meaningful implementation changes.
12. Do not change the public URL strategy, database, CMS, or hosting architecture without approval.
13. Do not add Redis, a dedicated search engine, microservices, or other infrastructure without a demonstrated requirement.
14. Do not expose secrets.
15. If a requirement in this document conflicts with an existing generated project behavior, stop and ask before making a broad redesign.

## 16. What comes immediately after collection implementation

After Claude creates the collections, we will **not** immediately build every frontend page.

First perform a CMS validation pass:

```text
Payload Admin
   ↓
Create District
   ↓
Create Temple
   ↓
Add Malayalam content
   ↓
Add rituals
   ↓
Add timings/rules/transit
   ↓
Upload media
   ↓
Create Event
   ↓
Link Event → Temple
   ↓
Select Spotlight Event
   ↓
Verify MongoDB records
```

Then verify public queries:

- published Temple only
- published Event only
- district-derived Event display
- upcoming event sorting
- ongoing/past detection
- language switch behavior

Only after this passes should Claude move to the public website implementation.

## 17. Explicit non-goals for V1

Do not implement yet:

- temple authority accounts
- public user accounts
- public temple submission form
- reviews/comments
- dedicated Ritual listing/detail pages
- dedicated Deity collection
- Keywords collection
- annual recurrence engine
- exact Malayalam-calendar festival conversion
- nearby temple discovery
- advanced map search
- dedicated search engine
- Redis
- microservices

## 18. References

1. Payload storage adapters / Cloudflare R2: `@payloadcms/storage-s3` supports R2 via its S3-compatible API; the native R2 adapter is for Cloudflare Workers.  
   https://payloadcms.com/docs/upload/storage-adapters
2. Payload Date Field documentation:  
   https://payloadcms.com/docs/fields/date
3. Payload Relationship Field documentation:  
   https://payloadcms.com/docs/fields/relationship
4. Payload Localization documentation:  
   https://payloadcms.com/docs/configuration/localization
5. Payload MongoDB adapter documentation:  
   https://payloadcms.com/docs/database/mongodb

## 19. Final rule

**This document is a baseline, not permission to invent. If a real requirement is unclear, ask the owner before implementing it.**
