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