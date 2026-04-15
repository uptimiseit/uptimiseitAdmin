"use server";

import { db } from "@/lib/db";
import { blogs, activityLogs } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { desc, eq } from "drizzle-orm";

export async function saveBlogPost(formData: any) {
  try {
    const author = formData.author || "Saurabh Sharma";

    // 1. Insert the Blog into the database using the schema
   await db.insert(blogs).values({
  title: formData.title,
  slug: formData.slug,
  excerpt: formData.excerpt,
  content: formData.content,
  category: formData.category,
  subCategory: formData.subCategory, 
  tags: formData.tags,
  status: formData.status,
  seoTitle: formData.seoTitle,
  seoDesc: formData.seoDesc,
  focusKeyword: formData.focusKeyword,
  featuredImage: formData.featuredImage,
  author: author,
});

    // 2. Insert the Audit Log
    await db.insert(activityLogs).values({
      action: formData.status === "PUBLISHED" ? "Published Blog" : "Saved Blog Draft",
      title: formData.title,
      user: author,
      module: "BLOGS",
    });

    // 3. Purge the Next.js cache
    revalidatePath("/admin/blogs");
    revalidatePath("/admin/dashboard");

    return { success: true };

  } catch (error: any) {
    console.error("Database Error:", error);
    
    // Postgres unique constraint violation code (e.g., Duplicate Slug)
    if (error.code === '23505') {
      return { success: false, message: "A blog with this URL slug already exists." };
    }
    
    return { success: false, message: "Failed to save the blog post." };
  }
}

export async function getBlogs() {
  try {
    // Fetch all blogs and order them by the newest created date
    const allBlogs = await db.select().from(blogs).orderBy(desc(blogs.createdAt));
    
    return { success: true, data: allBlogs };
  } catch (error: any) {
    console.error("Failed to fetch blogs:", error);
    return { success: false, data: [] };
  }
}



// 1. Fetch a single blog by its ID
export async function getBlogById(id: number) {
  try {
    // Drizzle query to find the blog where id matches
    const [blog] = await db.select().from(blogs).where(eq(blogs.id, id));
    
    if (!blog) return { success: false, data: null };
    return { success: true, data: blog };
  } catch (error) {
    console.error("Failed to fetch blog:", error);
    return { success: false, data: null };
  }
}

// 2. Update an existing blog
export async function updateBlogPost(id: number, formData: any) {
  try {
    const author = formData.author || "Saurabh Sharma";

    // Update the database record
   await db.update(blogs)
  .set({
    title: formData.title,
    slug: formData.slug,
    excerpt: formData.excerpt,
    content: formData.content,
    category: formData.category,
    subCategory: formData.subCategory, 
    tags: formData.tags,
    status: formData.status,
    seoTitle: formData.seoTitle,
    seoDesc: formData.seoDesc,
    focusKeyword: formData.focusKeyword,
    featuredImage: formData.featuredImage,
    author: author,
  })
  .where(eq(blogs.id, id));// Ensure we only update this specific ID

    // Log the activity
    await db.insert(activityLogs).values({
      action: formData.status === "PUBLISHED" ? "Updated & Published Blog" : "Updated Blog Draft",
      title: formData.title,
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


// Add this to the bottom of lib/actions/blog.actions.ts    lib/actions/blog.actions.ts

export async function deleteBlogPost(id: number) {
  try {
    // 1. Fetch the blog first so we know its title for the activity log
    const [blogToDelete] = await db.select().from(blogs).where(eq(blogs.id, id));
    
    if (!blogToDelete) {
      return { success: false, message: "Blog not found." };
    }

    // 2. Delete the record from Neon
    await db.delete(blogs).where(eq(blogs.id, id));

    // 3. Log the deletion for the dashboard
    await db.insert(activityLogs).values({
      action: "Deleted Blog Post",
      title: blogToDelete.title,
      user: "System Admin", // Replace with real user session later
      module: "BLOGS",
    });

    // 4. Purge the cache so the table updates instantly
    revalidatePath("/admin/blogs");
    revalidatePath("/admin/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Delete Error:", error);
    return { success: false, message: "Failed to delete the blog post." };
  }
}