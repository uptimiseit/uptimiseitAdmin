import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { caseStudies } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const id = parseInt(params.id);

    await db.update(caseStudies)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(caseStudies.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    await db.delete(caseStudies).where(eq(caseStudies.id, id));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}