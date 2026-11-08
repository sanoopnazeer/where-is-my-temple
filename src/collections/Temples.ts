import type { CollectionConfig } from 'payload'

import { isAdmin } from '../access/isAdmin'
import { publishedOrAdmin } from '../access/publishedOrAdmin'
import { publicationStatusField } from '../fields/publicationStatus'

export const Temples: CollectionConfig = {
  slug: 'temples',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'district', 'publicationStatus', 'verificationStatus'],
  },
  access: {
    read: publishedOrAdmin,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    // Identity
    {
      name: 'name',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },

    // Short summary shown under the name in the mobile hero
    {
      name: 'tagline',
      type: 'textarea',
      localized: true,
    },

    // Location
    {
      name: 'district',
      type: 'relationship',
      relationTo: 'districts',
    },
    {
      name: 'locality',
      type: 'text',
    },
    {
      name: 'taluk',
      type: 'text',
    },
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'latitude',
      type: 'number',
      min: -90,
      max: 90,
    },
    {
      name: 'longitude',
      type: 'number',
      min: -180,
      max: 180,
    },

    // History / narrative
    {
      name: 'historyNarrative',
      type: 'richText',
      localized: true,
    },

    // Darshan timings
    {
      name: 'darshanTimings',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
        },
        {
          name: 'openTime',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'timeOnly',
            },
          },
        },
        {
          name: 'closeTime',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'timeOnly',
            },
          },
        },
      ],
    },

    // Advisory shown with the darshan timings
    {
      name: 'advisory',
      type: 'textarea',
      localized: true,
    },

    // Spiritual details (mobile Temple page). Paragraphs in textareas are
    // separated by a blank line.
    {
      name: 'presidingDeity',
      type: 'text',
      localized: true,
    },
    {
      name: 'sacredLocation',
      type: 'text',
      localized: true,
    },
    {
      name: 'spiritualSignificance',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'spiritualHighlights',
      type: 'array',
      fields: [
        {
          name: 'icon',
          type: 'select',
          defaultValue: 'sacred',
          options: [
            { label: 'Sacred symbol', value: 'sacred' },
            { label: 'Gathering', value: 'gathering' },
            { label: 'Offering', value: 'offering' },
            { label: 'Water', value: 'water' },
            { label: 'Holy bath', value: 'bathing' },
          ],
        },
        { name: 'title', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },

    // Festival summaries (editorial, undated — dated occurrences are Events)
    {
      name: 'festivals',
      type: 'array',
      fields: [
        { name: 'name', type: 'text', localized: true },
        { name: 'description', type: 'textarea', localized: true },
      ],
    },

    // Daily rituals (repeatable, embedded — no standalone Ritual collection)
    {
      name: 'dailyRituals',
      type: 'array',
      fields: [
        {
          name: 'name',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'startTime',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'timeOnly',
            },
          },
        },
        {
          name: 'endTime',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'timeOnly',
            },
          },
        },
      ],
    },

    // Note shown with the ritual schedule
    {
      name: 'ritualNote',
      type: 'textarea',
      localized: true,
    },

    // Plan your visit
    {
      name: 'howToReach',
      type: 'richText',
      localized: true,
    },

    // Direction blurb above the map
    {
      name: 'directionNote',
      type: 'textarea',
      localized: true,
    },

    // Transit points
    {
      name: 'transitPoints',
      type: 'array',
      fields: [
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'type',
          type: 'text',
          localized: true,
        },
        {
          name: 'name',
          type: 'text',
          localized: true,
        },
        {
          name: 'distance',
          type: 'number',
        },
        {
          name: 'unit',
          type: 'select',
          options: [
            { label: 'Meters', value: 'm' },
            { label: 'Kilometers', value: 'km' },
          ],
        },
      ],
    },

    // Dress code
    {
      name: 'dressCode',
      type: 'group',
      fields: [
        {
          name: 'men',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'women',
          type: 'textarea',
          localized: true,
        },
      ],
    },

    // Important rules (optional bold title, e.g. "River Safety Precautions")
    {
      name: 'visitorGuidelinesIntro',
      type: 'textarea',
      localized: true,
    },
    {
      name: 'importantRules',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'rule',
          type: 'textarea',
          localized: true,
        },
      ],
    },

    // Contact
    {
      name: 'contact',
      type: 'group',
      fields: [
        { name: 'phone', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'whatsapp', type: 'text' },
        { name: 'website', type: 'text' },
      ],
    },

    // Social links
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        { name: 'instagram', type: 'text' },
        { name: 'facebook', type: 'text' },
        { name: 'youtube', type: 'text' },
      ],
    },

    // Media
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'gallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },

    // Editorial / verification
    publicationStatusField(),
    {
      name: 'verificationStatus',
      type: 'select',
      defaultValue: 'unverified',
      options: [
        { label: 'Unverified', value: 'unverified' },
        { label: 'Verified', value: 'verified' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'sourceType',
      type: 'text',
    },
    {
      name: 'sourceUrl',
      type: 'text',
    },
    {
      name: 'lastVerifiedAt',
      type: 'date',
    },
    {
      name: 'verifiedBy',
      type: 'relationship',
      relationTo: 'users',
    },

    // SEO
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'seoTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
        { name: 'socialImage', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
