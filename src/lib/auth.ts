import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "access_secret_key";

export const generateAccessToken = (payload: object) => {
  const expiresIn = process.env.JWT_EXPIRES_IN || "15d";
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: expiresIn as any,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
};

// Helper to verify auth from Next.js API route request
export const verifyAuthFromRequest = (req: NextRequest) => {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);
    return decoded;
  } catch (error) {
    return null;
  }
};