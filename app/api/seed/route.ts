import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import Admin from "@/src/models/Admin";
import bcrypt from "bcryptjs";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== "topo-seed-2026") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    await Admin.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin123", salt);

    await Admin.create({
      username: "admin",
      email: "admin@topo.com",
      password: hashedPassword,
    });

    return NextResponse.json({
      message: "✅ Admin seeded successfully",
      username: "admin",
      email: "admin@topo.com",
      password: "admin@123",
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: "❌ Seed failed", error: error.message },
      { status: 500 }
    );
  }
}