
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { blogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? Number(limitParam) : 50;

    const publishedBlogs = await db
      .select()
      .from(blogs)
      .where(eq(blogs.status, "PUBLISHED"))
      .orderBy(desc(blogs.createdAt))
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        count: publishedBlogs.length,
        data: publishedBlogs,
      },
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("API Error fetching blogs:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch blogs." },
      { 
        status: 500, 
        headers: corsHeaders 
      }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}