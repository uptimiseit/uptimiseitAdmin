// import { db } from '@/lib/db';
// import { projectIntake } from '@/db/schema';
// import { NextResponse } from 'next/server';
// import { desc } from 'drizzle-orm';

// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Methods': 'POST, OPTIONS',
//   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
// };
// // viyvyivvy

// export async function OPTIONS() {
//   return new NextResponse(null, { status: 200, headers: corsHeaders });
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { fullName, workEmail, companyName, companyStage, linkedinUrl, projectContext } = body;

//     if (!fullName || !workEmail || !companyStage || !projectContext) {
//       return NextResponse.json({ error: 'Required fields missing' }, { status: 400, headers: corsHeaders });
//     }

//     const result = await db.insert(projectIntake).values({
//       fullName,
//       workEmail,
//       companyName,
//       companyStage,
//       linkedinUrl,
//       projectContext,
//     }).returning();

//     return NextResponse.json({ message: 'Intake successful', id: result[0].id }, { status: 201, headers: corsHeaders });
//   } catch (error) {
//     return NextResponse.json({ error: 'System Error' }, { status: 500, headers: corsHeaders });
//   }
// }

// export async function GET() {
//   try {
//     const data = await db.select().from(projectIntake).orderBy(desc(projectIntake.createdAt));

//     return NextResponse.json(
//       { success: true, data },
//       { 
//         status: 200, 
//         headers: { 'Access-Control-Allow-Origin': '*' } 
//       }
//     );
//   } catch (error) {
//     console.error("GET_INTAKE_ERROR:", error);
//     return NextResponse.json({ error: "Failed to fetch intake logs" }, { status: 500 });
//   }
// }

import { db } from '@/lib/db';
import { projectIntake } from '@/db/schema';
import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    // 1. Switch to formData to accept the file and text fields
    const formData = await req.formData();
    
    const fullName = formData.get('fullName') as string;
    const workEmail = formData.get('workEmail') as string;
    const companyName = formData.get('companyName') as string;
    const companyStage = formData.get('companyStage') as string;
    const linkedinUrl = formData.get('linkedinUrl') as string;
    const projectContext = formData.get('projectContext') as string;
    const countryCode = formData.get('countryCode') as string;
    const mobileNumber = formData.get('mobileNumber') as string;
    const file = formData.get('documentFile') as File | null;

    // 2. Validation
    if (!fullName || !workEmail || !mobileNumber || !countryCode) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400, headers: corsHeaders });
    }

    // 3. Optional: Handle File Upload 
    // (Example: If using Vercel Blob or similar, upload here and get a URL)
    let documentUrl = '';
    if (file && file.size > 0) {
       // logic to upload 'file' to S3/Cloudinary/Vercel Blob goes here
       // documentUrl = await uploadMethod(file);
       documentUrl = `uploads/${file.name}`; // Placeholder logic
    }

    // 4. Database Insert
    const result = await db.insert(projectIntake).values({
      fullName,
      workEmail,
      companyName,
      companyStage,
      linkedinUrl,
      projectContext,
      countryCode,
      mobileNumber,
      documentUrl, 
    }).returning();

    return NextResponse.json(
      { message: 'Intake successful', id: result[0].id }, 
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("POST_ERROR:", error);
    return NextResponse.json({ error: 'System Error' }, { status: 500, headers: corsHeaders });
  }
}

export async function GET() {
  try {
    const data = await db.select().from(projectIntake).orderBy(desc(projectIntake.createdAt));
    return NextResponse.json(
      { success: true, data },
      { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}