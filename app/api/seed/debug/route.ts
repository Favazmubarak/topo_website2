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

    const admin = await Admin.findOne({ email: "admin@topo.com" });
    if (!admin) {
      return NextResponse.json({ message: "No admin found" });
    }

    // Test if password matches
    const match = await bcrypt.compare("admin123", admin.password);

    return NextResponse.json({
      found: true,
      username: admin.username,
      email: admin.email,
      passwordHash: admin.password,
      passwordMatch: match,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}