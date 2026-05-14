import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  // Security check - remove this route after seeding
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== "topo-seed-2026") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    const AdminSchema = new mongoose.Schema({
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
    });

    const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

    await Admin.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    await Admin.create({
      email: "admin@topo.com",
      password: hashedPassword,
    });

    return NextResponse.json({
      message: "✅ Admin seeded successfully",
      email: "admin@topo.com",
      password: "admin123",
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "❌ Seed failed", error: error.message },
      { status: 500 }
    );
  }
}