# Deployment

## Environment Variables

Core (all environments):

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | MongoDB Atlas connection string |
| `PAYLOAD_SECRET` | Payload auth/encryption secret |

Media storage (Cloudflare R2):

| Variable | Purpose |
|---|---|
| `R2_BUCKET` | R2 bucket name |
| `R2_ACCESS_KEY_ID` | R2 API token access key ID |
| `R2_SECRET_ACCESS_KEY` | R2 API token secret |
| `R2_ENDPOINT` | R2 S3-compatible endpoint (`https://<account_id>.r2.cloudflarestorage.com`) |
| `R2_PUBLIC_URL` | Public base URL media is served from (`https://media.whereismytemple.com`, no trailing slash) |

`.env.example` lists these names only. Actual values live in `.env` (git-ignored) locally and in the host's environment configuration in every other environment. Never commit `.env`, never put real values in this repo's docs, and never paste them into chat.

---

## Media Storage — Cloudflare R2

The `media` collection uses Payload's **S3-compatible storage adapter** (`@payloadcms/storage-s3`) against R2's S3-compatible API — not `@payloadcms/storage-r2` / the Cloudflare Workers R2-binding adapter, since this app runs on a Node.js-compatible managed host, not Cloudflare Workers. See `docs/decisions.md` ADR-007.

Configuration (`src/payload.config.ts`):

- `region: 'auto'`, `endpoint: R2_ENDPOINT`, `forcePathStyle: true` (required for R2's S3 compatibility mode).
- Credentials from `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY`, read server-side only via `process.env` — never sent to the browser (no `NEXT_PUBLIC_` prefix, no client bundle reference).
- `disableLocalStorage: true` — uploaded files go straight to R2; nothing is written to local disk.
- Public URLs are generated from `R2_PUBLIC_URL` via a custom `generateFileURL`, so the stored `url` field is always `https://media.whereismytemple.com/<filename>` regardless of the underlying R2 endpoint shape.

Payload's built-in upload metadata (filename, mimeType, filesize, width/height for images) is unaffected by the storage backend — only where the bytes live changes, not the document schema. The existing `alt` field and the ADR-005 access rules (public read, authenticated-admin create/update/delete) are unchanged.

### Owner-managed prerequisites (outside this app)

- An R2 bucket exists and is bound to the custom domain `media.whereismytemple.com` in Cloudflare (DNS + public bucket connection).
- The R2 API token used for `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` is scoped to that one bucket only (least privilege), per `CLAUDE.md` §8 Security Rules.
- The bucket's public accessibility is controlled entirely by the Cloudflare custom-domain binding, not by anything in this app.

---

## Verification performed (2026-09-18)

Using a throwaway Local API script (not committed) exercising the same upload/read/delete code path the Admin panel uses:

- Uploaded a test image; response `url` was exactly `https://media.whereismytemple.com/<filename>`.
- Fetched that URL directly (unauthenticated, outside the app): `200`, correct `content-type: image/png`.
- Confirmed no local copy of the file exists anywhere in the project (no `media/` directory, no matching filename on disk).
- Confirmed unauthenticated `POST`/`PATCH`/`DELETE` on `/api/media` all still return `403`; unauthenticated `GET` still returns `200`.
- Deleted the record through Payload; the public URL briefly still returned the cached bytes (Cloudflare edge cache), then correctly returned `404` (`cf-cache-status: DYNAMIC`) once the cache entry expired — confirming the object was actually removed from R2, not just hidden.
