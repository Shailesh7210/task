import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
}

export const signToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");

  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN as any) || "7d",
  });
};

export const verifyToken = (token: string): JwtPayload => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not defined");

  return jwt.verify(token, secret) as JwtPayload;
};