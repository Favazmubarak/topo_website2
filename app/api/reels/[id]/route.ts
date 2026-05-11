import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import { verifyAuthFromRequest } from "@/src/lib/auth";
import { uploadBufferToCloudinary, deleteFromCloudinary } from "@/src/lib/cloudinary";
import { z } from "zod";
import Reel from "@/src/models/Reel";

const updateReelSchema = z.object({
  link: z.string().min(1).optional(),
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
    const reel = await Reel.findById(id);
    if (!reel) {
      return NextResponse.json({ message: "Reel not found" }, { status: 404 });
    }
    return NextResponse.json(reel, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch reel" },
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

    const existingReel = await Reel.findById(id);
    if (!existingReel) {
      return NextResponse.json({ message: "Reel not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const file = formData.get("thumbnail") as File;
    const link = formData.get("link") as string;

    const parsed = updateReelSchema.safeParse({ link: link || undefined });
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: formatZodErrors(parsed.error) },
        { status: 400 }
      );
    }

    let updateData: any = { ...parsed.data };

    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadResult = await uploadBufferToCloudinary(buffer, "topo-admin/reels");
      if (existingReel.publicId) {
        await deleteFromCloudinary(existingReel.publicId).catch((err) =>
          console.error("Failed to delete old image:", err)
        );
      }
      updateData.thumbnail = uploadResult.url;
      updateData.publicId = uploadResult.publicId;
    }

    const updated = await Reel.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(
      { message: "Reel updated successfully", data: updated },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { message: "This video link already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: error.message || "Failed to update reel" },
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

    const reel = await Reel.findById(id);
    if (!reel) {
      return NextResponse.json({ message: "Reel not found" }, { status: 404 });
    }
    if (reel.publicId) {
      await deleteFromCloudinary(reel.publicId);
    }
    await Reel.findByIdAndDelete(id);
    return NextResponse.json(
      { message: "Reel deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to delete reel" },
      { status: 500 }
    );
  }
}