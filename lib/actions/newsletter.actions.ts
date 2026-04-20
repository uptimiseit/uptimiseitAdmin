"use server";

import { db } from "@/lib/db";
import { subscribers } from "@/db/schema"; // Ensure this matches your schema name
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getSubscribers() {
  try {
    const data = await db.select().from(subscribers).orderBy(desc(subscribers.createdAt));
    return { success: true, data };
  } catch (error) {
    return { success: false, data: [] };
  }
}

export async function deleteSubscriber(id: number) {
  try {
    await db.delete(subscribers).where(eq(subscribers.id, id));
    revalidatePath("/admin/newsletter");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}