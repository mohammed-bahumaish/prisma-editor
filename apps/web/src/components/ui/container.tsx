import * as React from "react";
import { cn } from "~/components/ui/lib/cn";

export type InputProps = React.InputHTMLAttributes<HTMLDivElement> & {
  error?: string;
};

const Container = React.forwardRef<HTMLDivElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn(
          "mx-auto max-w-4xl rounded-lg border-[1px] border-slate-300 bg-white text-slate-900   dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 ",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Container.displayName = "Container";

export { Container };
