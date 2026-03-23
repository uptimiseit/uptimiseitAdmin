"use server";

import { db } from "@/lib/db";
import { seoMetadata } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// ==========================================
// 1. READ: Get SEO Data for a specific item
// (e.g., getSeoData("BLOG", 4) or getSeoData("PAGE", 2))
// ==========================================
export async function getSeoData(entityType: string, entityId: number) {
  try {
    const [seo] = await db
      .select()
      .from(seoMetadata)
      .where(
        and(
          eq(seoMetadata.entityType, entityType),
          eq(seoMetadata.entityId, entityId)
        )
      );

    return { success: true, data: seo || null };
  } catch (error) {
    console.error("Failed to fetch SEO data:", error);
    return { success: false, data: null, message: "Failed to fetch SEO data from database." };
  }
}

// ==========================================
// 2. UPSERT: Smart Create or Update
// (Automatically checks if data exists. If yes -> updates it. If no -> creates it.)
// ==========================================
export async function upsertSeoData(entityType: string, entityId: number, seoData: any) {
  try {
    // 1. Check if SEO data already exists for this exact Entity Type and ID
    const existingSeo = await getSeoData(entityType, entityId);

    if (existingSeo.data) {
      // 2a. UPDATE existing record
      await db
        .update(seoMetadata)
        .set({ 
          ...seoData, 
          updatedAt: new Date() 
        })
        .where(eq(seoMetadata.id, existingSeo.data.id));
    } else {
      // 2b. CREATE new record if none exists
      await db.insert(seoMetadata).values({
        entityType,
        entityId,
        ...seoData,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to upsert SEO data:", error);
    return { success: false, message: "Failed to save enterprise SEO metadata." };
  }
}


// Add this to the bottom of lib/actions/seo.actions.ts
export async function getSeoRecordById(id: number) {
  try {
    const [seo] = await db.select().from(seoMetadata).where(eq(seoMetadata.id, id));
    return { success: true, data: seo || null };
  } catch (error) {
    console.error("Failed to fetch SEO record by ID:", error);
    return { success: false, data: null, message: "Failed to fetch record." };
  }
}


// ==========================================
// 3. DELETE: Clean up SEO data
// (Call this when a user deletes a Blog or Page so the SEO data doesn't get left behind)
// ==========================================
export async function deleteSeoData(entityType: string, entityId: number) {
  try {
    await db
      .delete(seoMetadata)
      .where(
        and(
          eq(seoMetadata.entityType, entityType),
          eq(seoMetadata.entityId, entityId)
        )
      );
    return { success: true };
  } catch (error) {
    console.error("Failed to delete SEO data:", error);
    return { success: false, message: "Failed to delete SEO metadata." };
  }
}