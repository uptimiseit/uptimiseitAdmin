"use server";

import { db } from "@/lib/db";
import { blogs, activityLogs } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";

export async function saveBlogPost(formData: any) {
  try {
    const author = formData.author || "Saurabh Sharma";

    // 1. Insert the Blog into the database using categoryId
    await db.insert(blogs).values({
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      // CHANGE: Use categoryId (Number) instead of category (String)
      categoryId: formData.categoryId ? Number(formData.categoryId) : null,
      subCategory: formData.subCategory, 
      tags: formData.tags,
      status: formData.status,
      seoTitle: formData.seoTitle,
      seoDesc: formData.seoDesc,
      focusKeyword: formData.focusKeyword,
      featuredImage: formData.featuredImage,
      author: author,
      isHome: formData.isHome,
      relatedBlogs: formData.relatedBlogs,
    });

    // 2. Insert the Audit Log
    await db.insert(activityLogs).values({
      action: formData.status === "PUBLISHED" ? "Published Blog" : "Saved Blog Draft",
      title: formData.title,
      user: author,
      module: "BLOGS",
    });

    revalidatePath("/admin/blogs");
    revalidatePath("/admin/dashboard");

    return { success: true };

  } catch (error: any) {
    console.error("Database Error:", error);
    if (error.code === '23505') {
      return { success: false, message: "A blog with this URL slug already exists." };
    }
    return { success: false, message: "Failed to save the blog post." };
  }
}

export async function updateBlogPost(id: number, formData: any) {
  try {
    // 1. Fetch current data to prevent overwriting with nulls
    const [existing] = await db.select().from(blogs).where(eq(blogs.id, id));
    if (!existing) return { success: false, message: "Blog not found" };

    const author = formData.author || existing.author;

    // 2. Perform partial update using categoryId
    await db.update(blogs)
      .set({
        title: formData.title ?? existing.title,
        slug: formData.slug ?? existing.slug,
        excerpt: formData.excerpt ?? existing.excerpt,
        content: formData.content ?? existing.content,
        // CHANGE: Map categoryId from formData and ensure it is a Number
        categoryId: formData.categoryId !== undefined ? Number(formData.categoryId) : existing.categoryId,
        subCategory: formData.subCategory ?? existing.subCategory,
        tags: formData.tags ?? existing.tags,
        status: formData.status ?? existing.status,
        seoTitle: formData.seoTitle ?? existing.seoTitle,
        seoDesc: formData.seoDesc ?? existing.seoDesc,
        focusKeyword: formData.focusKeyword ?? existing.focusKeyword,
        featuredImage: formData.featuredImage ?? existing.featuredImage,
        isHome: formData.isHome ?? existing.isHome,
        relatedBlogs: formData.relatedBlogs ?? existing.relatedBlogs,
        author: author,
      })
      .where(eq(blogs.id, id));

    // Optional: Add activity log for updates
    await db.insert(activityLogs).values({
      action: "Updated Blog Post",
      title: formData.title || existing.title,
      user: author,
      module: "BLOGS",
    });

    revalidatePath("/admin/blogs");
    revalidatePath("/admin/dashboard");
    
    return { success: true };
  } catch (error: any) {
    console.error("Update Error:", error);
    if (error.code === '23505') {
      return { success: false, message: "A blog with this URL slug already exists." };
    }
    return { success: false, message: "Failed to update the blog post." };
  }
}

export async function getBlogs() {
  try {
    const allBlogs = await db.select().from(blogs).orderBy(desc(blogs.createdAt));
    return { success: true, data: allBlogs };
  } catch (error: any) {
    console.error("Failed to fetch blogs:", error);
    return { success: false, data: [] };
  }
}

export async function getBlogById(id: number) {
  try {
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id));
    if (!blog) return { success: false, data: null };
    return { success: true, data: blog };
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return { success: false, data: null };
  }
}

export async function deleteBlogPost(id: number) {
  try {
    const [blogToDelete] = await db.select().from(blogs).where(eq(blogs.id, id));
    if (!blogToDelete) {
      return { success: false, message: "Blog not found." };
    }

    await db.delete(blogs).where(eq(blogs.id, id));

    await db.insert(activityLogs).values({
      action: "Deleted Blog Post",
      title: blogToDelete.title,
      user: "System Admin",
      module: "BLOGS",
    });

    revalidatePath("/admin/blogs");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, message: "Failed to delete the blog post." };
  }
}