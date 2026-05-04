import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { caseStudies } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    // 1. Build Query
    let query = db.select().from(caseStudies).orderBy(desc(caseStudies.createdAt));

    // 2. Apply "Featured" filter if requested (for Homepage Grid)
    if (featured === "true") {
      // @ts-ignore - Drizzle query builder typing
      query = query.where(eq(caseStudies.isFeatured, true));
    }

    // 3. Apply Limit if requested
    if (limit) {
      // @ts-ignore
      query = query.limit(parseInt(limit));
    }

    const data = await query;

    return NextResponse.json({ 
      success: true, 
      count: data.length,
      data 
    });

  } catch (error) {
    console.error("API_FETCH_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch deployment ledger" }, 
      { status: 500 }
    );
  }
}

// Handler for POST (Create)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const [newRecord] = await db.insert(caseStudies).values({
      title: body.title,
      slug: body.slug,
      description: body.description,
      image: body.image,
      tag: body.tag,
      technology: body.technology,
      url: body.url,
      isFeatured: body.isFeatured || false,
      status: body.status || "DRAFT",
    }).returning();

    return NextResponse.json({ success: true, data: newRecord });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Initialization failed" }, { status: 500 });
  }
}