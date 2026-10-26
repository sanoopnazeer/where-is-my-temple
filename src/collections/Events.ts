import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'
import { publishedOrAdmin } from '../access/publishedOrAdmin'
import { publicationStatusField } from '../fields/publicationStatus'
import { getEventStatus } from '../utilities/eventDate'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'temple', 'startDate', 'endDate', 'status', 'publicationStatus'],
  },
  access: {
    read: publishedOrAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'temple',
      type: 'relationship',
      relationTo: 'temples',
    },
    {
      name: 'keyRitual',
      type: 'text',
    },
    {
      name: 'startDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'endDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
      validate: (value, { siblingData }) => {
        if (!value) return true

        const startDate = (siblingData as { startDate?: string } | undefined)?.startDate
        if (startDate && new Date(value).getTime() < new Date(startDate).getTime()) {
          return 'End date must not be before start date'
        }

        return true
      },
    },
    // Simple tag values — no separate Keyword collection in V1
    {
      name: 'keywords',
      type: 'array',
      fields: [
        {
          name: 'keyword',
          type: 'text',
        },
      ],
    },
    {
      name: 'spotlight',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Manually selected featured event.',
      },
    },
    // Derived from startDate/endDate — never stored (no isUpcoming field)
    {
      name: 'status',
      type: 'select',
      virtual: true,
      options: [
        { label: 'Past', value: 'past' },
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Upcoming', value: 'upcoming' },
      ],
      admin: {
        readOnly: true,
        position: 'sidebar',
        description: 'Derived automatically from start/end dates.',
      },
      hooks: {
        afterRead: [
          ({ siblingData }) => {
            const data = siblingData as { startDate?: string; endDate?: string } | undefined
            // Whole IST calendar days — see src/utilities/eventDate.ts
            return getEventStatus(data?.startDate, data?.endDate)
          },
        ],
      },
    },
    publicationStatusField(),
  ],
}
