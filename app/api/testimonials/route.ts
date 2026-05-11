import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import { verifyAuthFromRequest } from "@/src/lib/auth";
import { uploadBufferToCloudinary } from "@/src/lib/cloudinary";
import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

import Testimonial from "@/src/models/Testimonial";

// Validation
const createTestimonialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  rating: z.coerce.number().min(1).max(5),
  review: z.string().min(1, "Review is required"),
});

const formatZodErrors = (error: z.ZodError): Record<string, string> =>
  error.issues.reduce((acc, issue) => {
    const field = issue.path[0] as string;
    if (!acc[field]) acc[field] = issue.message;
    return acc;
  }, {} as Record<string, string>);

// GET /api/testimonials
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "15");
    const skip = (page - 1) * limit;

    const [testimonials, total] = await Promise.all([
      Testimonial.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Testimonial.countDocuments(),
    ]);

    return NextResponse.json(
      {
        testimonials,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

// POST /api/testimonials
export async function POST(req: NextRequest) {
  try {
    const admin = verifyAuthFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const formData = await req.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Validation failed", errors: { avatar: "Profile image is required" } },
        { status: 400 }
      );
    }

    const body = {
      name: formData.get("name") as string,
      rating: formData.get("rating") as string,
      review: formData.get("review") as string,
    };

    const parsed = createTestimonialSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: formatZodErrors(parsed.error) },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let uploadResult;
    try {
      uploadResult = await uploadBufferToCloudinary(buffer, "topo-admin/testimonials");
    } catch {
      throw new Error("Image upload failed. Please try again.");
    }

    const newTestimonial = await Testimonial.create({
      ...parsed.data,
      avatar: uploadResult.url,
      publicId: uploadResult.publicId,
    });

    return NextResponse.json(
      { message: "Testimonial created successfully", data: newTestimonial },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create testimonial" },
      { status: 500 }
    );
  }
}