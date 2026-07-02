import { TaskStatus } from "@/types";
import { StatusDot } from "./StatusThread";

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-0.5 text-xs font-medium text-ink">
      <StatusDot status={status} />
      {status}
    </span>
  );
}