# Where Is My Temple — Claude Code Project Guide

## 1. Project Identity

Project name: Where Is My Temple
Domain: https://whereismytemple.com

Purpose:
A Kerala-focused temple information and discovery platform.

The V1 public website lists temples by district and provides temple information, daily rituals, visitor information, images, maps, and temple events/festivals.

---

## 2. Read This Before Making Changes

Before implementing any feature or modifying architecture, read:

1. This file: `CLAUDE.md`
2. Payload skill:
   `.claude/skills/payload/SKILL.md`
3. Current architecture:
   `docs/architecture.md`
4. Content model / Payload collection specification:
   `docs/content-model.md`
5. Relevant project documentation under `docs/`

If requirements are unclear, do NOT invent behavior. Ask for clarification.

---

## 3. Core Architecture

Frontend:
- Next.js
- React
- TypeScript

CMS:
- Payload CMS

Database:
- MongoDB Atlas

Media:
- Cloudflare R2, via Payload's S3-compatible storage adapter
  (`@payloadcms/storage-s3`), not the Cloudflare Workers R2-binding
  adapter (`@payloadcms/storage-r2`) — this app runs on a Node.js-compatible
  managed host, not Workers. See `docs/decisions.md` ADR-007 and
  `docs/deployment.md`.

DNS / Edge:
- Cloudflare

Architecture style:
- Modular monolith

Do not introduce microservices for V1.

---

## 4. V1 Product Decisions

### Temple

Temple pages contain:

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
12. "List your temple" CTA → Coming Soon

### Language

Only selected Temple fields are bilingual.

English + Malayalam:
- Temple name
- History / narrative
- Ritual names
- Ritual descriptions
- Dress code
- Important rules

How to reach:
- English only

The public Temple page shows ONE language at a time.
Do not display English and Malayalam together.

V1 uses the same Temple URL for both languages.
Do not create separate `/ml/` routes unless explicitly approved.

### Events / Festivals

Each Event belongs to exactly one Temple.

Fields:
- name
- description
- temple
- key ritual
- start date
- end date
- keywords/tags
- spotlight/featured selection

District is derived:
Event → Temple → District

Do not add a separate Event district field.

Do not store `isUpcoming`.

Event state is derived from dates:
- Past
- Ongoing
- Upcoming

Spotlight/Featured is manually selected by the internal team.

V1 does not include annual recurrence or Malayalam-calendar conversion.

### Media Storage Rule

All application file/media storage must use Payload's official storage-adapter architecture.

For the current deployment architecture:
- Cloudflare R2 is the media provider.
- `@payloadcms/storage-s3` is used through R2's S3-compatible API.
- Do not implement custom upload/delete/storage logic when the Payload adapter can handle it.
- Do not switch to `@payloadcms/storage-r2` unless the application is intentionally moved to Cloudflare Workers.

---

## 5. CMS Rules

Payload is the primary content-management interface.

Do not build a separate custom admin panel unless explicitly requested.

Existing collections:
- Users
- Media

V1 collections:
- Districts
- Temples
- Events

Do not create unnecessary collections without a confirmed requirement.

Do not manually create application collections in MongoDB when Payload owns the schema.

Districts, Temples and Events share one publication-state concept: the
`publicationStatus` field (`draft`/`review`/`published`/`archived`). Public
read is limited to `published` documents; only authenticated Payload users
can read drafts or write anything. Do not introduce Payload's separate
versions/drafts (`_status`) system alongside it — see `docs/decisions.md`
ADR-005/ADR-006 and `docs/content-model.md` §14.

---

## 6. Deferred Features

Do not implement these unless explicitly requested:

- Temple authority accounts
- Public user accounts
- Public temple submissions
- Comments
- Reviews
- Mobile app
- Microservices
- Redis
- Dedicated search engine
- AI chatbot
- Push notifications
- Advanced recommendation engine
- Annual event recurrence

"List your temple" remains Coming Soon.

---

## 7. Data Rules

Structured/filterable information must be stored structurally.

Do not turn reusable structured data into large text blobs.

Do not invent temple, ritual, festival, location, or historical information.

When information is uncertain, use an appropriate editorial/unverified state rather than guessing.

Initial temple data is researched and maintained in Excel and later imported into Payload.

---

## 8. Security Rules

Never:
- commit secrets
- expose environment variables
- put credentials into source code
- put production secrets into documentation
- paste secrets into chat
- modify production credentials without explicit owner approval

Environment values belong in environment configuration.

`.env.example` contains variable names/placeholders only.

---

## 9. Development Rules

Before changing code:

1. Inspect the current implementation.
2. Read relevant project documentation.
3. Explain the intended change when the change is substantial.
4. Make the smallest appropriate change.
5. Preserve existing architecture unless a change is explicitly approved.
6. Run the project's validation/testing/build checks.
7. Review changed files.
8. Update documentation when behavior or architecture changes.
9. Keep Git commits small and understandable.

Do not rewrite unrelated code.

---

## 10. Documentation Maintenance — IMPORTANT

The repository documentation is the long-term source of truth and must not depend on a Claude chat session.

After implementing a feature or making a meaningful architectural/configuration change:

1. Update the relevant documentation under `docs/`.
2. Update `CLAUDE.md` when the change affects project-wide rules, architecture, commands, important workflows, or current implementation status.
3. Record important architectural decisions in `docs/decisions.md`.
4. Do not record temporary debugging details as permanent architecture.
5. Do not duplicate large sections of detailed documentation into `CLAUDE.md`.

At the end of a significant task, report:
- what changed
- which documentation was updated
- whether architecture changed
- whether new environment variables/configuration are required

---

## 11. Session Recovery

A new Claude Code session must be able to recover project context from the repository without relying on previous chat history.

When starting a new session:

1. Read `CLAUDE.md`.
2. Read the relevant architecture/content documentation.
3. Inspect current Git status.
4. Inspect the current implementation before making assumptions.
5. Continue from the repository state, not from memory of an earlier chat.

Never assume that a previous Claude conversation is available.

---

## 12. Change Control

Claude must NOT independently:
- replace Payload
- replace MongoDB
- replace Next.js
- introduce microservices
- introduce Redis/search infrastructure without demonstrated need
- change canonical URLs
- change the domain
- change hosting architecture
- change the content model
- expose or rotate production secrets

When a proposed change affects architecture, data model, hosting, security, or public URL structure:
STOP and request owner approval before implementing it.

---

## 13. Quality Bar

Code should be:
- typed
- maintainable
- tested where appropriate
- accessible
- responsive
- SEO-friendly
- secure
- performant

Do not optimize prematurely.
Do not add infrastructure without evidence.

---

## 14. Current Development Phase

Current phase:
Payload CMS/content model implementation.

Next major phases:
1. Finalize and implement Payload collections
2. Verify CMS with sample content
3. Configure media/R2
4. Build public website from approved Figma
5. Implement search/filtering
6. Implement SEO/performance
7. Implement Excel import
8. Production hardening
9. Deployment

---

## 15. Owner Authority

The project owner has final authority over:
- product requirements
- architecture
- infrastructure
- credentials
- hosting
- billing
- data policies
- production deployment

Claude is the implementation engineer, not the product owner or architecture owner.

---

## Final Rule

Do not hallucinate requirements.

When information is missing, ambiguous, or contradictory:
ASK THE OWNER.

Do not silently choose a product behavior or architectural direction.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
