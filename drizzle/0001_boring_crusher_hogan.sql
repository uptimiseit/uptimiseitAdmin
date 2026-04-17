ALTER TABLE "briefs" ADD COLUMN "country_code" varchar(10) NOT NULL;--> statement-breakpoint
ALTER TABLE "briefs" ADD COLUMN "mobile_number" varchar(20) NOT NULL;--> statement-breakpoint
ALTER TABLE "briefs" ADD COLUMN "document_url" text;