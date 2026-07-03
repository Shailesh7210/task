"use client";

import { ReactNode } from "react";
import { StatusThread } from "./StatusThread";
import { ThemeToggle } from "./ThemeToggle";

export function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel */}
      <div className="relative hidden w-[40%] flex-col justify-between overflow-hidden bg-brand-panel px-10 py-12 text-white lg:flex">
        <div className="text-lg font-bold tracking-tight">Task Manager</div>

        <div className="flex items-center gap-6">
          <StatusThread />
          <div className="flex flex-col gap-8 text-sm text-white/70">
            <span>To Do</span>
            <span className="mt-2">In Progress</span>
            <span className="mt-2">Done</span>
          </div>
        </div>

        <p className="max-w-xs text-sm text-white/50">
          Every task moves through a clear path. Plan it, work it, finish it.
        </p>
      </div>

      {/* Form panel */}
      <div className="relative flex w-full flex-1 flex-col items-center justify-center bg-bg px-6 py-12 lg:w-[60%]">
        <div className="absolute right-6 top-6">
          <ThemeToggle />
        </div>
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <div className="text-lg font-bold tracking-tight text-ink">
              Task Manager
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            {title}
          </h1>
          <p className="mt-1 mb-8 text-sm text-ink-muted">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}