"use client";

import { useEffect, useState, useCallback } from "react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/Button";
import { TaskCard } from "@/components/TaskCard";
import { TaskFilters } from "@/components/TaskFilters";
import { TaskFormModal, TaskFormValues } from "@/components/TaskFormModal";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { api } from "@/lib/api";
import { Task, TaskPriority, TaskStatus } from "@/types";

function TasksContent() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "">("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTasks = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (priorityFilter) params.set("priority", priorityFilter);
      const query = params.toString() ? `?${params.toString()}` : "";

      const data = await api.get<{ tasks: Task[] }>(`/api/tasks${query}`);
      setTasks(data.tasks);
    } catch {
      setError("Couldn't load tasks. Try refreshing the page.");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, priorityFilter]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const openCreateForm = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };

  const openEditForm = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (values: TaskFormValues) => {
    if (editingTask) {
      const data = await api.put<{ task: Task }>(
        `/api/tasks/${editingTask._id}`,
        values
      );
      setTasks((prev) =>
        prev.map((t) => (t._id === data.task._id ? data.task : t))
      );
    } else {
      const data = await api.post<{ task: Task }>("/api/tasks", values);
      setTasks((prev) => [data.task, ...prev]);
    }
  };

  const handleDelete = async () => {
    if (!deletingTask) return;
    setIsDeleting(true);
    try {
      await api.delete(`/api/tasks/${deletingTask._id}`);
      setTasks((prev) => prev.filter((t) => t._id !== deletingTask._id));
      setDeletingTask(null);
    } catch {
      setError("Couldn't delete the task. Try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      <Navbar />
      <main className="mx-auto max-w-5xl px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-ink">
              Your tasks
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </p>
          </div>
          <Button onClick={openCreateForm}>+ New task</Button>
        </div>

        <div className="mt-6">
          <TaskFilters
            status={statusFilter}
            priority={priorityFilter}
            onStatusChange={setStatusFilter}
            onPriorityChange={setPriorityFilter}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3">
          {isLoading && (
            <div className="flex justify-center py-12">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          )}

          {!isLoading && error && (
            <p className="rounded-lg bg-danger-light px-4 py-3 text-sm text-danger">
              {error}
            </p>
          )}

          {!isLoading && !error && tasks.length === 0 && (
            <div className="rounded-xl border border-dashed border-border py-16 text-center">
              <p className="font-medium text-ink">No tasks yet</p>
              <p className="mt-1 text-sm text-ink-muted">
                Create your first task to get started.
              </p>
            </div>
          )}

          {!isLoading &&
            !error &&
            tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={openEditForm}
                onDelete={setDeletingTask}
              />
            ))}
        </div>
      </main>

      <TaskFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        initialTask={editingTask}
      />

      <ConfirmDialog
        isOpen={!!deletingTask}
        title="Delete task"
        message={`Are you sure you want to delete "${deletingTask?.title}"? This can't be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeletingTask(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <TasksContent />
    </ProtectedRoute>
  );
}