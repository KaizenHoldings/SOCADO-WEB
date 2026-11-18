import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Crea `plans_details`, la lista del modal "más información" de cada plan.
 *
 * Va aparte de `20261113_140852_workclub_tables` porque el campo `details` se
 * añadió despues de generar aquella: aquella migracion deja `plans`,
 * `pass_types` y `workclub_settings` en su sitio, y el servidor sigue fallando
 * en esta tabla hasta que corre esta.
 *
 * NO BORRA NADA. El `up` solo crea: ni un DROP, ni un ALTER sobre lo que ya
 * existe. Y es idempotente — tabla e indices con `IF NOT EXISTS`, y la clave
 * foranea envuelta porque postgres no admite `IF NOT EXISTS` ahi — asi que se
 * puede repetir sin consecuencias y no aborta si algo de esto ya estaba.
 *
 * El `down` si borra, y por eso esta cerrado con llave. Lee su nota.
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
  CREATE TABLE IF NOT EXISTS "plans_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );

  DO $$ BEGIN
    ALTER TABLE "plans_details" ADD CONSTRAINT "plans_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;

  CREATE INDEX IF NOT EXISTS "plans_details_order_idx" ON "plans_details" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "plans_details_parent_id_idx" ON "plans_details" USING btree ("_parent_id");`)
}

/**
 * Deshace lo anterior, lo que significa BORRAR `plans_details` y con ella la
 * lista de detalles de todos los planes.
 *
 * Bloqueado a proposito, igual que el de la migracion anterior: en produccion
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
      'migrate:down de 20261118_114212_plan_details borraria plans_details y la ' +
        'lista de detalles de todos los planes. Si es lo que quieres, repite el ' +
        'comando con ALLOW_DESTRUCTIVE_MIGRATION=true.',
    )
  }

  await db.execute(sql`
   DROP TABLE "plans_details" CASCADE;`)
}
