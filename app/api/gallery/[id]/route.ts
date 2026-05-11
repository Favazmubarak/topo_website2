import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import { verifyAuthFromRequest } from "@/src/lib/auth";
import {
  uploadBufferToCloudinary,
  deleteFromCloudinary,
} from "@/src/lib/cloudinary";
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

// GET /api/gallery/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const item = await Gallery.findById(params.id);
    if (!item) {
      return NextResponse.json(
        { message: "Gallery item not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(item, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch gallery item" },
      { status: 500 }
    );
  }
}

// PUT /api/gallery/[id]
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyAuthFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const existingItem = await Gallery.findById(params.id);
    if (!existingItem) {
      return NextResponse.json(
        { message: "Gallery item not found" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;

    let updateData: Partial<IGallery> = {};

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult = await uploadBufferToCloudinary(
        buffer,
        "topo-admin/gallery"
      );

      if (existingItem.publicId) {
        await deleteFromCloudinary(existingItem.publicId).catch((err) =>
          console.error("Failed to delete old image:", err)
        );
      }

      updateData.imageUrl = uploadResult.url;
      updateData.publicId = uploadResult.publicId;
    }

    const updated = await Gallery.findByIdAndUpdate(params.id, updateData, {
      new: true,
    });

    return NextResponse.json(
      { message: "Gallery item updated successfully", data: updated },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update gallery item" },
      { status: 500 }
    );
  }
}

// DELETE /api/gallery/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = verifyAuthFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const item = await Gallery.findById(params.id);
    if (!item) {
      return NextResponse.json(
        { message: "Gallery item not found" },
        { status: 404 }
      );
    }

    if (item.publicId) {
      await deleteFromCloudinary(item.publicId);
    }

    await Gallery.findByIdAndDelete(params.id);

    return NextResponse.json(
      { message: "Gallery item deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete gallery item" },
      { status: 500 }
    );
  }
}