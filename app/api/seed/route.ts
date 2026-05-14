import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== "topo-seed-2026") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    // Use the raw collection to bypass pre-save hook entirely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    await mongoose.connection.collection("admins").deleteMany({});
    await mongoose.connection.collection("admins").insertOne({
      username: "admin",
      email: "admin@topo.com",
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
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