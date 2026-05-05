"use server";

import { db } from "@/lib/db";
import { solutions } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";


export async function getSolutionsMenu() {
  try {
    const data = await db
      .select({
        id: solutions.id,
        title: solutions.title,
        slug: solutions.slug,
        description: solutions.description,
        icon: solutions.icon,
      })
      .from(solutions)
      .orderBy(desc(solutions.createdAt));

    return { success: true, data };
  } catch (error) {
    console.error("GET_SOLUTIONS_MENU_ERROR:", error);
    return { success: false, data: [] };
  }
}

/**
 * READ: Fetch full solution data by slug
 * Used by app/solutions/[slug]/page.tsx to hydrate the 9 sections
 */
export async function getSolutionBySlug(slug: string) {
  try {
    const [data] = await db
      .select()
      .from(solutions)
      .where(eq(solutions.slug, slug));

    return { success: true, data: data || null };
  } catch (error) {
    console.error("GET_SOLUTION_BY_SLUG_ERROR:", error);
    return { success: false, data: null };
  }
}

/**
 * READ: Fetch single solution by ID
 * Used by app/admin/solutions/edit/[id]/page.tsx
 */
export async function getSolutionById(id: number) {
  try {
    const [data] = await db
      .select()
      .from(solutions)
      .where(eq(solutions.id, id));

    return { success: true, data: data || null };
  } catch (error) {
    console.error("GET_SOLUTION_BY_ID_ERROR:", error);
    return { success: false, data: null };
  }
}

/**
 * CREATE / UPDATE: Save solution data
 * Handles both the metadata and the JSONB content field
 */
export async function saveSolution(payload: any) {
  try {
    const { id, ...values } = payload;

    if (id) {
      // Update existing record
      await db
        .update(solutions)
        .set({
          ...values,
          updatedAt: new Date(),
        })
        .where(eq(solutions.id, id));
    } else {
      // Insert new record
      await db.insert(solutions).values(values);
    }

    // Clear caches so the submenu and pages update immediately
    revalidatePath("/");
    revalidatePath("/solutions");
    revalidatePath("/admin/solutions");
    
    return { success: true };
  } catch (error) {
    console.error("SAVE_SOLUTION_ERROR:", error);
    return { success: false, message: "Failed to save solution node." };
  }
}

/**
 * DELETE: Remove a solution node
 */
export async function deleteSolution(id: number) {
  try {
    await db.delete(solutions).where(eq(solutions.id, id));
    
    revalidatePath("/");
    revalidatePath("/admin/solutions");
    
    return { success: true };
  } catch (error) {
    console.error("DELETE_SOLUTION_ERROR:", error);
    return { success: false, message: "Failed to terminate solution node." };
  }
}