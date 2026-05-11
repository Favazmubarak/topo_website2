import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import { verifyAuthFromRequest } from "@/src/lib/auth";
import { uploadBufferToCloudinary } from "@/src/lib/cloudinary";
import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

import Reel from "@/src/models/Reel";

// Validation
const createReelSchema = z.object({
  link: z.string().min(1, "Video link is required"),
});

const formatZodErrors = (error: z.ZodError): Record<string, string> =>
  error.issues.reduce((acc, issue) => {
    const field = issue.path[0] as string;
    if (!acc[field]) acc[field] = issue.message;
    return acc;
  }, {} as Record<string, string>);

// GET /api/reels
export async function GET() {
  try {
    await connectDB();
    const reels = await Reel.find().sort({ createdAt: -1 });
    return NextResponse.json(reels, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch reels" },
      { status: 500 }
    );
  }
}

// POST /api/reels
export async function POST(req: NextRequest) {
  try {
    const admin = verifyAuthFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const formData = await req.formData();
    const file = formData.get("thumbnail") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Validation failed", errors: { thumbnail: "Thumbnail is required" } },
        { status: 400 }
      );
    }

    const body = { link: formData.get("link") as string };

    const parsed = createReelSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: formatZodErrors(parsed.error) },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadBufferToCloudinary(buffer, "topo-admin/reels");

    const newReel = await Reel.create({
      link: parsed.data.link,
      thumbnail: uploadResult.url,
      publicId: uploadResult.publicId,
    });

    return NextResponse.json(
      { message: "Reel created successfully", data: newReel },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "This video link already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: error.message || "Failed to create reel" },
      { status: 500 }
    );
  }
}