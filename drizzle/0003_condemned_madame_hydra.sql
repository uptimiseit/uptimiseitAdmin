CREATE TABLE "partner_intake" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" varchar(255) NOT NULL,
	"work_email" varchar(255) NOT NULL,
	"company_name" varchar(255),
	"country" varchar(100) NOT NULL,
	"partner_type" varchar(100) NOT NULL,
	"message" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
