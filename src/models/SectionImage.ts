import mongoose, { Schema, Document } from "mongoose";

export interface ISectionImage extends Document {
  section: "hero" | "about" | "why-choose" | "cta";
  imageUrl: string;
  publicId: string;
}

const SectionImageSchema = new Schema(
  {
    section: {
      type: String,
      required: true,
      enum: ["hero", "about", "why-choose", "cta"],
    },
    imageUrl: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { timestamps: true }
);

const SectionImage =
  mongoose.models.SectionImage ||
  mongoose.model<ISectionImage>("SectionImage", SectionImageSchema);

export default SectionImage;