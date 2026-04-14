import { db } from '@/lib/db';
import { projectIntake } from '@/db/schema';
import { NextResponse } from 'next/server';

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