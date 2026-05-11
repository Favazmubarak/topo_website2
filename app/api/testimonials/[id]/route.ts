import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import { verifyAuthFromRequest } from "@/src/lib/auth";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "@/src/lib/cloudinary";
import { z } from "zod";
import Testimonial from "@/src/models/Testimonial";

const updateTestimonialSchema = z.object({
  name: z.string().min(1).optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  review: z.string().min(1).optional(),
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
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
    }
    return NextResponse.json(testimonial, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch testimonial" },
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

    const existingTestimonial = await Testimonial.findById(id);
    if (!existingTestimonial) {
      return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("avatar") as File;
    const body = {
      name: formData.get("name") as string,
      rating: formData.get("rating") as string,
      review: formData.get("review") as string,
    };
    const cleanBody = Object.fromEntries(
      Object.entries(body).filter(([_, v]) => v != null && v !== "")
    );
    const parsed = updateTestimonialSchema.safeParse(cleanBody);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: formatZodErrors(parsed.error) },
        { status: 400 }
      );
    }

    let updateData: any = { ...parsed.data };
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult = await uploadBufferToCloudinary(buffer, "topo-admin/testimonials");
      if (existingTestimonial.publicId) {
        await deleteFromCloudinary(existingTestimonial.publicId).catch((err) =>
          console.error("Failed to delete old image:", err)
        );
      }
      updateData.avatar = uploadResult.url;
      updateData.publicId = uploadResult.publicId;
    }

    const updated = await Testimonial.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(
      { message: "Testimonial updated successfully", data: updated },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to update testimonial" },
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

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return NextResponse.json({ message: "Testimonial not found" }, { status: 404 });
    }
    if (testimonial.publicId) {
      await deleteFromCloudinary(testimonial.publicId);
    }
    await Testimonial.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Testimonial deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}