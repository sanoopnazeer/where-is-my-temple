import type { Access } from 'payload'

/**
 * Public read is limited to documents whose `publicationStatus` field
 * equals 'published'. Authenticated admin users can read everything,
 * including draft/review documents, so they can edit them.
 *
 * Requires the collection to define a `publicationStatus` select field
 * (see docs/content-model.md).
 */
export const publishedOrAdmin: Access = ({ req: { user } }) => {
  if (user) return true

  return {
    publicationStatus: {
      equals: 'published',
    },
  }
}
