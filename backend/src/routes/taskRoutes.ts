import { Router } from "express";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController";
import { requireAuth } from "../middleware/auth";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

router.use(requireAuth); // every task route requires a logged-in user

router.get("/", asyncHandler(getTasks));
router.get("/:id", asyncHandler(getTaskById));
router.post("/", asyncHandler(createTask));
router.put("/:id", asyncHandler(updateTask));
router.delete("/:id", asyncHandler(deleteTask));

export default router;