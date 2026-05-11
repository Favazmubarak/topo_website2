import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import { generateAccessToken } from "@/src/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import Admin from "@/src/models/Admin";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.issues.reduce((acc, issue) => {
        const field = issue.path[0] as string;
        if (!acc[field]) acc[field] = issue.message;
        return acc;
      }, {} as Record<string, string>);
      return NextResponse.json(
        { message: "Validation failed", errors },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email: parsed.data.email });
    if (!admin) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isPasswordMatch = await bcrypt.compare(parsed.data.password, admin.password);
    if (!isPasswordMatch) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const accessToken = generateAccessToken({ email: admin.email, id: admin._id });

    const response = NextResponse.json(
      { message: "Login successful", accessToken },
      { status: 200 }
    );

    // Set cookie SERVER SIDE — available immediately on next request
    response.cookies.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}