import mongoose, { Schema, Document } from 'mongoose';

export interface IReel extends Document {
  title?: string;
  link: string;
  thumbnail: string;
  publicId: string;
  platform?: 'instagram' | 'youtube' | 'tiktok';
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

const reelSchema = new Schema<IReel>(
  {
    title: { type: String },
    link: { type: String, required: true },
    thumbnail: { type: String, required: true },
    publicId: { type: String, required: true },
    platform: { type: String, enum: ['instagram', 'youtube', 'tiktok'] },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Reel || mongoose.model<IReel>('Reel', reelSchema);
