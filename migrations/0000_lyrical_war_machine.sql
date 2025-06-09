CREATE TABLE "articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"image_url" text NOT NULL,
	"published_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "cart_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" text NOT NULL,
	"message" text NOT NULL,
	"response" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"price" real NOT NULL,
	"category" text NOT NULL,
	"image_url" text NOT NULL,
	"in_stock" boolean DEFAULT true NOT NULL,
	"features" json
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;