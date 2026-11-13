import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import { WORKCLUB_PASSES_TAG } from '@/lib/payload/revalidateWorkclub'
import type { PassType, Plan, WorkclubSetting } from '@/payload-types'

/**
 * Payload access for the /workclub packages section.
 *
 * Server-only: it talks to the database through the Local API. It returns the
 * documents as they come, with no presentation decisions; grouping, the CTA
 * inheritance and the fallback belong to the service layer.
 */

export interface WorkclubPassesRaw {
  /** Active pass types, in `order`. */
  passTypes: PassType[]
  /** Active plans, in `order`. Each one carries the id of its pass type. */
  plans: Plan[]
  settings: WorkclubSetting | null
}

async function queryWorkclubPasses(): Promise<WorkclubPassesRaw> {
  const payload = await getPayload({ config })

  const [passTypes, plans, settings] = await Promise.all([
    payload.find({
      collection: 'pass-types',
      where: { active: { equals: true } },
      sort: 'order',
      limit: 20,
      depth: 0,
    }),
    payload.find({
      collection: 'plans',
      where: { active: { equals: true } },
      sort: 'order',
      limit: 100,
      // depth 0: `passType` stays an id, which is all the grouping needs.
      depth: 0,
    }),
    payload.findGlobal({ slug: 'workclub-settings', depth: 0 }),
  ])

  return {
    passTypes: passTypes.docs,
    plans: plans.docs,
    settings: settings ?? null,
  }
}

/**
 * How long a cached copy may be served before it is refreshed.
 *
 * `unstable_cache` is stale-while-revalidate: once the window is over, the
 * first request still gets the old copy and only then refreshes it in the
 * background. In production that is what we want. In development it hides the
 * state of the database behind two reloads, and a write from outside the
 * server — the seed, a script — cannot invalidate the tag from its own
 * process, so the window is the only thing that would clear it. One second
 * keeps the cache in place for a single render pass and nothing more.
 */
const CACHE_SECONDS = process.env.NODE_ENV === 'production' ? 300 : 1

/**
 * Cached read. The landing is statically rendered, so this mainly spares the
 * database on regeneration; the tag is what lets an edit in the admin reach
 * the page without a redeploy (see `revalidateWorkclub`).
 */
export const fetchWorkclubPasses = unstable_cache(
  queryWorkclubPasses,
  ['workclub-passes'],
  { tags: [WORKCLUB_PASSES_TAG], revalidate: CACHE_SECONDS },
)
