import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// --- GET: Fetch all categories ---
export async function GET() {
  try {
    const data = await db
      .select()
      .from(categories)
      .orderBy(desc(categories.createdAt));

    return NextResponse.json({ success: true, data }, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Read error" }, { status: 500, headers: corsHeaders });
  }
}

// --- POST: Create a new category ---
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description } = body;

    const newCategory = await db.insert(categories).values({
      name,
      slug,
      description,
    }).returning();

    return NextResponse.json({ success: true, data: newCategory[0] }, { status: 201, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Creation failed" }, { status: 400, headers: corsHeaders });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}