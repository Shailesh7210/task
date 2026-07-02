import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(60),
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

const priorityEnum = z.enum(["Low", "Medium", "High"]);
const statusEnum = z.enum(["To Do", "In Progress", "Done"]);

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(2000).optional().default(""),
  dueDate: z.coerce.date({ error: "Valid due date is required" }),
  priority: priorityEnum.optional().default("Medium"),
  status: statusEnum.optional().default("To Do"),
});

// All fields optional for updates, but at least one must be present
export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    description: z.string().trim().max(2000).optional(),
    dueDate: z.coerce.date().optional(),
    priority: priorityEnum.optional(),
    status: statusEnum.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
  });

export const taskQuerySchema = z.object({
  status: statusEnum.optional(),
  priority: priorityEnum.optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;

export const aiSuggestSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
});

export type AiSuggestInput = z.infer<typeof aiSuggestSchema>;