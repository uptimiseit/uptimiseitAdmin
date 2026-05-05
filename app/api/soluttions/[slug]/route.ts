import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { solutions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { withCors } from "@/lib/cors";

export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
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
    return withCors(
      NextResponse.json({ success: false, message: "Error" }, { status: 500 })
    );
  }
}