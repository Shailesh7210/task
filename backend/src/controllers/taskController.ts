import { Response } from "express";
import { Task } from "../models/Task";
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
} from "../utils/validators";
import { AuthRequest } from "../middleware/auth";

// GET /api/tasks?status=&priority=
export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsedQuery = taskQuerySchema.safeParse(req.query);
  if (!parsedQuery.success) {
    res.status(400).json({ message: parsedQuery.error.issues[0].message });
    return;
  }

  const { status, priority } = parsedQuery.data;

  const filter: Record<string, unknown> = { user: req.userId };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;

  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ tasks });
};

// GET /api/tasks/:id
export const getTaskById = async (req: AuthRequest, res: Response): Promise<void> => {
  const task = await Task.findOne({ _id: req.params.id, user: req.userId });

  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.status(200).json({ task });
};

// POST /api/tasks
export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = createTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }

  const task = await Task.create({
    ...parsed.data,
    user: req.userId,
  });

  res.status(201).json({ task });
};

// PUT /api/tasks/:id
export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const parsed = updateTaskSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ message: parsed.error.issues[0].message });
    return;
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { $set: parsed.data },
    { new: true, runValidators: true }
  );

  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.status(200).json({ task });
};

// DELETE /api/tasks/:id
export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    user: req.userId,
  });

  if (!task) {
    res.status(404).json({ message: "Task not found" });
    return;
  }

  res.status(200).json({ message: "Task deleted successfully" });
};