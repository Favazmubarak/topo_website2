import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import { verifyAuthFromRequest } from "@/src/lib/auth";
import { uploadBufferToCloudinary } from "@/src/lib/cloudinary";
import mongoose, { Schema, Document } from "mongoose";

// Gallery Model
interface IGallery extends Document {
  imageUrl: string;
  publicId: string;
}

const GallerySchema = new Schema(
  {
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { timestamps: true }
);

const Gallery =
  mongoose.models.Gallery || mongoose.model<IGallery>("Gallery", GallerySchema);

// GET /api/gallery
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      Gallery.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Gallery.countDocuments(),
    ]);

    return NextResponse.json(
      { data, total, page, limit, hasMore: skip + data.length < total },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch gallery images" },
      { status: 500 }
    );
  }
}

// POST /api/gallery
export async function POST(req: NextRequest) {
  try {
    const admin = verifyAuthFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Validation failed", errors: { image: "Gallery image is required" } },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResult = await uploadBufferToCloudinary(buffer, "topo-admin/gallery");

    const newItem = await Gallery.create({
      imageUrl: uploadResult.url,
      publicId: uploadResult.publicId,
    });

    return NextResponse.json(
      { message: "Gallery item created successfully", data: newItem },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create gallery item" },
      { status: 500 }
    );
  }
}