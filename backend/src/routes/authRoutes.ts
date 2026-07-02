import { Router } from "express";
import { signup, login, logout, getMe } from "../controllers/authController";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/signup", asyncHandler(signup));
router.post("/login", asyncHandler(login));
router.post("/logout", logout);
router.get("/me", requireAuth, asyncHandler(getMe));

export default router;