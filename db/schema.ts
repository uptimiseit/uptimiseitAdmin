// db/schema.ts
import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

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