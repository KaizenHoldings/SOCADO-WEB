/**
 * Cache invalidation for the /workclub packages section.
 *
 * The landing is statically rendered, so an edit in the admin would otherwise
 * only reach visitors on the next ISR window. The collections and the global
 * that feed the section call this after every change, and the page updates
 * without a redeploy.
 *
 * `next/cache` is imported lazily and every call is guarded: Payload also runs
 * outside a Next request (the seed, `payload run`, the CLI), where these
 * functions are unavailable or throw, and a failed revalidation must never
 * fail the write that triggered it.
 */

/** Cache tag shared by the data layer and these hooks. */
export const WORKCLUB_PASSES_TAG = 'workclub-paquetes'

/** Route rendered from that data. */
export const WORKCLUB_PATH = '/workclub'

export async function revalidateWorkclub(): Promise<void> {
  try {
    const { revalidateTag, revalidatePath } = await import('next/cache')
    // 'max' expires every entry of the tag, whatever its age.
    revalidateTag(WORKCLUB_PASSES_TAG, 'max')
    revalidatePath(WORKCLUB_PATH)
  } catch (error) {
    /*
      Outside a Next request there is no cache to invalidate from here, and
      saying so matters: a script that writes to the database — the seed, for
      instance — leaves a server that is already running with its cached copy
      of the section, which looks exactly like a write that did not happen.
    */
    console.warn(
      `[revalidateWorkclub] no se pudo invalidar la caché desde este proceso (${
        (error as Error).message
      }). Un servidor ya en marcha seguirá sirviendo su copia de /workclub hasta que expire su ventana o se reinicie.`,
    )
  }
}
