import { Router } from "express";
import { aiSuggest } from "../controllers/aiController";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.post("/suggest", requireAuth, asyncHandler(aiSuggest));

export default router;