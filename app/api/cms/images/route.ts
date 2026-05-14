import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import { verifyAuthFromRequest } from "@/src/lib/auth";
import { uploadBufferToCloudinary } from "@/src/lib/cloudinary";
import SectionImage from "@/src/models/SectionImage";

const SECTION_LIMITS: Record<string, number> = {
  hero: 1,
  about: 2,
  "why-choose": 1,
  cta: 1,
};

// GET /api/cms/images
export async function GET() {
  try {
    await connectDB();
    const images = await SectionImage.find({});
    return NextResponse.json(images, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch images" },
      { status: 500 }
    );
  }
}

// POST /api/cms/images
export async function POST(req: NextRequest) {
  try {
    const admin = verifyAuthFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const formData = await req.formData();
    const file = formData.get("image") as File;
    const section = formData.get("section") as string;

    if (!file || !section) {
      const errors: Record<string, string> = {};
      if (!file) errors.image = "Image file is required";
      if (!section) errors.section = "Section is required";
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    // Check file size — max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { message: "Image is too large. Maximum allowed size is 10MB." },
        { status: 400 }
      );
    }

    // Check section limit
    const limit = SECTION_LIMITS[section] ?? 1;
    const currentCount = await SectionImage.countDocuments({ section });

    if (currentCount >= limit) {
      return NextResponse.json(
        {
          message: `Maximum ${limit} image${limit > 1 ? "s" : ""} allowed for ${section} section. Please delete existing image${limit > 1 ? "s" : ""} first.`,
        },
        { status: 409 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let uploadResult;
    try {
      uploadResult = await uploadBufferToCloudinary(
        buffer,
        `topo-admin/${section}`
      );
    } catch (err: any) {
      const reason = err?.message || err?.error?.message || String(err);
      throw new Error(`Cloudinary rejected the image: ${reason}`);
    }

    const image = await SectionImage.create({
      section,
      imageUrl: uploadResult.url,
      publicId: uploadResult.publicId,
    });

    return NextResponse.json(
      { message: "Image created successfully", data: image },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create image" },
      { status: 500 }
    );
  }
}