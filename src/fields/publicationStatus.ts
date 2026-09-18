import type { SelectField } from 'payload'

/**
 * Shared publication-state field for Districts, Temples and Events.
 * This is the project's single publication-state concept for V1 — see
 * docs/decisions.md ADR-005/ADR-006. Do not use Payload's separate
 * versions/drafts (`_status`) system alongside this field.
 */
export const publicationStatusField = (): SelectField => ({
  name: 'publicationStatus',
  type: 'select',
  required: true,
  defaultValue: 'draft',
  options: [
    { label: 'Draft', value: 'draft' },
    { label: 'Review', value: 'review' },
    { label: 'Published', value: 'published' },
    { label: 'Archived', value: 'archived' },
  ],
  admin: {
    position: 'sidebar',
  },
})
