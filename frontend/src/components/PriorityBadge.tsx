import { TaskPriority } from "@/types";

const PRIORITY_STYLES: Record<TaskPriority, string> = {
  Low: "bg-bg text-ink-muted border-border",
  Medium: "bg-primary-light text-primary border-primary/20",
  High: "bg-warning-light text-warning border-warning/30",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${PRIORITY_STYLES[priority]}`}
    >
      {priority}
    </span>
  );
}