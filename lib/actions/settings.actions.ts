"use server";

import { db } from "@/lib/db";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Always fetch record ID 1
export async function getGlobalSettings() {
  try {
    const [settings] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1));
    return { success: true, data: settings || null };
  } catch (error) {
    console.error("Failed to fetch site settings:", error);
    return { success: false, data: null };
  }
}

// Smart Upsert for record ID 1
export async function upsertGlobalSettings(payload: any) {
  try {
    const existing = await getGlobalSettings();

    if (existing.data) {
      // Update existing record
      await db.update(siteSettings).set({
        ...payload,
        updatedAt: new Date(),
      }).where(eq(siteSettings.id, 1));
    } else {
      // Create the very first record
      await db.insert(siteSettings).values({
        id: 1, // Force ID 1
        ...payload,
      });
    }

    // Refresh the whole site cache so frontend updates instantly
    revalidatePath("/", "layout"); 
    return { success: true };
  } catch (error) {
    console.error("Failed to save settings:", error);
    return { success: false, message: "Failed to save global settings." };
  }
}