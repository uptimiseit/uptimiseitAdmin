"use server";

import { db } from "@/lib/db";
import { caseStudies } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getCaseStudies() {
  try {
    const data = await db.select().from(caseStudies).orderBy(desc(caseStudies.createdAt));
    return { success: true, data };
  } catch (error) {
    console.error("Failed to fetch case studies:", error);
    return { success: false, data: [] };
  }
}

export async function deleteCaseStudy(entityType: string, id: number) {
  try {
    await db.delete(caseStudies).where(eq(caseStudies.id, id));
    // Note: We will also delete the attached SEO data here later!
    revalidatePath("/admin/case-studies");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete case study:", error);
    return { success: false, message: "Failed to delete case study." };
  }
}

export async function createCaseStudy(payload: any) {
  try {
    const [newStudy] = await db.insert(caseStudies).values({
      title: payload.title,
      slug: payload.slug,
      summary: payload.summary,
      projectType: payload.projectType,
      industry: payload.industry,
      status: payload.status,
      isFeatured: payload.isFeatured,
      isConfidential: payload.isConfidential,
      
      // JSONB Fields
      clientInfo: payload.clientInfo,
      heroSection: payload.heroSection,
      problemSection: payload.problemSection,
      solutionSection: payload.solutionSection,
      results: payload.results,
    }).returning({ id: caseStudies.id });

    revalidatePath("/admin/case-studies");
    return { success: true, id: newStudy.id };
  } catch (error) {
    console.error("Failed to create case study:", error);
    return { success: false, message: "Failed to create case study." };
  }
}



// Fetch a single Case Study by ID
export async function getCaseStudyById(id: number) {
  try {
    const [study] = await db.select().from(caseStudies).where(eq(caseStudies.id, id));
    return { success: true, data: study || null };
  } catch (error) {
    console.error("Failed to fetch case study:", error);
    return { success: false, data: null };
  }
}

// Update an existing Case Study
export async function updateCaseStudy(id: number, payload: any) {
  try {
    await db.update(caseStudies).set({
      title: payload.title,
      slug: payload.slug,
      summary: payload.summary,
      projectType: payload.projectType,
      industry: payload.industry,
      status: payload.status,
      isFeatured: payload.isFeatured,
      isConfidential: payload.isConfidential,
      
      // JSONB Fields
      clientInfo: payload.clientInfo,
      heroSection: payload.heroSection,
      problemSection: payload.problemSection,
      solutionSection: payload.solutionSection,
      results: payload.results,
      techStack: payload.techStack,
      developmentProcess: payload.developmentProcess,
      testimonial: payload.testimonial,
      ctaSection: payload.ctaSection,
      
      updatedAt: new Date(),
    }).where(eq(caseStudies.id, id));

    revalidatePath("/admin/case-studies");
    return { success: true };
  } catch (error) {
    console.error("Failed to update case study:", error);
    return { success: false, message: "Failed to update case study." };
  }
}