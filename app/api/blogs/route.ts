import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    // Optional: Get a limit from the URL (e.g., /api/blogs?limit=10)
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : 50;

    // Fetch ONLY published blogs, newest first
    const publishedBlogs = await db
      .select({
        // We selectively return fields so we don't send massive HTML content payloads
        // for the listing page, which keeps the API lightning fast.
        id: blogs.id,
        title: blogs.title,
        slug: blogs.slug,
        excerpt: blogs.excerpt,
        featuredImage: blogs.featuredImage,
        category: blogs.category,
        author: blogs.author,
        createdAt: blogs.createdAt,
      })
      .from(blogs)
      .where(eq(blogs.status, "PUBLISHED"))
      .orderBy(desc(blogs.createdAt))
      .limit(limit);

    return NextResponse.json({ 
      success: true, 
      count: publishedBlogs.length,
      data: publishedBlogs 
    }, { status: 200 });

  } catch (error) {
    console.error("API Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blogs." }, 
      { status: 500 }
    );
  }
}