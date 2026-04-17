CREATE TABLE "activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"action" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"user" varchar(255) NOT NULL,
	"module" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "blogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" text,
	"content" text NOT NULL,
	"category" varchar(100),
	"sub_category" text,
	"tags" varchar(255),
	"status" varchar(50) DEFAULT 'DRAFT',
	"seo_title" varchar(255),
	"seo_desc" text,
	"focus_keyword" varchar(255),
	"author" varchar(255) DEFAULT 'Saurabh Sharma',
	"featured_image" varchar(500),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "blogs_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "briefs" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"department" varchar(100) NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "case_studies" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"summary" text,
	"project_type" varchar(50) DEFAULT 'CLIENT',
	"industry" varchar(100),
	"status" varchar(50) DEFAULT 'DRAFT',
	"is_featured" boolean DEFAULT false,
	"is_confidential" boolean DEFAULT false,
	"client_info" jsonb,
	"hero_section" jsonb,
	"problem_section" jsonb,
	"solution_section" jsonb,
	"tech_stack" jsonb,
	"development_process" jsonb,
	"results" jsonb,
	"visuals" jsonb,
	"testimonial" jsonb,
	"cta_section" jsonb,
	"related_content" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "case_studies_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "lead_notes" (
	"id" serial PRIMARY KEY NOT NULL,
	"lead_id" integer NOT NULL,
	"note" text NOT NULL,
	"created_by" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"phone" varchar(50),
	"company" varchar(255),
	"designation" varchar(255),
	"project_title" varchar(255),
	"message" text,
	"service_interest" varchar(100),
	"budget" varchar(100),
	"timeline" varchar(100),
	"source_type" varchar(100),
	"source_page" varchar(500),
	"status" varchar(50) DEFAULT 'NEW',
	"priority" varchar(20) DEFAULT 'MEDIUM',
	"assigned_to" varchar(100),
	"deal_value" integer DEFAULT 0,
	"next_followup_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "project_intake" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"work_email" varchar(255) NOT NULL,
	"company_name" varchar(255),
	"company_stage" varchar(100) NOT NULL,
	"linkedin_url" text,
	"project_context" text NOT NULL,
	"country_code" varchar(10) NOT NULL,
	"mobile_number" varchar(20) NOT NULL,
	"document_url" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "seo_metadata" (
	"id" serial PRIMARY KEY NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" integer NOT NULL,
	"page_title" varchar(255),
	"meta_title" varchar(255),
	"meta_desc" text,
	"canonical_url" varchar(500),
	"og_title" varchar(255),
	"og_desc" text,
	"og_image" varchar(500),
	"og_type" varchar(50) DEFAULT 'website',
	"is_indexable" boolean DEFAULT true,
	"follow_links" boolean DEFAULT true,
	"schema_type" varchar(100),
	"schema_markup" jsonb,
	"focus_keyword" varchar(255),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"company_name" varchar(255) DEFAULT 'Uptimise IT' NOT NULL,
	"site_url" varchar(255) DEFAULT 'https://uptimiseit.com' NOT NULL,
	"logo_url" varchar(500),
	"favicon_url" varchar(500),
	"support_email" varchar(255),
	"sales_email" varchar(255),
	"contact_phone" varchar(50),
	"address" text,
	"social_links" jsonb,
	"maintenance_mode" boolean DEFAULT false,
	"updated_at" timestamp DEFAULT now()
);
