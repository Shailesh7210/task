import { TaskPriority, TaskStatus } from "@/types";

interface TaskFiltersProps {
  status: TaskStatus | "";
  priority: TaskPriority | "";
  onStatusChange: (status: TaskStatus | "") => void;
  onPriorityChange: (priority: TaskPriority | "") => void;
}

export function TaskFilters({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as TaskStatus | "")}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary"
        aria-label="Filter by status"
      >
        <option value="">All statuses</option>
        <option value="To Do">To Do</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value as TaskPriority | "")}
        className="rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-primary"
        aria-label="Filter by priority"
      >
        <option value="">All priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      {(status || priority) && (
        <button
          onClick={() => {
            onStatusChange("");
            onPriorityChange("");
          }}
          className="text-sm font-medium text-primary hover:underline"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}