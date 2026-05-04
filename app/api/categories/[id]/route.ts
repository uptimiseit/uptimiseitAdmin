// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { categories } from "@/db/schema";
// import { eq } from "drizzle-orm";

// const corsHeaders = {
//   "Access-Control-Allow-Origin": "*",
//   "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
//   "Access-Control-Allow-Headers": "Content-Type, Authorization",
// };

// // --- PUT: Update a category ---
// export async function PUT(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = Number(params.id);
//     const body = await request.json();
    
//     const updated = await db
//       .update(categories)
//       .set({
//         name: body.name,
//         slug: body.slug,
//         description: body.description,
//         isActive: body.isActive,
//       })
//       .where(eq(categories.id, id))
//       .returning();


//       console.log("Update result:", updated); // Debug log
//     if (updated.length === 0) {
//       return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, data: updated[0] }, { headers: corsHeaders });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: "Update failed" }, { status: 400, headers: corsHeaders });
//   }
// }

// // --- DELETE: Remove a category ---
// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const id = Number(params.id);

//     const deleted = await db
//       .delete(categories)
//       .where(eq(categories.id, id))
//       .returning();

//     if (deleted.length === 0) {
//       return NextResponse.json({ success: false, message: "Category not found" }, { status: 404 });
//     }

//     return NextResponse.json({ success: true, message: "Category deleted" }, { headers: corsHeaders });
//   } catch (error) {
//     return NextResponse.json({ success: false, message: "Deletion failed" }, { status: 500, headers: corsHeaders });
//   }
// }

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// --- PUT: Update a category ---
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Define params as a Promise
) {
  try {
    const { id } = await params; // 2. Await the params
    const categoryId = Number(id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json({ success: false, message: "Invalid ID" }, { status: 400 });
    }

    const body = await request.json();
    
    const updated = await db
      .update(categories)
      .set({
        name: body.name,
        slug: body.slug,
        description: body.description,
        isActive: body.isActive ?? true,
      })
      .where(eq(categories.id, categoryId))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated[0] }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// --- DELETE: Remove a category ---
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> } // 1. Define params as a Promise
) {
  try {
    const { id } = await params; // 2. Await the params
    const categoryId = Number(id);

    const deleted = await db
      .delete(categories)
      .where(eq(categories.id, categoryId))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ success: false, message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Deleted" }, { headers: corsHeaders });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}