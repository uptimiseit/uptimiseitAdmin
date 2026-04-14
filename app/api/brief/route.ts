// // app/api/brief/route.ts
// import { db } from '@/lib/db';
// import { briefs } from '@/db/schema';
// import { NextResponse } from 'next/server';

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { name, email, department, message } = body;

//     // Basic validation
//     if (!name || !email || !department || !message) {
//       return NextResponse.json(
//         { error: 'All fields are required' },
//         { status: 400 }
//       );
//     }

//     // Insert into Neon Database via Drizzle
//     const newBrief = await db.insert(briefs).values({
//       name,
//       email,
//       department,
//       message,
//     }).returning();

//     return NextResponse.json(
//       { message: 'Brief created successfully', data: newBrief[0] },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error('API_ERROR:', error);
//     return NextResponse.json(
//       { error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

import { db } from '@/lib/db';
import { briefs } from '@/db/schema';
import { NextResponse } from 'next/server';

/**
 * 1. OPTIONS Handler (Preflight Request)
 * Browsers send this automatically before a POST request across different domains.
 * Without this, you will see the "Failed to Fetch" error.
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*', // Replace '*' with your frontend URL in production
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
      'Access-Control-Max-Age': '86400', // Cache preflight response for 24 hours
    },
  });
}

/**
 * 2. POST Handler
 * Processes the incoming brief data and saves it to Neon via Drizzle.
 */
export async function POST(req: Request) {
  // Define standard CORS headers to include in the response
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  };

  try {
    const body = await req.json();
    const { name, email, department, message } = body;

    // Server-side Validation
    if (!name || !email || !department || !message) {
      return NextResponse.json(
        { error: 'Incomplete Transmission: All fields are required.' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Insert into Neon Database
    const result = await db.insert(briefs).values({
      name,
      email,
      department,
      message,
    }).returning();

    // Success Response
    return NextResponse.json(
      { 
        message: 'Transmission Successful', 
        received_at: new Date().toISOString(),
        id: result[0].id 
      },
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
    console.error('CRITICAL_SYSTEM_ERROR:', error);

    return NextResponse.json(
      { error: 'Internal Server Error: Transmission Failed.' },
      { status: 500, headers: corsHeaders }
    );
  }
}