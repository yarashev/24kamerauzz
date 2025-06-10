CREATE TABLE "advertisements" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"image_url" text NOT NULL,
	"button_text" text NOT NULL,
	"link" text NOT NULL,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "masters" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"specialization" text NOT NULL,
	"region" text NOT NULL,
	"city" text NOT NULL,
	"phone" text NOT NULL,
	"experience" integer NOT NULL,
	"rating" real DEFAULT 0,
	"review_count" integer DEFAULT 0,
	"image_url" text,
	"description" text,
	"services" text[],
	"full_address" text,
	"telegram" text,
	"instagram" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "password_recovery_brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"logo" text NOT NULL,
	"telegram_support" text,
	"whatsapp_support" text,
	"phone_support" text,
	"email_support" text,
	"is_active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "price_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer,
	"old_price" integer NOT NULL,
	"new_price" integer NOT NULL,
	"change_percentage" real NOT NULL,
	"dollar_rate" integer,
	"brand" text,
	"category" text,
	"changed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"change_reason" text DEFAULT 'Manual adjustment'
);
--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "brand" text NOT NULL;--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "additional_images" json;--> statement-breakpoint
ALTER TABLE "price_history" ADD CONSTRAINT "price_history_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;