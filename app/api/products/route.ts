import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import { verifyAuthFromRequest } from "@/src/lib/auth";
import { uploadBufferToCloudinary } from "@/src/lib/cloudinary";
import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";
import Product from "@/src/models/Product";


// Validation
const createProductSchema = z.object({
  productName: z.string().min(1, "Product name is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

const formatZodErrors = (error: z.ZodError): Record<string, string> =>
  error.issues.reduce((acc, issue) => {
    const field = issue.path[0] as string;
    if (!acc[field]) acc[field] = issue.message;
    return acc;
  }, {} as Record<string, string>);

// GET /api/products
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      Product.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(),
    ]);

    return NextResponse.json(
      {
        products,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST /api/products
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
        { message: "Validation failed", errors: { image: "Product image is required" } },
        { status: 400 }
      );
    }

    const body = {
      productName: formData.get("productName") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    };

    const parsed = createProductSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: formatZodErrors(parsed.error) },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let uploadResult;
    try {
      uploadResult = await uploadBufferToCloudinary(buffer, "topo-admin/products");
    } catch {
      throw new Error("Image upload failed. Please try again.");
    }

    const newProduct = await Product.create({
      ...parsed.data,
      imageUrl: uploadResult.url,
      publicId: uploadResult.publicId,
    });

    return NextResponse.json(
      { message: "Product created successfully", data: newProduct },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create product" },
      { status: 500 }
    );
  }
}