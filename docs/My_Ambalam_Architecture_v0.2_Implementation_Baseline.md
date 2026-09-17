# My Ambalam — Architecture v0.2
## Implementation Baseline

**Version:** 0.2  
**Status:** Pre-development / implementation baseline  
**Domain:** `whereismytemple.com`  
**Purpose:** Permanent project reference and Claude implementation context

> **Important:** This document separates confirmed decisions from proposed implementation details. Claude must not invent product requirements. When a requirement is genuinely unclear, it should stop and ask for clarification rather than silently choosing a product behavior.

---

## 1. Product Definition

My Ambalam is a Kerala-focused temple information and discovery platform.

The V1 goal is to help people discover temples by district and view useful information about each temple, especially daily rituals and annual festivals.

The public website is the primary product. The system should be SEO-friendly, fast, reliable under traffic spikes, inexpensive to operate initially, and practical for a solo developer to maintain.

### V1 language decision

- Public website: English by default.
- Temple detail pages: English + Malayalam.
- Malayalam is required for temple-page content from V1.
- Do not add full-site Malayalam localization unless explicitly approved later.

### V1 festival decision

Festival records initially need:

- Festival name
- Approximate month
- Associated temple

Do not implement exact day-by-day schedules, yearly occurrences, or Malayalam-calendar conversion as V1 requirements unless explicitly approved later.

### V1 map decision

- Show a map.
- Show the temple marker.
- Store latitude/longitude.
- Do not build nearby-temple discovery into V1 unless separately approved.

### V1 temple submission decision

The “List your temple” CTA shown in the design is **Coming Soon** in V1.

Do not implement a public submission workflow yet.

### V1 temple-authority decision

Temple authority accounts are deferred. The expected direction is to consider them after roughly one year.

Design the content model so authority accounts can be added later, but do not build them in V1.

---

## 2. Core Architecture Decisions

### Confirmed

| Area | Decision |
|---|---|
| Frontend | Next.js + React + TypeScript |
| CMS / Admin | Payload CMS |
| Database | MongoDB Atlas |
| Media storage | Cloudflare R2 |
| DNS / edge | Cloudflare |
| Architecture style | Modular monolith |
| Source control | GitHub |
| Initial data entry | Excel -> validation/import -> Payload/MongoDB |
| Public auth | None in V1 |
| Admin auth | Required |
| Temple authority login | Deferred |
| Dedicated search engine | Deferred |
| Redis | Deferred |
| Microservices | Rejected for V1 |
| AI development | Claude/Claude Code as implementation accelerator, not infrastructure dependency |
| Canonical domain | `whereismytemple.com` |

### Guiding principle

Keep the system simple enough for one developer to operate while keeping clean boundaries for future growth.

Do not add a service, framework, collection, field, dependency, or infrastructure layer only because it might be useful someday.

---

## 3. High-Level System

```text
                         INTERNET
                            |
                            v
                    Cloudflare DNS / Edge
                            |
                            v
                 Next.js + Payload Application
                 +-----------------------------+
                 | Public Website              |
                 | Payload Admin               |
                 | Server/API / Content Layer  |
                 +--------------+--------------+
                                |
                       +--------+--------+
                       |                 |
                       v                 v
                MongoDB Atlas      Cloudflare R2
                structured data       images/media
```

### Public request goal

```text
User
  |
  v
CDN / cached response
  |
  +---- cache hit ------> return cached page
  |
  +---- cache miss -----> Next.js / Payload
                              |
                              v
                          MongoDB
```

The objective is to prevent database traffic from growing linearly with public page views.

---

## 4. Deployment Strategy

### Initial recommendation

Use a mature managed Next.js host for the application rather than making Cloudflare Workers/vinext the first deployment target solely because Cloudflare is used for DNS and R2.

Initial responsibility split:

```text
Cloudflare
- Domain/DNS
- Edge/CDN capabilities
- R2 image storage

Managed Next.js host
- Next.js + Payload application
- Git-based deployments
- Production environment variables

MongoDB Atlas
- Application data
```

The exact managed Next.js host can be finalized before production deployment. The codebase should avoid unnecessary host-specific APIs so the application remains portable.

---

## 5. Application Architecture

Use a modular monolith.

Conceptual modules:

```text
src/
  modules/
    temples/
    festivals/
    rituals/
    districts/
    media/
    search/
    seo/
```

Payload-specific conventions may change exact folders. The architectural boundaries matter more than the exact directory names.

### Layering

Where practical:

```text
UI / Route
    |
    v
Application service
    |
    v
Data access / Payload
    |
    v
MongoDB
```

Do not place business logic everywhere inside React components.

---

## 6. Content Model

### 6.1 District

Purpose: reusable Kerala district reference.

Proposed fields:

- name
- Malayalam name
- slug
- optional description
- optional image
- SEO metadata
- createdAt / updatedAt

A temple should reference a district rather than storing arbitrary district text.

---

### 6.2 Temple

Temple is the core content entity.

#### Identity

- name
- Malayalam name
- slug
- alternate names
- optional category/type if required by the final UX

#### Location

- district reference
- locality/place
- taluk (only if required)
- full address
- latitude
- longitude

#### Religious information

- primary deity
- additional deities
- traditions / special practices where structured data adds real value

#### Heritage / editorial

- short description
- history
- significance
- legend/story where required
- architecture where required

#### Daily rituals

- relationship/reference to ritual records
- daily ritual entries with times and descriptions where applicable

#### Festivals

- relationship/reference to festival records

#### Media

- hero image
- gallery images
- image captions
- image alt text
- image ordering

#### Visitor information

- darshan/opening timings
- dress code
- important rules
- facilities if required by the actual content/design

#### Travel

- how to reach
- transit points

#### Contact

- phone
- email
- WhatsApp where applicable
- official website
- social links

#### Editorial / trust

- publication status
- verification status
- source type
- source URL
- last verified date
- verified by

#### SEO

- title override if required
- meta description
- social/share image where required
- canonical URL handling

---

### 6.3 Ritual

Rituals are structured records, not one large temple text field.

Proposed fields:

- name
- Malayalam name
- slug
- description
- start time
- optional end time
- applicable days/frequency
- optional category
- temple relation(s)
- source / verification metadata

The data model should support cards such as:

```text
Nirmalyam Darshan
05:00 AM
Description...
```

without hardcoding those fields into the frontend.

---

### 6.4 Festival

Festival is a first-class entity.

V1 fields:

- name
- Malayalam name if required for the temple-page Malayalam experience
- slug
- associated temple(s)
- description
- approximate month
- category if required
- media where needed
- source / verification metadata
- SEO metadata

### Explicit V1 constraint

Do not build a complex occurrence/calendar system yet.

Future direction may include:

```text
Festival Definition
   |
   +-- 2026 occurrence
   +-- 2027 occurrence
   +-- 2028 occurrence
```

but this is a later enhancement.

---

### 6.5 Deity

Separate Deity collection is **not mandatory for V1**.

For V1, use a simple structured deity representation unless the final search/relationship requirements justify a reusable Deity collection.

Do not normalize it prematurely.

---

### 6.6 Media

Media metadata should be separate from large binaries.

Proposed metadata:

- storage key/reference
- delivery reference/URL
- width
- height
- alt text
- caption
- category
- sort order
- primary/featured flag
- associated entity

Actual image binaries belong in R2, not MongoDB.

---

## 7. Relationship Strategy

Conceptual relationships:

```text
District
  |
  +---- Temples
           |
           +---- Rituals
           |
           +---- Festivals
           |
           +---- Media
           |
           +---- Deities (if normalized later)
```

Festival:

```text
Festival
  |
  +---- Temple(s)
  +---- Media
```

The exact choice between embedded subdocuments and referenced collections should be made using:

- reuse
- query requirements
- record size
- CMS editing experience
- performance

Do not normalize solely because normalization is theoretically cleaner.

---

## 8. Payload CMS Strategy

Payload is the main content-management interface.

V1 admin workflow:

```text
Admin login
   |
   v
Payload Admin
   |
   +-- Districts
   +-- Temples
   +-- Rituals
   +-- Festivals
   +-- Media
```

Required behaviors:

- create/edit/delete records
- draft/review/published states where useful
- validation
- source/verification fields
- media management
- SEO fields
- internal admin authentication

### V1 explicitly does not include

- temple authority accounts
- public user accounts
- public submissions
- comments
- reviews
- complex moderation
- authority dashboard

---

## 9. Publication and Verification

Keep these separate.

Example:

```text
publicationStatus = published
verificationStatus = verified
```

Possible publication states:

```text
draft
review
published
archived
```

Verification metadata:

```text
sourceType
sourceUrl
verifiedBy
lastVerifiedAt
```

A page may be published while still being marked unverified. Verification can be improved later without necessarily changing publication status.

Do not invent uncertain temple/festival information. Use draft/review/unverified states when information is incomplete.

---

## 10. Temple Page Information Derived From Existing Design

The existing Figma design indicates these temple-page areas:

- Temple name / location hero
- History / narrative
- Daily ritual cards and timings
- Temple gallery
- Plan your visit
- Transit points
- Temple map/location
- Directions/location context where supported
- Contact/social links
- Darshan timings
- Dress code
- Important rules
- Temple submission CTA

These UI sections should be mapped to structured CMS fields before implementation.

### Important implementation rule

Do not make one database field for every visual UI element.

Example:

Do not create:

```text
railwayStationName
railwayStationDistance
busStandName
busStandDistance
```

Prefer a reusable structure such as:

```text
transitPoints[]
  type
  name
  distance
  unit
```

The UI is a presentation layer; the content model should represent the underlying concept.

---

## 11. Public URL Strategy

Canonical domain:

```text
https://whereismytemple.com
```

Proposed public routes:

```text
/
 /temples
 /districts
 /districts/<district-slug>
 /temples/<temple-slug>
 /festivals
 /festivals/<festival-slug>
 /rituals
 /rituals/<ritual-slug>
```

Use stable human-readable slugs.

Do not use opaque numeric IDs as the public canonical URL.

Once public URLs are indexed, changing slugs must be treated as a migration/redirect concern.

---

## 12. SEO

SEO is a core product requirement.

Every important public content page should support:

- unique title
- meta description
- canonical URL
- Open Graph metadata
- semantic HTML
- internal links
- structured data where applicable
- sitemap inclusion

Platform requirements:

```text
sitemap.xml
robots.txt
canonical URLs
indexable content routes
```

Temple pages should be designed as individual search landing pages.

The public page source should contain meaningful content without depending on client-side execution to make the core content discoverable.

---

## 13. Search and Discovery

### V1

Start with MongoDB queries and indexes.

Potential filters:

- temple name
- Malayalam temple name
- district
- deity
- ritual
- festival
- approximate festival month

### Deferred

Do not add:

- Elasticsearch
- Typesense
- Algolia
- dedicated search cluster

until actual search requirements justify it.

### Geography

Store:

```text
latitude
longitude
```

for every temple.

This supports the V1 map marker and leaves a clean path for future radius/nearby search.

---

## 14. Maps

V1 requirement:

- map
- temple marker

The database must store latitude and longitude.

Do not build nearby-temple discovery or advanced map clustering in V1 unless approved.

Map provider choice should be finalized before implementation because provider APIs, quotas, licensing and operational costs differ.

---

## 15. Images and R2

Image flow:

```text
Payload Admin
     |
     v
Image upload
     |
     v
Cloudflare R2
     |
     v
Optimized delivery
     |
     v
Public CDN
```

Rules:

- Do not store large original image binaries in MongoDB.
- Validate image type and file size.
- Keep meaningful alt text/captions.
- Prefer optimized image formats/variants.
- Lazy-load non-critical gallery images.
- Do not send multi-megabyte originals to mobile devices.
- Keep storage references stable so delivery implementation can change later.

---

## 16. Initial Data Ingestion

The initial content source will be a manually researched Excel file maintained by the owner.

Target flow:

```text
Excel
  |
  v
CSV/XLSX importer
  |
  v
Schema validation
  |
  v
Normalization
  |
  v
Duplicate detection
  |
  v
Payload import/API
  |
  v
MongoDB
```

Import reports should eventually show:

- total rows
- successfully imported
- duplicates
- missing required fields
- invalid district references
- invalid coordinates
- malformed values
- rows requiring manual review

### Important

The CMS should remain the normal tool for later edits and corrections.

Do not make the Excel file the permanent runtime database.

---

## 17. Data Quality / Provenance

Long-term data quality is expected to be more difficult than raw traffic scaling.

Important information should be traceable to a source.

Recommended metadata:

```text
sourceType
sourceUrl
lastVerifiedAt
verifiedBy
```

Possible source categories:

- temple official source
- devaswom/government source
- verified publication
- verified contributor
- other

Never silently invent missing information.

---

## 18. Performance / Scalability

Target: thousands of visitors without a large dedicated server from day one.

### Principles

1. Cache public pages.
2. Prefer static/cached rendering where freshness allows.
3. Use database indexes.
4. Avoid N+1 queries.
5. Paginate large lists.
6. Optimize images.
7. Lazy-load below-the-fold media.
8. Keep responses small.
9. Use CDN delivery.
10. Measure bottlenecks before adding infrastructure.

### Scaling model

```text
Traffic spike
    |
    v
CDN / Cache
    |
    +---- most requests served from cache
    |
    +---- cache miss / dynamic request
              |
              v
        Next.js / Payload
              |
              v
          MongoDB
```

### Explicitly deferred

Do not add Redis just because traffic sounds large.

Do not add microservices.

Do not add Kubernetes.

Do not add a dedicated search engine.

Add infrastructure only when measurements demonstrate a need.

---

## 19. Security

Minimum requirements:

- HTTPS
- secrets in environment variables
- no secrets committed to Git
- admin authentication
- least-privilege API/storage credentials
- server-side validation
- upload validation
- file size limits
- database access control
- rate limiting for sensitive public endpoints if any are introduced
- secure sessions/cookies
- non-leaking error responses

The owner controls all production credentials.

---

## 20. Environment Variables

Conceptual values:

```text
MONGODB_URI
PAYLOAD_SECRET

R2_ACCOUNT_ID
R2_ACCESS_KEY_ID
R2_SECRET_ACCESS_KEY
R2_BUCKET_NAME
R2_ENDPOINT

NEXT_PUBLIC_SITE_URL
```

Actual values belong only in local environment files and the deployment provider's secure secret store.

Never commit actual secret values.

Provide an `.env.example` with variable names and safe placeholders only.

---

## 21. Backups and Recovery

Before public launch, define:

- backup frequency
- retention period
- restore procedure
- backup storage
- ownership of backup credentials

Minimum concept:

```text
MongoDB
   |
   v
Scheduled backup/export
   |
   v
Separate storage
```

Do not assume a free database tier provides every desired backup capability.

---

## 22. Monitoring / Operations

At launch, monitor at least:

- uptime
- server errors
- failed builds/deployments
- database connectivity
- slow requests/pages
- image delivery failures

Add deeper observability only when useful.

---

## 23. Git and AI-Assisted Development

Recommended repository structure:

```text
my-ambalam/
  app/
  components/
  src/
  scripts/
  tests/
  docs/
  public/
  .env.example
  .gitignore
  README.md
```

Recommended documentation:

```text
docs/
  architecture.md
  content-model.md
  database.md
  deployment.md
  development-guide.md
  data-guidelines.md
  decisions.md
```

### Claude role

Claude/Claude Code acts as the fast implementation engineer.

Claude may:

- implement agreed features
- configure Payload collections
- create components
- write server/API code
- build import scripts
- add tests
- fix bugs
- refactor
- improve performance after measurement
- update documentation

Claude must not independently:

- replace MongoDB
- replace Payload
- introduce microservices
- introduce Redis/search infrastructure without evidence
- change hosting architecture
- change canonical URLs
- modify production credentials
- expose secrets
- invent product requirements

### Required implementation loop

```text
Read project docs
      |
      v
Understand architecture
      |
      v
Plan change
      |
      v
Implement
      |
      v
Typecheck / lint / tests / build
      |
      v
Review changed files
      |
      v
Commit
      |
      v
Update docs when architecture changes
```

Claude must not treat an empty request as permission to redesign the entire system.

---

## 24. Owner Responsibilities

The owner retains control of:

- GitHub
- domain registrar
- MongoDB Atlas
- Cloudflare
- application hosting
- billing
- production credentials
- backups
- deployment approval
- product decisions
- architecture decisions
- content verification policies

The application must remain usable without any AI service being continuously available.

---

## 25. Future Temple Authority Architecture

Deferred from V1.

Future conceptual model:

```text
Temple
   |
   +---- authorized organization / authority
   |
   +---- user account(s)
```

Potential future roles:

```text
Super Admin
Content Editor
Temple Authority
Verifier
```

Authority permissions should be field/action specific.

A temple authority should not automatically receive unrestricted rights to change canonical, verified, historical, or editorial content.

---

## 26. V1 Scope

### Included

1. Home/discovery
2. District browsing
3. Temple listing
4. Temple detail pages
5. Malayalam temple-page content
6. Ritual information
7. Festival name + approximate month
8. Temple gallery/images
9. Map + temple marker
10. Visitor information
11. Payload admin
12. Draft/review/publish workflow
13. Excel/CSV bulk import
14. Search/filtering
15. SEO basics
16. Caching/performance basics
17. Monitoring basics
18. Backup basics

### Deferred

- Temple authority accounts
- Public accounts
- Public temple submission system
- Comments/reviews
- Mobile app
- Dedicated search engine
- Redis
- Microservices
- AI chatbot
- Push notifications
- Advanced recommendation engine
- Nearby-temple search

“List your temple” remains a **Coming Soon** CTA in V1.

---

## 27. Development Phases

### Phase 0 — Final specification

- Confirm final Figma field mapping
- Lock content model
- Lock festival V1 model
- Lock Malayalam scope
- Lock map provider
- Lock URL strategy
- Lock hosting approach
- Create implementation docs

### Phase 1 — Foundation

- Create Payload + Next.js project
- Connect MongoDB Atlas
- Configure environments
- Initialize GitHub
- Create base documentation

### Phase 2 — CMS / Content Model

- District
- Temple
- Ritual
- Festival
- Media
- Publication/verification metadata

### Phase 3 — Public Experience

- Home
- District pages
- Temple pages
- Ritual pages
- Festival pages
- Search/filters
- Map

### Phase 4 — Design Implementation

- Implement approved Figma design
- Desktop
- Tablet
- Mobile
- Accessibility/performance polish

### Phase 5 — Data Ingestion

- Excel template
- importer
- validation
- duplicate detection
- import report

### Phase 6 — SEO / Performance

- metadata
- sitemap
- structured data
- caching/static rendering
- image optimization
- database indexes

### Phase 7 — Production Readiness

- security review
- monitoring
- backups
- production environment
- deployment
- smoke tests

---

## 28. Owner Setup Checklist

Before Claude begins implementation:

```text
[ ] GitHub repository created
[ ] MongoDB Atlas project/cluster created
[ ] MongoDB application user created
[ ] Atlas network access configured for development
[ ] Cloudflare account created
[ ] R2 bucket created
[ ] Domain registered / controlled by owner
[ ] Node.js installed
[ ] pnpm installed
[ ] Git installed
[ ] Claude Code installed
[ ] Local project directory chosen
[ ] No production secrets committed
```

Do not manually create application collections in MongoDB if Payload owns the schema.

---

## 29. Architecture Guardrails

These rules are binding unless explicitly changed:

1. Payload remains the V1 CMS.
2. MongoDB Atlas remains the V1 application database.
3. R2 remains the planned image storage.
4. The application remains a modular monolith.
5. Public pages should be cache-friendly and SEO-first.
6. Structured information should be modeled structurally.
7. Avoid premature normalization and premature infrastructure.
8. Public submissions stay disabled in V1.
9. Temple authority login stays deferred.
10. Claude implements; it does not redefine the product.

---

## 30. Current Decision Log

| Decision | Status |
|---|---|
| Next.js | Confirmed |
| React + TypeScript | Confirmed |
| Payload CMS | Confirmed |
| MongoDB Atlas | Confirmed |
| Cloudflare R2 | Planned/accepted |
| Cloudflare DNS/edge | Planned/accepted |
| Domain `whereismytemple.com` | Confirmed |
| Malayalam on temple pages | Confirmed |
| Festival = name + approximate month in V1 | Confirmed |
| Excel as initial data source | Confirmed |
| Map + marker in V1 | Confirmed |
| “List your temple” = Coming Soon | Confirmed |
| Authority accounts | Deferred |
| Dedicated search engine | Deferred |
| Redis | Deferred |
| Microservices | Rejected for V1 |
| AI-assisted implementation | Confirmed |

---

## 31. Remaining Questions Before Coding

These are the only intentionally unresolved product/implementation questions identified at this stage:

1. **Exact Figma-to-field mapping:** finalize every field that is actually represented by the design before creating Payload collections.
2. **Map provider:** choose the V1 map provider based on UX, quotas, licensing and cost.
3. **Final hosting provider:** choose the managed Next.js host before production deployment.
4. **Temple data spreadsheet:** create the final import columns after field mapping is approved.

Do not invent answers to these in Claude.

---

## 32. Definition of Done for Architecture Stage

Before the first major Claude build prompt is issued, the following must be approved:

- V1 scope
- Temple fields
- Ritual fields
- Festival fields
- District fields
- Media model
- Relationship strategy
- Malayalam behavior
- Publication/verification workflow
- Figma field mapping
- Map provider
- URL structure
- Image strategy
- Hosting strategy
- Backup strategy
- Excel/import format
- Admin permissions
- Environment/secrets model

---

## 33. Claude Handoff Instruction

When this file is given to Claude, Claude should treat it as the project's architecture baseline.

Claude should:

- read it before implementing
- follow confirmed decisions
- treat proposed items as provisional
- avoid introducing new infrastructure without justification
- ask for clarification when a requirement is genuinely ambiguous
- never expose secrets
- keep the codebase runnable without Claude
- update project documentation when architecture changes

### Final rule

**Do not hallucinate requirements. When the specification is incomplete, ask the owner instead of silently inventing behavior.**

---
