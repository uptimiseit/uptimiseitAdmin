// import { db } from '@/lib/db';
// import { briefs } from '@/db/schema';
// import { NextResponse } from 'next/server';
// import { desc } from 'drizzle-orm';

// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*', 
//   'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
//   'Access-Control-Allow-Headers': 'Content-Type, Authorization',
// };

// export async function OPTIONS() {
//   return new NextResponse(null, { status: 200, headers: corsHeaders });
// }

// export async function POST(req: Request) {
//   try {
//     // 1. Parse FormData instead of JSON
//     const formData = await req.formData();
    
//     const name = formData.get('name') as string;
//     const email = formData.get('email') as string;
//     const countryCode = formData.get('countryCode') as string;
//     const mobileNumber = formData.get('mobileNumber') as string;
//     const department = formData.get('department') as string;
//     const message = formData.get('message') as string;
//     const file = formData.get('documentFile') as File | null;

//     // 2. Server-side Validation
//     if (!name || !email || !mobileNumber || !department || !message) {
//       return NextResponse.json(
//         { error: 'Validation Error: Required fields are missing.' },
//         { status: 400, headers: corsHeaders }
//       );
//     }

//     // 3. File Handling Placeholder
//     // If you use Vercel Blob, S3, or Cloudinary, upload the 'file' here.
//     let documentUrl = '';
//     if (file && file.size > 0) {
//       // Example: documentUrl = await uploadToProvider(file);
//       documentUrl = `uploads/${Date.now()}_${file.name}`; 
//     }

//     // 4. Database Insertion
//     const result = await db.insert(briefs).values({
//       name,
//       email,
//       countryCode,
//       mobileNumber,
//       department,
//       message,
//       documentUrl,
//     }).returning();

//     return NextResponse.json(
//       { 
//         message: 'Transmission Successful', 
//         id: result[0].id 
//       },
//       { status: 201, headers: corsHeaders }
//     );

//   } catch (error) {
//     console.error('SYSTEM_CRITICAL_ERROR:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500, headers: corsHeaders }
//     );
//   }
// }

// export async function GET() {
//   try {
//     const data = await db.select().from(briefs).orderBy(desc(briefs.createdAt));

//     return NextResponse.json(
//       { success: true, data },
//       { 
//         status: 200, 
//         headers: corsHeaders 
//       }
//     );
//   } catch (error) {
//     console.error("GET_BRIEFS_ERROR:", error);
//     return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
//   }
// }



import { db } from '@/lib/db';
import { briefs } from '@/db/schema';
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
    // 1. Parse JSON body (Frontend now sends JSON after AWS upload)
    const body = await req.json();
    
    const { 
      name, 
      email, 
      countryCode, 
      mobileNumber, 
      department, 
      message, 
      documentUrl // This is the CloudFront URL sent from frontend
    } = body;

    // 2. Server-side Validation
    if (!name || !email || !mobileNumber || !department || !message) {
      return NextResponse.json(
        { error: 'Validation Error: Required fields are missing.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // 3. Database Insertion
    // We use the documentUrl provided by the frontend S3 upload
    const result = await db.insert(briefs).values({
      name,
      email,
      countryCode,
      mobileNumber,
      department,
      message,
      documentUrl: documentUrl || null, 
    }).returning();

    return NextResponse.json(
      { 
        message: 'Transmission Successful', 
        id: result[0].id 
      },
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
    console.error('SYSTEM_CRITICAL_ERROR:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET() {
  try {
    const data = await db.select().from(briefs).orderBy(desc(briefs.createdAt));

    return NextResponse.json(
      { success: true, data },
      { 
        status: 200, 
        headers: corsHeaders 
      }
    );
  } catch (error) {
    console.error("GET_BRIEFS_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}