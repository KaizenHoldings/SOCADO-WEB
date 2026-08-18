import { getPayload } from 'payload'
import config from '@payload-config'

/** Raw shape returned by Payload for a home-menu-sections document. */
export interface HomeMenuSectionDoc {
  id: string | number
  title: string
  description?: string | null
  /** When fetched with depth ≥ 1 the image field is expanded to a Media object. */
  image?:
    | {
        url?: string | null
        filename?: string | null
      }
    | string
    | null
  order?: number | null
}

/**
 * Retrieves all home-menu-section documents from Payload CMS,
 * sorted by the `order` field in ascending order.
 *
 * This function is server-only (uses getPayload with direct DB access).
 */
export async function fetchHomeMenuSections(): Promise<HomeMenuSectionDoc[]> {
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'home-menu-sections',
    sort: 'order',
    limit: 30,
    depth: 1, // expand media relationship so image.url is available
  })

  return result.docs as HomeMenuSectionDoc[]
}
