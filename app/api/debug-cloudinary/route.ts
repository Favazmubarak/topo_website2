import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "SET" : "MISSING",
    api_key: process.env.CLOUDINARY_API_KEY ? "SET" : "MISSING",
    api_secret: process.env.CLOUDINARY_API_SECRET ? "SET" : "MISSING",
    mongodb: process.env.MONGODB_URI ? "SET" : "MISSING",
  });
}