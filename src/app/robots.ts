import type { MetadataRoute } from 'next'

import { SITE_URL, absoluteUrl } from '@/utilities/site'

/**
 * All public pages are crawlable; Payload's admin panel and API are not.
 * `/search` stays crawlable on purpose: it is `noindex`, and a crawler has
 * to be able to fetch it to see that.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE_URL,
  }
}
