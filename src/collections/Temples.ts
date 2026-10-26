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

    // Plan your visit (English only)
    {
      name: 'howToReach',
      type: 'richText',
    },

    // Transit points
    {
      name: 'transitPoints',
      type: 'array',
      fields: [
        {
          name: 'type',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
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

    // Darshan timings
    {
      name: 'darshanTimings',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
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

    // Important rules
    {
      name: 'importantRules',
      type: 'array',
      fields: [
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
