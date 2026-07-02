export interface User {
  id: string;
  name: string;
  email: string;
}

export type TaskPriority = "Low" | "Medium" | "High";
export type TaskStatus = "To Do" | "In Progress" | "Done";

export interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  user: string;
  createdAt: string;
  updatedAt: string;
}