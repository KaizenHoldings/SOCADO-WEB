import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Dos columnas de `plans` para el modal de "más información":
 *
 * - `details_title`: encabezado de la lista de detalles. Vacío significa
 *   "incluye", que no sirve cuando la lista son tarifas de salas.
 * - `excludes_group_benefits`: marca el plan que es la excepción de su tipo de
 *   pass, para que el modal no le repita la tarjeta "todos los ... incluyen".
 *
 * NO BORRA NADA. El `up` solo añade, con `IF NOT EXISTS` en las dos, asi que
 * se puede repetir sin consecuencias y no aborta si alguna ya estaba. Ambas
 * quedan nulas en las filas existentes, que es el valor por defecto correcto:
 * sin titulo propio y sin excepcion.
 *
 * El `down` si borra, y por eso esta cerrado con llave. Lee su nota.
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "details_title" varchar;
  ALTER TABLE "plans" ADD COLUMN IF NOT EXISTS "excludes_group_benefits" boolean;`)
}

/**
 * Deshace lo anterior, lo que significa BORRAR las dos columnas y lo que
 * guarden: los títulos de lista y la marca de excepción de cada plan.
 *
 * Bloqueado a proposito, igual que las migraciones anteriores: en produccion
 * basta un `payload migrate:down` de mas — o un `migrate:refresh`, o un
 * `migrate:reset` — para perder contenido que no esta en ningun otro sitio.
 * Para ejecutarlo hay que pedirlo de forma explicita:
 *
 *   ALLOW_DESTRUCTIVE_MIGRATION=true payload migrate:down
 *
 * Si no quieres esta guarda, borra el `if`.
 */
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  if (process.env.ALLOW_DESTRUCTIVE_MIGRATION !== 'true') {
    throw new Error(
      'migrate:down de 20261123_125737_plan_modal_fields borraria details_title y ' +
        'excludes_group_benefits de todos los planes. Si es lo que quieres, repite ' +
        'el comando con ALLOW_DESTRUCTIVE_MIGRATION=true.',
    )
  }

  await db.execute(sql`
   ALTER TABLE "plans" DROP COLUMN "details_title";
  ALTER TABLE "plans" DROP COLUMN "excludes_group_benefits";`)
}
