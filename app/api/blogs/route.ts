import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : 50;

    // CHANGE: Removed the specific fields from .select()
    // By calling .select() with NO arguments, Drizzle fetches ALL columns from the table
    const publishedBlogs = await db
      .select() 
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