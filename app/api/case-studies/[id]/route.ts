// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { caseStudies } from "@/db/schema";
// import { eq } from "drizzle-orm";

// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const body = await request.json();
//     const id = parseInt(params.id);

//     await db.update(caseStudies)
//       .set({
//         ...body,
//         updatedAt: new Date(),
//       })
//       .where(eq(caseStudies.id, id));

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json({ success: false }, { status: 500 });
//   }
// }

// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = parseInt(params.id);
//     await db.delete(caseStudies).where(eq(caseStudies.id, id));
    
//     return NextResponse.json({ success: true });
//   } catch (error) {
//     return NextResponse.json({ success: false }, { status: 500 });
//   }
// }

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { caseStudies } from "@/db/schema";
import { eq } from "drizzle-orm";

// params must be wrapped in a Promise type
type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(
  request: NextRequest,
  context: RouteContext // Use context instead of destructuring directly
) {
  try {
    const body = await request.json();
    const { id } = await context.params; // Await the params here
    const numericId = parseInt(id);

    await db.update(caseStudies)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(caseStudies.id, numericId));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params; // Await the params here
    const numericId = parseInt(id);
    
    await db.delete(caseStudies).where(eq(caseStudies.id, numericId));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}