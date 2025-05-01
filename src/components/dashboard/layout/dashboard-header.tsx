import React from "react";

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
}

export function DashboardHeader({
  heading,
  text,
  children,
}: DashboardHeaderProps) {
  return (
    <div className="flex justify-between px-2">
      <div className="grid gap-1">
        <h1 className="text-2xl font-bold tracking-wide text-slate-900 dark:text-white">
          {heading}
        </h1>
        {text && (
          <p className="text-neutral-500 dark:text-neutral-300">{text}</p>
        )}
      </div>
      {children}
    </div>
  );
}
