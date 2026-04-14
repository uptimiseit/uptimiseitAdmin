import { db } from '@/lib/db';
import { projectIntake } from '@/db/schema';
import { NextResponse } from 'next/server';
import { desc } from 'drizzle-orm';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};
// viyvyivvy

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { fullName, workEmail, companyName, companyStage, linkedinUrl, projectContext } = body;

    if (!fullName || !workEmail || !companyStage || !projectContext) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400, headers: corsHeaders });
    }

    const result = await db.insert(projectIntake).values({
      fullName,
      workEmail,
      companyName,
      companyStage,
      linkedinUrl,
      projectContext,
    }).returning();

    return NextResponse.json({ message: 'Intake successful', id: result[0].id }, { status: 201, headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'System Error' }, { status: 500, headers: corsHeaders });
  }
}

export async function GET() {
  try {
    const data = await db.select().from(projectIntake).orderBy(desc(projectIntake.createdAt));

    return NextResponse.json(
      { success: true, data },
      { 
        status: 200, 
        headers: { 'Access-Control-Allow-Origin': '*' } 
      }
    );
  } catch (error) {
    console.error("GET_INTAKE_ERROR:", error);
    return NextResponse.json({ error: "Failed to fetch intake logs" }, { status: 500 });
  }
}