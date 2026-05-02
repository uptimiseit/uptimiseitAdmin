import { db } from '@/lib/db';
import { partnerIntake } from '@/db/schema';
import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';

// Enable CORS so your frontend can talk to this API
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle Preflight requests
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const { 
      fullName, 
      workEmail, 
      companyName, 
      country, 
      partnerType, 
      message 
    } = body;

    // 1. Validation (Matches the '*' fields in your image_cfb543.png)
    if (!fullName || !workEmail || !country || !partnerType) {
      return NextResponse.json(
        { error: 'Required fields missing: Identity, Email, Country, and Partner Type are mandatory.' }, 
        { status: 400, headers: corsHeaders }
      )
    }

    // 2. Database Insert
    const result = await db.insert(partnerIntake).values({
      fullName,
      workEmail,
      companyName: companyName || "N/A",
      country,
      partnerType,
      message: message || "", // From the 'Message/Notes' field
    }).returning();

    return NextResponse.json(
      { 
        message: 'Partner protocol initiated. Transmission logged.', 
        id: result[0].id 
      }, 
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
    console.error("PARTNER_INTAKE_POST_ERROR:", error);
    return NextResponse.json(
      { error: 'System Protocol Error: Failed to log partner intake.' }, 
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET() {
  try {
    const data = await db.select().from(partnerIntake).orderBy(desc(partnerIntake.createdAt));
    
    return NextResponse.json(
      { success: true, data },
      { 
        status: 200, 
        headers: corsHeaders 
      }
    );
  } catch (error) {
    console.error("PARTNER_INTAKE_GET_ERROR:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch partner registry" }, 
      { status: 500, headers: corsHeaders }
    );
  }
}