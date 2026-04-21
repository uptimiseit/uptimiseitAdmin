import { db } from "@/lib/db";
import { subscribers } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
    }

    // 1. Check if user already exists
    const [existing] = await db.select().from(subscribers).where(eq(subscribers.email, email));
    
    if (existing) {
      return NextResponse.json({ message: "You are already subscribed!" }, { status: 409 });
    }

    // 2. Insert new subscriber
    await db.insert(subscribers).values({
      email: email.toLowerCase(),
      status: "ACTIVE",
    });

    return NextResponse.json({ success: true, message: "Subscribed successfully!" }, { status: 201 });

  } catch (error) {
    console.error("Subscription Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}



export async function GET() {
  try {
    const allSubscribers = await db
      .select()
      .from(subscribers)
      .orderBy(desc(subscribers.createdAt));

    return NextResponse.json({ 
      success: true, 
      data: allSubscribers 
    }, { status: 200 });

  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Failed to fetch subscribers" 
    }, { status: 500 });
  }
}