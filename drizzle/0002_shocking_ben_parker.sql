CREATE TABLE "subscribers" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'ACTIVE',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "is_home" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "blogs" ADD COLUMN "related_blogs" text DEFAULT '[]';