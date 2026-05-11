import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import { generateAccessToken } from "@/src/lib/auth";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Admin Model
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { timestamps: true });

adminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", adminSchema);

// Validation schema
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
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordMatch = await bcrypt.compare(
      parsed.data.password,
      admin.password
    );

    if (!isPasswordMatch) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const accessToken = generateAccessToken({
      email: admin.email,
      id: admin._id,
    });

    return NextResponse.json(
      { message: "Login successful", accessToken },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Something went wrong" },
      { status: 500 }
    );
  }
}