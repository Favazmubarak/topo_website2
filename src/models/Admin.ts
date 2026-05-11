import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IAdmin extends Document {
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

const adminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
  },
  { timestamps: true },
);

adminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
export default mongoose.models.Admin ||
  mongoose.model<IAdmin>("Admin", adminSchema);
