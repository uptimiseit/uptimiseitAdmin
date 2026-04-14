// app/api/brief/route.ts
import { db } from '@/lib/db';
import { briefs } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, department, message } = body;

    // Basic validation
    if (!name || !email || !department || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Insert into Neon Database via Drizzle
    const newBrief = await db.insert(briefs).values({
      name,
      email,
      department,
      message,
    }).returning();

    return NextResponse.json(
      { message: 'Brief created successfully', data: newBrief[0] },
      { status: 201 }
    );
  } catch (error) {
    console.error('API_ERROR:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}