import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import { verifyAuthFromRequest } from "@/src/lib/auth";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "@/src/lib/cloudinary";
import { z } from "zod";
import Product from "@/src/models/Product";

const updateProductSchema = z.object({
  productName: z.string().min(1).optional(),
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});

const formatZodErrors = (error: z.ZodError): Record<string, string> =>
  error.issues.reduce((acc, issue) => {
    const field = issue.path[0] as string;
    if (!acc[field]) acc[field] = issue.message;
    return acc;
  }, {} as Record<string, string>);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PATCH(
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

    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("image") as File;
    const body = {
      productName: formData.get("productName") as string,
      title: formData.get("title") as string,
      description: formData.get("description") as string,
    };
    const cleanBody = Object.fromEntries(
      Object.entries(body).filter(([_, v]) => v != null && v !== "")
    );
    const parsed = updateProductSchema.safeParse(cleanBody);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: formatZodErrors(parsed.error) },
        { status: 400 }
      );
    }

    let updateData: any = { ...parsed.data };
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult = await uploadBufferToCloudinary(buffer, "topo-admin/products");
      if (existingProduct.publicId) {
        await deleteFromCloudinary(existingProduct.publicId).catch((err) =>
          console.error("Failed to delete old image:", err)
        );
      }
      updateData.imageUrl = uploadResult.url;
      updateData.publicId = uploadResult.publicId;
    }

    const updated = await Product.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(
      { message: "Product updated successfully", data: updated },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update product" },
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

    const product = await Product.findById(id);
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    if (product.publicId) {
      await deleteFromCloudinary(product.publicId);
    }
    await Product.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete product" },
      { status: 500 }
    );
  }
}