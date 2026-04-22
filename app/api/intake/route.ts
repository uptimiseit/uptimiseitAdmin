// import { db } from '@/lib/db';
// import { projectIntake } from '@/db/schema';
// import { NextResponse } from 'next/server';
// import { desc } from 'drizzle-orm';

// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Methods': 'POST, OPTIONS',
//   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
// };

// export async function OPTIONS() {
//   return new NextResponse(null, { status: 200, headers: corsHeaders });
// }

// export async function POST(req: Request) {
//   try {
//     // 1. Switch to formData to accept the file and text fields
//     const formData = await req.formData();
    
//     const fullName = formData.get('fullName') as string;
//     const workEmail = formData.get('workEmail') as string;
//     const companyName = formData.get('companyName') as string;
//     const companyStage = formData.get('companyStage') as string;
//     const linkedinUrl = formData.get('linkedinUrl') as string;
//     const projectContext = formData.get('projectContext') as string;
//     const countryCode = formData.get('countryCode') as string;
//     const mobileNumber = formData.get('mobileNumber') as string;
//     const file = formData.get('documentFile') as File | null;

//     // 2. Validation
//     if (!fullName || !workEmail || !mobileNumber || !countryCode) {
//       return NextResponse.json({ error: 'Required fields missing' }, { status: 400, headers: corsHeaders });
//     }

//     // 3. Optional: Handle File Upload 
//     // (Example: If using Vercel Blob or similar, upload here and get a URL)
//     let documentUrl = '';
//     if (file && file.size > 0) {
//        // logic to upload 'file' to S3/Cloudinary/Vercel Blob goes here
//        // documentUrl = await uploadMethod(file);
//        documentUrl = `uploads/${file.name}`; // Placeholder logic
//     }

//     // 4. Database Insert
//     const result = await db.insert(projectIntake).values({
//       fullName,
//       workEmail,
//       companyName,
//       companyStage,
//       linkedinUrl,
//       projectContext,
//       countryCode,
//       mobileNumber,
//       documentUrl, 
//     }).returning();

//     return NextResponse.json(
//       { message: 'Intake successful', id: result[0].id }, 
//       { status: 201, headers: corsHeaders }
//     );
//   } catch (error) {
//     console.error("POST_ERROR:", error);
//     return NextResponse.json({ error: 'System Error' }, { status: 500, headers: corsHeaders });
//   }
// }

// export async function GET() {
//   try {
//     const data = await db.select().from(projectIntake).orderBy(desc(projectIntake.createdAt));
//     return NextResponse.json(
//       { success: true, data },
//       { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
//     );
//   } catch (error) {
//     return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
//   }
// }

import { db } from '@/lib/db';
import { projectIntake } from '@/db/schema';
import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    // 1. Switch to .json() because the frontend now sends JSON after the S3 upload
    const body = await req.json();
    
    const { 
      fullName, 
      workEmail, 
      companyName, 
      companyStage, 
      linkedinUrl, 
      projectContext, 
      countryCode, 
      mobileNumber, 
      documentUrl // This is now the final CloudFront URL sent from the frontend
    } = body;

    // 2. Validation
    if (!fullName || !workEmail || !mobileNumber || !countryCode) {
      return NextResponse.json(
        { error: 'Required fields missing: Identity, Email, or Mobile Node required.' }, 
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Database Insert
    // We no longer handle the 'File' object here. We just save the string URL.
    const result = await db.insert(projectIntake).values({
      fullName,
      workEmail,
      companyName: companyName || "",
      companyStage: companyStage || "None",
      linkedinUrl: linkedinUrl || "",
      projectContext: projectContext || "",
      countryCode,
      mobileNumber,
      documentUrl: documentUrl || "", // Store the AWS CDN link
    }).returning();

    return NextResponse.json(
      { message: 'Intake successful. Transmission logged.', id: result[0].id }, 
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
    console.error("INTAKE_POST_ERROR:", error);
    return NextResponse.json(
      { error: 'System Protocol Error: Failed to log intake.' }, 
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET() {
  try {
    const data = await db.select().from(projectIntake).orderBy(desc(projectIntake.createdAt));
    
    return NextResponse.json(
      { success: true, data },
      { 
        status: 200, 
        headers: corsHeaders 
      }
    );
  } catch (error) {
    console.error("INTAKE_GET_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch logs" }, 
      { status: 500, headers: corsHeaders }
    );
  }
}