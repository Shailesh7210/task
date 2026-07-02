"use client";

import { useState, FormEvent, useEffect } from "react";
import { z } from "zod";
import { Task, TaskPriority, TaskStatus } from "@/types";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/Input";
import { TextArea } from "@/components/TextArea";
import { Select } from "@/components/Select";
import { Button } from "@/components/Button";

const taskFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(120),
  description: z.string().trim().max(2000).optional().default(""),
  dueDate: z.string().min(1, "Due date is required"),
  priority: z.enum(["Low", "Medium", "High"]),
  status: z.enum(["To Do", "In Progress", "Done"]),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  initialTask?: Task | null; // presence = edit mode
}

const emptyForm: TaskFormValues = {
  title: "",
  description: "",
  dueDate: "",
  priority: "Medium",
  status: "To Do",
};

function toDateInputValue(iso: string): string {
  return iso ? iso.slice(0, 10) : "";
}

export function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
}: TaskFormModalProps) {
  const [values, setValues] = useState<TaskFormValues>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setValues(
        initialTask
          ? {
              title: initialTask.title,
              description: initialTask.description,
              dueDate: toDateInputValue(initialTask.dueDate),
              priority: initialTask.priority,
              status: initialTask.status,
            }
          : emptyForm
      );
      setFieldErrors({});
      setFormError("");
    }
  }, [isOpen, initialTask]);

  const update = <K extends keyof TaskFormValues>(key: K, value: TaskFormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError("");

    const parsed = taskFormSchema.safeParse(values);
    if (!parsed.success) {
      const errors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        errors[issue.path[0] as string] = issue.message;
      }
      setFieldErrors(errors);
      return;
    }
    setFieldErrors({});

    setIsSubmitting(true);
    try {
      await onSubmit(parsed.data);
      onClose();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialTask ? "Edit task" : "New task"}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Input
            id="title"
            label="Title"
            placeholder="e.g. fix login bug"
            value={values.title}
            onChange={(e) => update("title", e.target.value)}
            error={fieldErrors.title}
          />
          {/* AI Suggest wiring lands in the next phase */}
          <button
            type="button"
            disabled
            className="mt-1.5 text-xs font-medium text-primary/50 cursor-not-allowed"
            title="Coming next: generate description + priority from the title"
          >
            ✨ AI Suggest
          </button>
        </div>

        <TextArea
          id="description"
          label="Description"
          placeholder="What needs to happen?"
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          error={fieldErrors.description}
        />

        <Input
          id="dueDate"
          label="Due date"
          type="date"
          value={values.dueDate}
          onChange={(e) => update("dueDate", e.target.value)}
          error={fieldErrors.dueDate}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="priority"
            label="Priority"
            value={values.priority}
            onChange={(e) => update("priority", e.target.value as TaskPriority)}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </Select>

          <Select
            id="status"
            label="Status"
            value={values.status}
            onChange={(e) => update("status", e.target.value as TaskStatus)}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </Select>
        </div>

        {formError && (
          <p className="rounded-lg bg-danger-light px-3 py-2 text-sm text-danger">
            {formError}
          </p>
        )}

        <div className="mt-2 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSubmitting}>
            {initialTask ? "Save changes" : "Create task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}