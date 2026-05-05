import { NextResponse } from "next/server";

export function withCors(response: NextResponse) {
  // Replace '*' with your actual domain in production for better security
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Requested-With"
  );
  
  return response;
}