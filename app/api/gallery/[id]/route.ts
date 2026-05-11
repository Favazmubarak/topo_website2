import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import { verifyAuthFromRequest } from "@/src/lib/auth";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "@/src/lib/cloudinary";
import Gallery from "@/src/models/Gallery";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const item = await Gallery.findById(id);
    if (!item) {
      return NextResponse.json({ message: "Gallery item not found" }, { status: 404 });
    }
    return NextResponse.json(item, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch gallery item" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = verifyAuthFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await connectDB();

    const existingItem = await Gallery.findById(id);
    if (!existingItem) {
      return NextResponse.json({ message: "Gallery item not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;
    let updateData: any = {};

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult = await uploadBufferToCloudinary(buffer, "topo-admin/gallery");
      if (existingItem.publicId) {
        await deleteFromCloudinary(existingItem.publicId).catch((err) =>
          console.error("Failed to delete old image:", err)
        );
      }
      updateData.imageUrl = uploadResult.url;
      updateData.publicId = uploadResult.publicId;
    }

    const updated = await Gallery.findByIdAndUpdate(id, updateData, { new: true });
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = verifyAuthFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    await connectDB();

    const item = await Gallery.findById(id);
    if (!item) {
      return NextResponse.json({ message: "Gallery item not found" }, { status: 404 });
    }
    if (item.publicId) {
      await deleteFromCloudinary(item.publicId);
    }
    await Gallery.findByIdAndDelete(id);
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