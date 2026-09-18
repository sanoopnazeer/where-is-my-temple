# Where Is My Temple — Architecture v0.3
## Final V1 Planning Baseline

**Project:** Where Is My Temple  
**Domain:** https://whereismytemple.com  
**Status:** Pre-development / architecture baseline  
**Version:** 0.3  
**Purpose:** Permanent project reference and Claude Code context

> **Rule:** Confirmed requirements are authoritative. Proposed/future ideas are not permission to implement. If a requirement is genuinely unclear or contradictory, ask the project owner instead of inventing behavior.

---

## 1. Product Definition

Where Is My Temple is a Kerala-focused temple information and discovery platform.

V1 focuses on helping people discover temples by district and view useful information about temples, daily rituals, visitor guidance, images, location, and temple events/festivals.

The platform should be:

- SEO-first
- fast and cache-friendly
- reliable for traffic spikes
- inexpensive to operate initially
- simple enough for one developer to maintain
- structured so future temple-authority accounts can be introduced without a major rewrite

---

## 2. Confirmed V1 Product Decisions

### Temple page — confirmed sections

1. Temple name/location hero
2. History / narrative
3. Daily rituals with timings
4. Gallery
5. Plan your visit
6. Transit points
7. Map + temple marker
8. Contact/social links
9. Darshan timings
10. Dress code
11. Important rules
12. “List your temple” CTA → **Coming Soon**

### Language

The public website is English by default. District/reference pages remain English-only in V1.

Only the following Temple content is bilingual:

- Temple name
- History / narrative
- Ritual names
- Ritual descriptions
- Dress code
- Important rules

How to reach remains English-only in V1.

The public Temple page shows **one language at a time**. English and Malayalam are not displayed side-by-side.

V1 uses the same Temple URL for both language views. Separate `/ml/` SEO routes are deferred.

### Events / Festivals

Each Event belongs to exactly one Temple.

Confirmed fields:

- Event/Festival name
- Description
- Temple relationship
- Key ritual
- Start date
- End date
- Keywords/tags
- Manual Spotlight/Featured selection

The Event does **not** store a separate district field. District is derived from Event → Temple → District.

The website automatically derives event state from dates:

- **Past:** `endDate < today`
- **Ongoing:** `startDate <= today <= endDate`
- **Upcoming:** `startDate > today`

Do **not** store `isUpcoming`.

V1 does not implement annual recurrence or Malayalam-calendar conversion.

### Initial temple data

The owner will research and maintain temple data in Excel. The system will later import validated data into Payload.

### Map

V1 requires a map with a temple marker. Latitude and longitude are stored for each Temple.

### Public submissions

“List your temple” is a Coming Soon CTA only in V1. No public submission workflow is implemented.

### Temple authority accounts

Not implemented in V1. Keep the content model compatible with future authority accounts after roughly a year, but do not build the login/dashboard/permissions now.

---

## 3. Architecture Decisions

| Area | V1 decision |
|---|---|
| Frontend | Next.js + React + TypeScript |
| CMS/Admin | Payload CMS |
| Database | MongoDB Atlas |
| Media storage | Cloudflare R2 |
| DNS/edge | Cloudflare |
| App architecture | Modular monolith |
| Source control | GitHub |
| Initial content source | Excel → validation/import → Payload |
| Public accounts | None |
| Admin accounts | Payload Users |
| Event model | First-class Event linked to one Temple |
| Search | MongoDB queries/indexes initially |
| Redis | Deferred |
| Dedicated search engine | Deferred |
| Microservices | Rejected for V1 |
| AI development | Claude Code as implementation accelerator |
| Canonical domain | `whereismytemple.com` |

---

## 4. High-Level Architecture

```text
                            INTERNET
                               |
                               v
                       Cloudflare DNS / Edge
                               |
                               v
                    Managed Next.js/Payload Host
                    +-----------------------------+
                    | Public Website              |
                    | Payload Admin               |
                    | Server/API / Content Layer  |
                    +--------------+--------------+
                                   |
                        +----------+----------+
                        |                     |
                        v                     v
                 MongoDB Atlas         Cloudflare R2
                 structured data        images/media
```

### Public request model

```text
User
  |
  v
CDN / cached response
  |
  +---- cache hit ------> return cached content
  |
  +---- cache miss -----> Next.js / Payload ---> MongoDB
```

The target is to make public page traffic mostly cache-served instead of database-served.

---

## 5. Application Architecture — Modular Monolith

Use one application initially.

Do not create separate Temple, Event, Search, Media, or Auth microservices.

Conceptual boundaries:

```text
src/
  modules/
    temples/
    events/
    districts/
    media/
    search/
    seo/
```

The exact directory structure may follow Payload/Next.js conventions. The module boundaries are the important part.

Keep business logic out of presentation components where practical.

Preferred flow:

```text
Page / Route
    ↓
Application/service logic
    ↓
Payload / data access
    ↓
MongoDB
```

---

## 6. V1 Payload Collections

The V1 CMS should contain:

```text
Users       ← existing
Media       ← existing
Districts   ← new
Temples     ← new
Events      ← new
```

### Important simplification

Do **not** create a standalone Ritual collection in V1.

Daily rituals are repeatable structured data embedded/contained within the Temple record because V1 does not require standalone ritual pages or independent ritual management.

Do **not** create standalone Deity or Keyword collections in V1.

---

## 7. Content Model — District

District is reusable reference data.

Core fields:

- English name
- Malayalam name
- slug

Optional fields should only be added when required by the final design/content requirements.

Temples reference a District instead of storing arbitrary district text.

---

## 8. Content Model — Temple

Temple is the core content entity.

### Identity

- `name.en`
- `name.ml`
- `slug`

### Location

- `district` → required relationship to District
- `locality`
- `taluk` → optional
- `address`
- `latitude`
- `longitude`

### History / narrative

Localized:

- `historyNarrative.en`
- `historyNarrative.ml`

### Daily rituals

Repeatable array:

```text
Daily Ritual
├── name.en
├── name.ml
├── description.en
├── description.ml
├── startTime
└── endTime (optional)
```

### Media

- `heroImage` → Media
- `gallery[]` → Media, many

### Plan your visit

English-only:

- `howToReach`

### Transit points

Repeatable array:

```text
Transit Point
├── type
├── name
├── distance
└── unit
```

### Darshan timings

Repeatable array:

```text
Darshan Timing
├── label
├── openTime
└── closeTime
```

### Dress code

Localized:

```text
Dress Code
├── men.en
├── men.ml
├── women.en
└── women.ml
```

### Important rules

Repeatable localized items:

```text
Rule
├── en
└── ml
```

### Contact

Optional:

- phone
- email
- WhatsApp
- website

### Social links

Optional:

- Instagram
- Facebook
- YouTube

### Editorial / trust

- publication status
- verification status
- source type
- source URL
- last verified date

### SEO

Support page-level SEO overrides where required.

---

## 9. Content Model — Event

Event is a first-class collection.

Fields:

```text
name
Description
Temple → required relationship to one Temple
keyRitual
startDate
endDate
keywords[]
featured / spotlight
```

### District derivation

Do not store District on Event.

```text
Event
  ↓
Temple
  ↓
District
```

### Event status derivation

```text
if endDate < today
    Past

else if startDate <= today <= endDate
    Ongoing

else
    Upcoming
```

### Spotlight

Spotlight is an editorial/manual selection. The internal team chooses which Event is featured.

Do not automatically select Spotlight based on dates.

---

## 10. Language / Localization Architecture

Payload localization is used only where confirmed.

Localized Temple fields:

```text
name
historyNarrative
ritual.name
ritual.description
dressCode
importantRules
```

English-only Temple fields:

```text
howToReach
```

Language-neutral/factual fields:

```text
latitude
longitude
times
phone
email
URLs
```

### Public UX

```text
[ EN ] [ മലയാളം ]
```

Only one language is shown at any moment.

The V1 implementation should use the same canonical Temple URL for the language switch.

Separate Malayalam SEO routes and hreflang architecture are deferred.

---

## 11. Media Architecture

Do not store temple photographs as large binary fields in MongoDB.

Planned flow:

```text
Payload Media
     ↓
Cloudflare R2
     ↓
Optimized delivery
     ↓
CDN
```

Media metadata should include, as appropriate:

- storage key/reference
- delivery URL/reference
- width
- height
- alt text
- caption
- sort order
- featured flag

Actual R2 credentials remain server-side and outside source control.

---

## 12. Search and Discovery

V1 starts with MongoDB queries and indexes.

Potential search/filter dimensions:

- temple name
- Malayalam temple name
- district
- event/festival name
- event keywords
- event dates

Do not introduce a dedicated search engine until actual requirements demonstrate the need.

---

## 13. SEO

SEO is a first-class requirement.

Important public pages should have:

- unique title
- meta description
- canonical URL
- Open Graph metadata
- semantic HTML
- internal linking
- structured data where appropriate
- sitemap inclusion

Platform requirements:

```text
sitemap.xml
robots.txt
canonical URLs
indexable temple/event/district pages
```

Malayalam temple content is available through the V1 language switch, but independent Malayalam SEO routes are deferred.

---

## 14. Performance and Scalability

The goal is to support thousands of visitors without a large dedicated server from day one.

Principles:

1. Cache public pages.
2. Prefer static/cached rendering where content freshness allows.
3. Index database queries.
4. Avoid N+1 queries.
5. Paginate large lists.
6. Optimize images.
7. Lazy-load non-critical gallery images.
8. Keep API responses small.
9. Use CDN delivery.
10. Measure bottlenecks before adding infrastructure.

Do not add Redis, queues, microservices, or a dedicated search engine merely because future traffic might be large.

---

## 15. Data Ingestion

The initial dataset is maintained in Excel.

Planned flow:

```text
Excel
  ↓
Validation / normalization
  ↓
Duplicate detection
  ↓
Payload import/API
  ↓
MongoDB
```

The importer should eventually report:

- total rows
- successful imports
- duplicates
- missing required fields
- invalid references
- invalid coordinates
- malformed values
- rows needing review

After the initial import, the CMS is the main editing tool.

---

## 16. Data Quality

Temple/event information should have provenance where practical:

```text
sourceType
sourceUrl
lastVerifiedAt
verifiedBy
```

Keep publication and verification separate.

Never invent missing temple/festival information.

Use review/unverified states when information is uncertain.

---

## 17. Security

Minimum requirements:

- HTTPS
- environment variables for secrets
- no secrets in Git
- admin authentication
- least-privilege storage/database credentials
- server-side validation
- upload/file-size validation
- database access controls
- rate limiting for sensitive endpoints if introduced
- secure sessions/cookies
- errors that do not expose secrets or internal stack traces

Production credentials remain under the owner's control.

---

## 18. Environment and Secrets

Current application secrets conceptually include:

```text
DATABASE_URL
PAYLOAD_SECRET
R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
R2_ENDPOINT
NEXT_PUBLIC_SITE_URL
```

Actual values:

- stay in local `.env`/deployment secrets
- must never be committed to GitHub
- must never be placed in `CLAUDE.md`
- must never be placed in `/docs`
- must never be pasted into public chat

`.env.example` contains names/placeholders only.

---

## 19. Backup and Recovery

Before public launch, define:

- backup frequency
- retention period
- restore procedure
- backup storage
- credential ownership

Minimum concept:

```text
MongoDB
  ↓
Scheduled export/backup
  ↓
Separate storage
```

---

## 20. Monitoring

At launch monitor at least:

- uptime
- application/server errors
- failed deployments/builds
- database connectivity
- slow requests/pages
- image delivery failures

---

## 21. Git and AI-Assisted Development

Recommended repository documentation:

```text
docs/
  architecture.md
  content-model.md
  database.md
  deployment.md
  development-guide.md
  data-guidelines.md
  decisions.md
  development-status.md
```

### Claude Code role

Claude Code is the fast implementation engineer.

It may:

- implement approved features
- configure Payload collections
- build components
- write server/API code
- write import scripts
- add tests
- debug and refactor
- improve performance after measurement
- update documentation

It must not independently:

- replace Payload
- replace MongoDB
- replace Next.js
- introduce microservices
- introduce Redis or a search service without demonstrated need
- change canonical URLs/domain
- change hosting architecture without review
- modify production credentials
- expose secrets
- invent product requirements

### Required implementation loop

```text
Read docs
  ↓
Inspect current code
  ↓
Plan the change
  ↓
Implement smallest suitable change
  ↓
Run lint/typecheck/tests/build
  ↓
Review changed files
  ↓
Update docs when meaningful behavior/architecture changes
  ↓
Commit
```

---

## 22. Persistent Claude Context

`CLAUDE.md` is the entry point for every Claude Code session.

It must remain concise and point to detailed documents rather than becoming a full project history.

New Claude sessions should be able to recover context from the repository alone by reading:

1. `CLAUDE.md`
2. `docs/architecture.md`
3. the Payload collection specification
4. relevant `docs/*`
5. the current Git state/source code

The project must not depend on a previous Claude chat session remaining available.

### Documentation maintenance rule

After a meaningful feature/configuration/architecture change:

- update the relevant `docs/` file
- update `CLAUDE.md` if the project-wide workflow or architecture changed
- record meaningful architectural decisions in `docs/decisions.md`
- update `docs/development-status.md`

Do not add temporary debugging details to permanent architecture docs.

---

## 23. Future Temple Authority Support

Not V1.

Keep a future relationship conceptually available:

```text
Temple
  ↓
Authorized organization / authority
  ↓
User account(s)
```

Potential future roles:

- Super Admin
- Content Editor
- Temple Authority
- Verifier

Future authority permissions should be limited to specific fields/actions. Authority users should not automatically receive unrestricted access to canonical or verified historical/editorial fields.

---

## 24. Explicit V1 Exclusions

Do not implement without a new confirmed requirement:

- temple-authority login
- public user accounts
- public temple submissions
- comments
- reviews
- mobile app
- annual event recurrence
- Malayalam-calendar conversion
- nearby-temple discovery
- dedicated search engine
- Redis
- microservices
- AI chatbot
- push notifications
- advanced recommendation engine
- standalone ritual directory
- standalone deity directory
- standalone keyword taxonomy

---

## 25. Development Sequence

### Phase 0 — Specification

Finalize content model, field mapping, provider choices and documentation.

### Phase 1 — Payload collections

Implement Districts, Temples and Events using the approved collection specification.

### Phase 2 — CMS verification

Create sample content and verify relationships, localization, media references, validation and event dates.

### Phase 3 — Media / R2

Configure Media storage with R2 and test image upload/delivery.

### Phase 4 — Public website

Implement the approved Figma experience in Next.js using the real CMS data.

### Phase 5 — Search and discovery

Implement indexed MongoDB queries, filters and event states.

### Phase 6 — SEO and performance

Implement metadata, sitemap, structured data, caching and image optimization.

### Phase 7 — Excel import

Implement the validated bulk-import workflow.

### Phase 8 — Production hardening

Security review, monitoring, backups, production configuration and deployment.

---

## 26. Current Status

Completed:

- accounts/infrastructure created
- Payload project scaffolded
- MongoDB Atlas connected
- Payload admin working
- admin user persisted in MongoDB
- GitHub repository configured
- initial Git baseline committed
- architecture baseline created
- Payload collection specification created
- V1 Temple/Event requirements confirmed

Current phase:

**Payload collection implementation**

Next major task:

**Give Claude Code the approved collection specification and implement Districts, Temples and Events only.**

---

## 27. Final Architecture Rule

**Do not invent a field, service, dependency, route, role, content type, or workflow just because it might be useful someday. Add it when a confirmed requirement or measured engineering problem justifies it.**

When unsure: **ask the owner.**
