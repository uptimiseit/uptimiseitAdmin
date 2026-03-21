// lib/db.ts
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from '@/db/schema'; // Import your schema file

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env.local');
}

// Create the connection
const sql = neon(process.env.DATABASE_URL);

// Wrap it in Drizzle and pass it your schema
export const db = drizzle(sql, { schema });