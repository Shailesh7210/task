import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
        </label>
        <select
          ref={ref}
          id={id}
          className={`rounded-lg border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition-colors ${
            error ? "border-danger focus:border-danger" : "border-border focus:border-primary"
          }`}
          {...props}
        >
          {children}
        </select>
        {error && <span className="text-xs text-danger">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";