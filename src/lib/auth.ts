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

export const verifyAuthFromRequest = (req: NextRequest) => {
  try {
    // Check Authorization header (for API calls)
    const authHeader = req.headers.get("authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      return verifyAccessToken(token);
    }

    // Check cookie (for middleware/page protection)
    const cookieToken = req.cookies.get("accessToken")?.value;
    if (cookieToken) {
      return verifyAccessToken(cookieToken);
    }

    return null;
  } catch (error) {
    return null;
  }
};