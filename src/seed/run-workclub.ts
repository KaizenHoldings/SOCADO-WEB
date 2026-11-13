import config from '@payload-config'
import { getPayload } from 'payload'
import { seedWorkclub } from './workclub'
import { seedWorkclubV2 } from './workclub-v2'

/**
 * Manual entry point for the workclub seed: `pnpm seed:workclub`.
 *
 * The same idempotent functions run on server start (see `onInit` in
 * payload.config.ts); this script is for filling a database by hand, without
 * booting the app. The base seed creates what is missing and the versioned
 * updates then bring those records up to the current content.
 */
// Booting Payload already runs `onInit`; this keeps the seed from running
// twice when it is invoked by hand.
process.env.SEED_WORKCLUB = 'false'

const run = async (): Promise<void> => {
  const payload = await getPayload({ config })
  await seedWorkclub(payload)
  await seedWorkclubV2(payload)

  /*
    This runs in its own process, so it cannot invalidate the cache of a server
    that is already up: that server keeps serving its copy of /workclub until
    its window expires. Saying it here saves the next person the hunt.
  */
  payload.logger.info(
    '[seed:workclub] si hay un servidor en marcha, reinícialo (o espera su ventana de caché) para ver estos datos en /workclub.',
  )

  process.exit(0)
}

await run()
