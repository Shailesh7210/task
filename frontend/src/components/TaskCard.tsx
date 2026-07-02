import { Task } from "@/types";
import { PriorityBadge } from "@/components/PriorityBadge";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/Button";

function formatDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function isOverdue(iso: string, status: Task["status"]): boolean {
  if (status === "Done") return false;
  return new Date(iso) < new Date(new Date().toDateString());
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const overdue = isOverdue(task.dueDate, task.status);

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 transition-shadow hover:shadow-sm sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <h3 className="truncate font-semibold text-ink">{task.title}</h3>
        {task.description && (
          <p className="mt-1 text-sm text-ink-muted line-clamp-2">
            {task.description}
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
          <span
            className={`text-xs ${overdue ? "font-medium text-danger" : "text-ink-muted"}`}
          >
            Due {formatDate(task.dueDate)}
            {overdue && " · overdue"}
          </span>
        </div>
      </div>

      <div className="flex shrink-0 gap-2">
        <Button variant="secondary" onClick={() => onEdit(task)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(task)}>
          Delete
        </Button>
      </div>
    </div>
  );
}