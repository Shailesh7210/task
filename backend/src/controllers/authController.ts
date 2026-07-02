import { Request, Response } from "express";
import { User } from "../models/User";
import { signToken } from "../utils/jwt";
import { signupSchema, loginSchema } from "../utils/validators";
import { AuthRequest } from "../middleware/auth";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: (process.env.NODE_ENV === "production" ? "none" : "lax") as
    | "none"
    | "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const signup = async (req: Request, res: Response): Promise<void> => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }

  const { name, email, password } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({ message: "Email is already registered" });
    return;
  }

  const user = await User.create({ name, email, password });
  const token = signToken({ userId: user._id.toString() });

  res.cookie("token", token, COOKIE_OPTIONS);
  res.status(201).json({
    user: { id: user._id, name: user.name, email: user.email },
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401).json({ message: "Invalid email or password" });
    return;
  }

  const token = signToken({ userId: user._id.toString() });

  res.cookie("token", token, COOKIE_OPTIONS);
  res.status(200).json({
    user: { id: user._id, name: user.name, email: user.email },
  });
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie("token", COOKIE_OPTIONS);
  res.status(200).json({ message: "Logged out successfully" });
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await User.findById(req.userId);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  res.status(200).json({
    user: { id: user._id, name: user.name, email: user.email },
  });
};