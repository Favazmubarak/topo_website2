import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import Admin from "@/src/models/Admin";

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== "topo-seed-2026") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();

    await Admin.deleteMany({});

    // Let the pre-save hook handle hashing
    const admin = new Admin({
      username: "admin",
      email: "admin@topo.com",
      password: "admin123",
    });

    await admin.save();

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