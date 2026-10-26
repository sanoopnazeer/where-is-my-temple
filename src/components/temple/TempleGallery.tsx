import Image from 'next/image'

import type { Media, Temple } from '@/payload-types'
import { resolveMediaUrl } from '@/utilities/media'
import styles from './TempleGallery.module.css'

const MOSAIC_GROUP_SIZE = 4
const MOSAIC_TILE_CLASSES = [styles.tileA, styles.tileB, styles.tileC, styles.tileD]
// Tiles A/D stay full-width on mobile (the mosaic's wide tiles); B/C sit
// side by side at half width there — matches the `grid-template-areas`
// mobile override in TempleGallery.module.css.
const MOSAIC_TILE_SIZES = [
  '(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw',
  '(max-width: 720px) 50vw, (max-width: 1100px) 50vw, 33vw',
  '(max-width: 720px) 50vw, (max-width: 1100px) 50vw, 33vw',
  '(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw',
]
const SIMPLE_TILE_SIZES = '(max-width: 720px) 50vw, (max-width: 1100px) 50vw, 33vw'

function chunk<T>(items: T[], size: number): T[][] {
  const groups: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    groups.push(items.slice(i, i + size))
  }
  return groups
}

function GalleryTile({
  media,
  className,
  sizes,
}: {
  media: Media
  className: string
  sizes: string
}) {
  const url = resolveMediaUrl(media)
  if (!url) return null

  return (
    <div className={className}>
      <Image src={url} alt={media.alt ?? ''} fill loading="lazy" sizes={sizes} className={styles.image} />
    </div>
  )
}

export function TempleGallery({ temple }: { temple: Temple }) {
  const gallery = (temple.gallery ?? []).filter(
    (item): item is Media => typeof item !== 'string',
  )
  if (gallery.length === 0) return null

  const groups = chunk(gallery, MOSAIC_GROUP_SIZE)

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Gallery</h2>
      <div className={styles.groups}>
        {groups.map((group, groupIndex) =>
          group.length === MOSAIC_GROUP_SIZE ? (
            // Desktop mosaic matching design/desktop/Temple Page.jpg: one tall
            // image on the left, two uneven images top-right, one wide image
            // bottom-right. Falls back to a single column on small viewports.
            <div key={groupIndex} className={styles.mosaic}>
              {group.map((media, index) => (
                <GalleryTile
                  key={media.id}
                  media={media}
                  className={MOSAIC_TILE_CLASSES[index]}
                  sizes={MOSAIC_TILE_SIZES[index]}
                />
              ))}
            </div>
          ) : (
            // Leftover images that don't fill a full mosaic group (any count
            // other than a multiple of 4) — plain even grid, no invented images.
            <div key={groupIndex} className={styles.simpleGrid}>
              {group.map((media) => (
                <GalleryTile
                  key={media.id}
                  media={media}
                  className={styles.simpleTile}
                  sizes={SIMPLE_TILE_SIZES}
                />
              ))}
            </div>
          ),
        )}
      </div>
    </section>
  )
}
