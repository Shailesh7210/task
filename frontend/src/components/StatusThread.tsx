import { TaskStatus } from "@/types";

const STATUS_ORDER: TaskStatus[] = ["To Do", "In Progress", "Done"];

const STATUS_COLOR: Record<TaskStatus, string> = {
  "To Do": "bg-ink-muted",
  "In Progress": "bg-primary",
  Done: "bg-success",
};

/**
 * Decorative brand mark: a vertical sequence of connected dots representing
 * the task lifecycle (To Do -> In Progress -> Done). Used large on the auth
 * screen, and the same visual language (colored dot) is reused small next
 * to status badges throughout the app.
 */
export function StatusThread({ active }: { active?: TaskStatus }) {
  return (
    <div className="flex flex-col items-center gap-0">
      {STATUS_ORDER.map((status, i) => (
        <div key={status} className="flex flex-col items-center">
          <div
            className={`h-3 w-3 rounded-full transition-opacity ${STATUS_COLOR[status]} ${
              active && active !== status ? "opacity-30" : "opacity-100"
            }`}
          />
          {i < STATUS_ORDER.length - 1 && (
            <div className="h-10 w-px bg-white/20" />
          )}
        </div>
      ))}
    </div>
  );
}

export function StatusDot({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-block h-2 w-2 rounded-full ${STATUS_COLOR[status]}`}
    />
  );
}