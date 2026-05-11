import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/src/lib/mongodb";
import { verifyAuthFromRequest } from "@/src/lib/auth";
import mongoose, { Schema, Document } from "mongoose";
import { z } from "zod";

// FAQ Model
interface IFAQ extends Document {
  question: string;
  answer: string;
}

const FAQSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const FAQ = mongoose.models.FAQ || mongoose.model<IFAQ>("FAQ", FAQSchema);

// Validation
const createFAQSchema = z.object({
  question: z.string().min(1, "Question is required"),
  answer: z.string().min(1, "Answer is required"),
});

const formatZodErrors = (error: z.ZodError): Record<string, string> =>
  error.issues.reduce((acc, issue) => {
    const field = issue.path[0] as string;
    if (!acc[field]) acc[field] = issue.message;
    return acc;
  }, {} as Record<string, string>);

// GET /api/faqs
export async function GET() {
  try {
    await connectDB();
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    return NextResponse.json(faqs, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}

// POST /api/faqs
export async function POST(req: NextRequest) {
  try {
    const admin = verifyAuthFromRequest(req);
    if (!admin) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const parsed = createFAQSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation failed", errors: formatZodErrors(parsed.error) },
        { status: 400 }
      );
    }

    const newFAQ = await FAQ.create(parsed.data);
    return NextResponse.json(
      { message: "FAQ created successfully", data: newFAQ },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Failed to create FAQ" },
      { status: 500 }
    );
  }
}