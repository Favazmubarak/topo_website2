import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import { verifyAuthFromRequest } from "@/src/lib/auth";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "@/src/lib/cloudinary";
import { isValidObjectId } from "mongoose";
import SectionImage from "@/src/models/SectionImage";

// GET /api/cms/images/[slug]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    const sections = ["hero", "about", "why-choose", "cta"];
    if (sections.includes(slug)) {
      const images = await SectionImage.find({ section: slug });
      return NextResponse.json(images, { status: 200 });
    }

    const image = await SectionImage.findById(slug);
    if (!image) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }
    return NextResponse.json(image, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch image" },
      { status: 500 }
    );
  }
}

// PUT /api/cms/images/[slug]
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const admin = verifyAuthFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { slug } = await params;

    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Validation failed", errors: { image: "Image file is required for update" } },
        { status: 400 }
      );
    }

    const existingImage = await SectionImage.findById(slug);
    if (!existingImage) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let uploadResult;
    try {
      uploadResult = await uploadBufferToCloudinary(
        buffer,
        `topo-admin/${existingImage.section}`
      );
    } catch {
      throw new Error("Cloudinary upload failed");
    }

    if (existingImage.publicId) {
      deleteFromCloudinary(existingImage.publicId).catch((err) =>
        console.error("Failed to delete old image:", err)
      );
    }

    const updated = await SectionImage.findByIdAndUpdate(
      slug,
      { imageUrl: uploadResult.url, publicId: uploadResult.publicId },
      { new: true }
    );

    return NextResponse.json(
      { message: "Image updated successfully", data: updated },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update image" },
      { status: 500 }
    );
  }
}

// DELETE /api/cms/images/[slug]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const admin = verifyAuthFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { slug } = await params;

    if (!isValidObjectId(slug)) {
      return NextResponse.json(
        { message: "Invalid image ID format" },
        { status: 400 }
      );
    }

    const image = await SectionImage.findByIdAndDelete(slug);
    if (!image) {
      return NextResponse.json({ message: "Image not found" }, { status: 404 });
    }

    if (image.publicId) {
      deleteFromCloudinary(image.publicId).catch((err) =>
        console.error(`Failed to delete Cloudinary asset:`, err.message)
      );
    }

    return NextResponse.json(
      { message: "Image deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete image" },
      { status: 500 }
    );
  }
}