// db/schema.ts
import { pgTable, serial, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";

// Define the Blogs Table Schema
export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt"),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }),
  tags: varchar("tags", { length: 255 }),
  status: varchar("status", { length: 50 }).default("DRAFT"),
  seoTitle: varchar("seo_title", { length: 255 }),
  seoDesc: text("seo_desc"),
  focusKeyword: varchar("focus_keyword", { length: 255 }),
  author: varchar("author", { length: 255 }).default("Saurabh Sharma"),
  featuredImage: varchar("featured_image", { length: 500 }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Define the Activity Logs Table Schema
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  action: varchar("action", { length: 255 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  user: varchar("user", { length: 255 }).notNull(),
  module: varchar("module", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const seoMetadata = pgTable("seo_metadata", {
  id: serial("id").primaryKey(),
  
  // The Polymorphic Link (Connects this row to ANY content type)
  entityType: varchar("entity_type", { length: 50 }).notNull(), // e.g., 'BLOG', 'SERVICE', 'SOLUTION', 'PAGE'
  entityId: integer("entity_id").notNull(), // e.g., Blog ID 4
  
  // Core Meta
  pageTitle: varchar("page_title", { length: 255 }), // <-- NEW FIELD ADDED HERE
  metaTitle: varchar("meta_title", { length: 255 }),
  metaDesc: text("meta_desc"),
  canonicalUrl: varchar("canonical_url", { length: 500 }),
  
  // OpenGraph (Social)
  ogTitle: varchar("og_title", { length: 255 }),
  ogDesc: text("og_desc"),
  ogImage: varchar("og_image", { length: 500 }),
  ogType: varchar("og_type", { length: 50 }).default("website"),
  
  // Technical Rules
  isIndexable: boolean("is_indexable").default(true),
  followLinks: boolean("follow_links").default(true),
  
  // Advanced Schema & Intelligence
  schemaType: varchar("schema_type", { length: 100 }),
  schemaMarkup: jsonb("schema_markup"), // Stores the raw JSON-LD
  focusKeyword: varchar("focus_keyword", { length: 255 }),
  
  updatedAt: timestamp("updated_at").defaultNow(),
});



export const caseStudies = pgTable("case_studies", {
  id: serial("id").primaryKey(),
  
  // Core Info
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  summary: text("summary"),
  projectType: varchar("project_type", { length: 50 }).default("CLIENT"), // CLIENT, INTERNAL, CONCEPT
  industry: varchar("industry", { length: 100 }),
  
  // Status & Toggles
  status: varchar("status", { length: 50 }).default("DRAFT"), // DRAFT, PUBLISHED
  isFeatured: boolean("is_featured").default(false),
  isConfidential: boolean("is_confidential").default(false), // Hides client name if true
  
  // Complex JSONB Data Structures (Matches your spec perfectly)
  clientInfo: jsonb("client_info"),     // { name, type, location, duration, logo, website }
  heroSection: jsonb("hero_section"),   // { title, subtitle, desc, image, primaryCta, secondaryCta }
  problemSection: jsonb("problem_section"), // { title, desc, challenges: [{ title, desc }] }
  solutionSection: jsonb("solution_section"),// { title, desc, features: [{ title, desc, impact }] }
  techStack: jsonb("tech_stack"),       // [{ name, category, usage }]
  developmentProcess: jsonb("development_process"), // [{ step, title, desc }]
  results: jsonb("results"),            // [{ metric, value, desc }]
  visuals: jsonb("visuals"),            // [{ image, caption }]
  testimonial: jsonb("testimonial"),    // { clientName, designation, company, text, image }
  ctaSection: jsonb("cta_section"),     // { title, desc, buttonText, buttonLink }
  
  // Relations (Internal Linking Strategy)
  relatedContent: jsonb("related_content"), // { serviceIds: [], solutionIds: [], blogIds: [] }

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});







// Add this to the bottom of db/schema.ts

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  
  // 1. Basic Contact Info
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  company: varchar("company", { length: 255 }),
  designation: varchar("designation", { length: 255 }),
  
  // 2. Project & Inquiry Details
  projectTitle: varchar("project_title", { length: 255 }),
  message: text("message"),
  serviceInterest: varchar("service_interest", { length: 100 }), // e.g., "AI Development", "SaaS"
  budget: varchar("budget", { length: 100 }), // e.g., "$10k - $25k"
  timeline: varchar("timeline", { length: 100 }), // e.g., "Within 1 month"
  
  // 3. Source & Tracking (Crucial for Marketing ROI)
  sourceType: varchar("source_type", { length: 100 }), // Contact Form, Blog CTA, Partner
  sourcePage: varchar("source_page", { length: 500 }), // Exactly what URL they converted on
  
  // 4. CRM Pipeline & Assignment
  status: varchar("status", { length: 50 }).default("NEW"), // NEW, CONTACTED, QUALIFIED, PROPOSAL, WON, LOST
  priority: varchar("priority", { length: 20 }).default("MEDIUM"), // LOW, MEDIUM, HIGH
  assignedTo: varchar("assigned_to", { length: 100 }), // Name or ID of sales rep
  
  // 5. Conversion Tracking
  dealValue: integer("deal_value").default(0), // Revenue value if won
  nextFollowupDate: timestamp("next_followup_date"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relational Table for Timeline & Notes
export const leadNotes = pgTable("lead_notes", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").notNull(), // Connects back to the leads table
  note: text("note").notNull(),
  createdBy: varchar("created_by", { length: 100 }).notNull(), // Who wrote the note
  createdAt: timestamp("created_at").defaultNow(),
});