import { NextResponse, NextRequest } from "next/server";
import { db } from "@/lib/db";
import { solutions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { withCors } from "@/lib/cors";

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

// Update the type definition for params to be a Promise
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> } 
) {
  try {
    // CRITICAL: You must await params in Next.js 15
    const { slug } = await params; 

    const [solutionData] = await db
      .select()
      .from(solutions)
      .where(eq(solutions.slug, slug));

    if (!solutionData) {
      return withCors(
        NextResponse.json({ success: false, message: "Not Found" }, { status: 404 })
      );
    }

    return withCors(NextResponse.json({ success: true, data: solutionData }));
  } catch (error) {
    console.error("API_ERROR:", error);
    return withCors(
      NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 })
    );
  }
}