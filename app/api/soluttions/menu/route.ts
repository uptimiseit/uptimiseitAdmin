import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { solutions } from "@/db/schema";
import { desc } from "drizzle-orm";
import { withCors } from "@/lib/cors";

// 1. Handle Preflight OPTIONS request
export async function OPTIONS() {
  return withCors(new NextResponse(null, { status: 204 }));
}

export async function GET() {
  try {
    const menuData = await db
      .select({
        title: solutions.title,
        slug: solutions.slug,
        icon: solutions.icon,
        description: solutions.description,
      })
      .from(solutions)
      .orderBy(desc(solutions.createdAt));

    const response = NextResponse.json({ success: true, data: menuData });
    
    // 2. Wrap response with CORS headers
    return withCors(response);
  } catch (error) {
    return withCors(
      NextResponse.json({ success: false, message: "Fetch failed" }, { status: 500 })
    );
  }
}