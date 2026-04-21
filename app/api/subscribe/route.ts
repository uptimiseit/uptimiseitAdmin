import { db } from "@/lib/db";
import { subscribers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

// 1. Mandatory CORS headers for cross-domain communication
const corsHeaders = {
  "Access-Control-Allow-Origin": "*", // Or your specific frontend URL
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// 2. Handle the Preflight OPTIONS request (Fixes the Network Error)
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { message: "Invalid email address" }, 
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if user already exists
    const [existing] = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, email.toLowerCase()));
    
    if (existing) {
      return NextResponse.json(
        { message: "You are already subscribed!" }, 
        { status: 409, headers: corsHeaders }
      );
    }

    // Insert new subscriber
    await db.insert(subscribers).values({
      email: email.toLowerCase(),
      status: "ACTIVE",
    });

    return NextResponse.json(
      { success: true, message: "Subscribed successfully!" }, 
      { status: 201, headers: corsHeaders }
    );

  } catch (error) {
    console.error("Subscription Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" }, 
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET() {
  try {
    const allSubscribers = await db
      .select()
      .from(subscribers)
      .orderBy(desc(subscribers.createdAt));

    return NextResponse.json(
      { success: true, data: allSubscribers }, 
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch subscribers" }, 
      { status: 500, headers: corsHeaders }
    );
  }
}