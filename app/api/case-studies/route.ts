import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { caseStudies } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

/**
 * Helper to generate CORS headers
 */
function getCorsHeaders(origin: string | null) {
  // Define allowed origins - replace '*' with your specific domain for better security
  // const allowedOrigins = ["http://localhost:3000", "http://localhost:3001", "https://uptimiseit.com"];
  // const currentOrigin = origin && allowedOrigins.includes(origin) ? origin : allowedOrigins[0];

  return {
    "Access-Control-Allow-Origin": "*", // Or use currentOrigin for stricter security
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

// Handler for OPTIONS (Preflight requests)
export async function OPTIONS(request: Request) {
  const origin = request.headers.get("origin");
  return NextResponse.json({}, { headers: getCorsHeaders(origin) });
}

export async function GET(request: Request) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const limit = searchParams.get("limit");

    let query = db.select().from(caseStudies).orderBy(desc(caseStudies.createdAt));

    if (featured === "true") {
      // @ts-ignore
      query = query.where(eq(caseStudies.isFeatured, true));
    }

    if (limit) {
      // @ts-ignore
      query = query.limit(parseInt(limit));
    }

    const data = await query;

    return NextResponse.json(
      { success: true, count: data.length, data },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("API_FETCH_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch deployment ledger" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const corsHeaders = getCorsHeaders(origin);

  try {
    const body = await request.json();

    const [newRecord] = await db
      .insert(caseStudies)
      .values({
        title: body.title,
        slug: body.slug,
        description: body.description,
        image: body.image,
        tag: body.tag,
        technology: body.technology,
        url: body.url,
        isFeatured: body.isFeatured || false,
        status: body.status || "DRAFT",
      })
      .returning();

    return NextResponse.json(
      { success: true, data: newRecord },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("API_POST_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Initialization failed" },
      { status: 500, headers: corsHeaders }
    );
  }
}