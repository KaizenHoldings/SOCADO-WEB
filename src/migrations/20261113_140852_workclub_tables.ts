import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

/**
 * Lleva la base de datos desde el snapshot de junio hasta el esquema actual.
 *
 * Hace falta porque el adaptador de postgres solo empuja el esquema fuera de
 * produccion — `if (process.env.NODE_ENV !== 'production' ... ) pushDevSchema()`
 * —, asi que en el servidor las tablas nuevas no se crean solas y `next build`
 * revienta al pedir `workclub_settings`.
 *
 * ESTA MIGRACION NO BORRA NADA.
 *
 * El `up` solo crea y añade. Lo unico que parece destructivo son seis
 * `ALTER COLUMN ... DROP NOT NULL`, que relajan una restriccion: no tocan
 * datos. No hay ningun DROP TABLE, DROP COLUMN ni DROP CONSTRAINT.
 *
 * Ademas es idempotente. Todo va con `IF NOT EXISTS`, y los tipos enum y las
 * claves foraneas — que en postgres no admiten `IF NOT EXISTS` — van envueltos
 * en un bloque que se traga el duplicado. Eso importa porque el estado real de
 * produccion no se conoce: el snapshot de junio es el unico registro que hay y
 * puede no coincidir. Asi la migracion crea lo que falte y pasa de largo por
 * lo que ya este, en lugar de abortar a la primera colision.
 *
 * Supone que lo del snapshot de junio ya existe en la base. Contra una base
 * vacia no sirve: ahi hay que empujar el esquema con `next dev` o generar una
 * migracion inicial completa.
 *
 * El `down` si borra — tiene que, es la vuelta atras — y por eso esta cerrado
 * con llave. Lee su nota antes de abrirlo.
 */

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_pass_types_blocks_table_layout" AS ENUM('inline', 'split');
   EXCEPTION WHEN duplicate_object THEN null;
   END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pass_types_band_color" AS ENUM('wc-verde', 'wc-verde-medio', 'wc-verde-claro', 'wc-marron', 'wc-marron-medio', 'wc-terracota');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_pass_types_cta_variant_default" AS ENUM('outline', 'solid');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_plans_price_mode" AS ENUM('single', 'rooms');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_plans_cta_variant" AS ENUM('outline', 'solid');
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE TABLE IF NOT EXISTS "products_variations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"price" numeric,
  	"description" varchar,
  	"image_id" integer,
  	"price_adjustment" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "cat_combos_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "home_menu_sections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"description" varchar,
  	"image_id" integer,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pass_types_blocks_includes_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"detail" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pass_types_blocks_includes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pass_types_blocks_table_rows" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"value" varchar NOT NULL,
  	"note" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pass_types_blocks_table" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"layout" "enum_pass_types_blocks_table_layout" DEFAULT 'inline' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "pass_types" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"eyebrow" varchar DEFAULT 'socado',
  	"description" varchar,
  	"note" varchar,
  	"note_highlight" varchar,
  	"band_color" "enum_pass_types_band_color" DEFAULT 'wc-verde',
  	"footnote_label" varchar,
  	"footnote_text" varchar,
  	"cta_label_default" varchar DEFAULT 'reservar',
  	"cta_variant_default" "enum_pass_types_cta_variant_default" DEFAULT 'outline',
  	"order" numeric DEFAULT 1,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "plans_rooms" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"price" numeric,
  	"unit" varchar DEFAULT '/h'
  );
  
  CREATE TABLE IF NOT EXISTS "plans_chips" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "plans_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "plans" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"pass_type_id" integer NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"price_mode" "enum_plans_price_mode" DEFAULT 'single' NOT NULL,
  	"price_prefix" varchar DEFAULT 'ref.',
  	"price" numeric,
  	"price_suffix" varchar,
  	"price_unit" varchar,
  	"rooms_note" varchar,
  	"secondary_line" varchar,
  	"highlight" varchar,
  	"cta_label" varchar,
  	"cta_variant" "enum_plans_cta_variant",
  	"cta_url" varchar,
  	"order" numeric DEFAULT 1,
  	"active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "workclub_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reserva_url" varchar,
  	"visita_url" varchar,
  	"seed_version" numeric,
  	"footnote" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "categories" ALTER COLUMN "macro_category_id" DROP NOT NULL;
  ALTER TABLE "subcategories" ALTER COLUMN "parent_category_id" DROP NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "macro_category_id" DROP NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "category_id" DROP NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "sub_category_id" DROP NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "image_id" DROP NOT NULL;
  ALTER TABLE "subcategories" ADD COLUMN IF NOT EXISTS "min_quantity" numeric DEFAULT 5;
  ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "description" varchar;
  ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "document_id" varchar;
  ALTER TABLE "quotes" ADD COLUMN IF NOT EXISTS "event_location" jsonb;
  ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "title_line1" varchar;
  ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "title_line2" varchar;
  ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "address" varchar;
  ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "amenities_kids_corner" boolean DEFAULT false;
  ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "amenities_parking" boolean DEFAULT false;
  ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "amenities_pet_friendly" boolean DEFAULT false;
  ALTER TABLE "stores" ADD COLUMN IF NOT EXISTS "amenities_free_wifi" boolean DEFAULT false;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "home_menu_sections_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "pass_types_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "plans_id" integer;
  DO $$ BEGIN
    ALTER TABLE "products_variations" ADD CONSTRAINT "products_variations_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "products_variations" ADD CONSTRAINT "products_variations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "cat_combos_rels" ADD CONSTRAINT "cat_combos_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."cat_combos"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "cat_combos_rels" ADD CONSTRAINT "cat_combos_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "home_menu_sections" ADD CONSTRAINT "home_menu_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pass_types_blocks_includes_items" ADD CONSTRAINT "pass_types_blocks_includes_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pass_types_blocks_includes"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pass_types_blocks_includes" ADD CONSTRAINT "pass_types_blocks_includes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pass_types"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pass_types_blocks_table_rows" ADD CONSTRAINT "pass_types_blocks_table_rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pass_types_blocks_table"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "pass_types_blocks_table" ADD CONSTRAINT "pass_types_blocks_table_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pass_types"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "plans_rooms" ADD CONSTRAINT "plans_rooms_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "plans_chips" ADD CONSTRAINT "plans_chips_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "plans_features" ADD CONSTRAINT "plans_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "plans" ADD CONSTRAINT "plans_pass_type_id_pass_types_id_fk" FOREIGN KEY ("pass_type_id") REFERENCES "public"."pass_types"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "products_variations_order_idx" ON "products_variations" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "products_variations_parent_id_idx" ON "products_variations" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "products_variations_image_idx" ON "products_variations" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "products_rels_media_id_idx" ON "products_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "cat_combos_rels_order_idx" ON "cat_combos_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "cat_combos_rels_parent_idx" ON "cat_combos_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "cat_combos_rels_path_idx" ON "cat_combos_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "cat_combos_rels_products_id_idx" ON "cat_combos_rels" USING btree ("products_id");
  CREATE INDEX IF NOT EXISTS "home_menu_sections_image_idx" ON "home_menu_sections" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "home_menu_sections_updated_at_idx" ON "home_menu_sections" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "home_menu_sections_created_at_idx" ON "home_menu_sections" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "pass_types_blocks_includes_items_order_idx" ON "pass_types_blocks_includes_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pass_types_blocks_includes_items_parent_id_idx" ON "pass_types_blocks_includes_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pass_types_blocks_includes_order_idx" ON "pass_types_blocks_includes" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pass_types_blocks_includes_parent_id_idx" ON "pass_types_blocks_includes" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pass_types_blocks_includes_path_idx" ON "pass_types_blocks_includes" USING btree ("_path");
  CREATE INDEX IF NOT EXISTS "pass_types_blocks_table_rows_order_idx" ON "pass_types_blocks_table_rows" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pass_types_blocks_table_rows_parent_id_idx" ON "pass_types_blocks_table_rows" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pass_types_blocks_table_order_idx" ON "pass_types_blocks_table" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "pass_types_blocks_table_parent_id_idx" ON "pass_types_blocks_table" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "pass_types_blocks_table_path_idx" ON "pass_types_blocks_table" USING btree ("_path");
  CREATE UNIQUE INDEX IF NOT EXISTS "pass_types_slug_idx" ON "pass_types" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "pass_types_updated_at_idx" ON "pass_types" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "pass_types_created_at_idx" ON "pass_types" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "plans_rooms_order_idx" ON "plans_rooms" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "plans_rooms_parent_id_idx" ON "plans_rooms" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "plans_chips_order_idx" ON "plans_chips" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "plans_chips_parent_id_idx" ON "plans_chips" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "plans_features_order_idx" ON "plans_features" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "plans_features_parent_id_idx" ON "plans_features" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "plans_slug_idx" ON "plans" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "plans_pass_type_idx" ON "plans" USING btree ("pass_type_id");
  CREATE INDEX IF NOT EXISTS "plans_updated_at_idx" ON "plans" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "plans_created_at_idx" ON "plans" USING btree ("created_at");
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_home_menu_sections_fk" FOREIGN KEY ("home_menu_sections_id") REFERENCES "public"."home_menu_sections"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pass_types_fk" FOREIGN KEY ("pass_types_id") REFERENCES "public"."pass_types"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_plans_fk" FOREIGN KEY ("plans_id") REFERENCES "public"."plans"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION WHEN duplicate_object THEN null;
  END $$;
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_home_menu_sections_id_idx" ON "payload_locked_documents_rels" USING btree ("home_menu_sections_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pass_types_id_idx" ON "payload_locked_documents_rels" USING btree ("pass_types_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_plans_id_idx" ON "payload_locked_documents_rels" USING btree ("plans_id");`)
}

/**
 * Deshace lo anterior, lo que significa BORRAR las tablas que el `up` creo y
 * todo lo que contengan: plans, pass_types, workclub_settings,
 * home_menu_sections, las variaciones de productos y sus relaciones.
 *
 * Esta bloqueado a proposito. En produccion basta un `payload migrate:down`
 * de mas — o un `migrate:refresh`, o un `migrate:reset` — para perder datos
 * que no estan en ningun otro sitio. Para ejecutarlo de verdad hay que
 * pedirlo de forma explicita:
 *
 *   ALLOW_DESTRUCTIVE_MIGRATION=true payload migrate:down
 *
 * Si no quieres esta guarda, borra el `if` y ya esta.
 */
export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  if (process.env.ALLOW_DESTRUCTIVE_MIGRATION !== 'true') {
    throw new Error(
      'migrate:down de 20261113_140852_workclub_tables borraria tablas con datos ' +
        '(plans, pass_types, workclub_settings, home_menu_sections y las ' +
        'variaciones de productos). Si es lo que quieres, repite el comando con ' +
        'ALLOW_DESTRUCTIVE_MIGRATION=true.',
    )
  }

  await db.execute(sql`
   ALTER TABLE "products_variations" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cat_combos_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_menu_sections" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pass_types_blocks_includes_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pass_types_blocks_includes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pass_types_blocks_table_rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pass_types_blocks_table" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pass_types" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "plans_rooms" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "plans_chips" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "plans_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "plans" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "workclub_settings" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products_variations" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "cat_combos_rels" CASCADE;
  DROP TABLE "home_menu_sections" CASCADE;
  DROP TABLE "pass_types_blocks_includes_items" CASCADE;
  DROP TABLE "pass_types_blocks_includes" CASCADE;
  DROP TABLE "pass_types_blocks_table_rows" CASCADE;
  DROP TABLE "pass_types_blocks_table" CASCADE;
  DROP TABLE "pass_types" CASCADE;
  DROP TABLE "plans_rooms" CASCADE;
  DROP TABLE "plans_chips" CASCADE;
  DROP TABLE "plans_features" CASCADE;
  DROP TABLE "plans" CASCADE;
  DROP TABLE "workclub_settings" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_home_menu_sections_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pass_types_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_plans_fk";
  
  DROP INDEX "payload_locked_documents_rels_home_menu_sections_id_idx";
  DROP INDEX "payload_locked_documents_rels_pass_types_id_idx";
  DROP INDEX "payload_locked_documents_rels_plans_id_idx";
  ALTER TABLE "categories" ALTER COLUMN "macro_category_id" SET NOT NULL;
  ALTER TABLE "subcategories" ALTER COLUMN "parent_category_id" SET NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "macro_category_id" SET NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "category_id" SET NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "sub_category_id" SET NOT NULL;
  ALTER TABLE "products" ALTER COLUMN "image_id" SET NOT NULL;
  ALTER TABLE "subcategories" DROP COLUMN "min_quantity";
  ALTER TABLE "products" DROP COLUMN "description";
  ALTER TABLE "quotes" DROP COLUMN "document_id";
  ALTER TABLE "quotes" DROP COLUMN "event_location";
  ALTER TABLE "stores" DROP COLUMN "title_line1";
  ALTER TABLE "stores" DROP COLUMN "title_line2";
  ALTER TABLE "stores" DROP COLUMN "address";
  ALTER TABLE "stores" DROP COLUMN "amenities_kids_corner";
  ALTER TABLE "stores" DROP COLUMN "amenities_parking";
  ALTER TABLE "stores" DROP COLUMN "amenities_pet_friendly";
  ALTER TABLE "stores" DROP COLUMN "amenities_free_wifi";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "home_menu_sections_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pass_types_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "plans_id";
  DROP TYPE "public"."enum_pass_types_blocks_table_layout";
  DROP TYPE "public"."enum_pass_types_band_color";
  DROP TYPE "public"."enum_pass_types_cta_variant_default";
  DROP TYPE "public"."enum_plans_price_mode";
  DROP TYPE "public"."enum_plans_cta_variant";`)
}
