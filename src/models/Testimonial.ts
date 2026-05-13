import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  name: string;
  role?: string;
  company?: string;
  review: string;
  avatar?: string;
  publicId?: string;
  rating?: number;
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true },
    role: { type: String },
    company: { type: String },
    review: { type: String, required: true },
    avatar: { type: String },
    publicId: { type: String },
    rating: { type: Number, min: 1, max: 5 },
  },
  { timestamps: true }
);

export default mongoose.models.Testimonial || mongoose.model<ITestimonial>('Testimonial', testimonialSchema);
