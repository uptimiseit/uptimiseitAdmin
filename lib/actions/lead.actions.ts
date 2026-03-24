"use server";

import { db } from "@/lib/db";
import { leads, leadNotes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getLeads() {
  try {
    const data = await db.select().from(leads).orderBy(desc(leads.createdAt));
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    return { success: false, data: [] };
  }
}

export async function deleteLead(id: number) {
  try {
    // 1. Delete associated notes first (to prevent foreign key constraint errors later)
    await db.delete(leadNotes).where(eq(leadNotes.leadId, id));
    // 2. Delete the lead
    await db.delete(leads).where(eq(leads.id, id));
    
    revalidatePath("/admin/leads");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete lead:", error);
    return { success: false, message: "Failed to delete lead." };
  }
}