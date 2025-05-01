import clsx from "clsx";
import { PanelResizeHandle } from "react-resizable-panels";
import { cn } from "~/components/ui/lib/cn";

export default function ResizeHandle({
  className = "",
  direction = "horizontal",
  id,
}: {
  className?: string;
  direction?: "horizontal" | "vertical";
  id?: string;
}) {
  return (
    <PanelResizeHandle
      className={cn(
        "group",
        "relative flex-shrink-0 flex-grow-0 basis-[1.5em]",
        "border-[1px] border-b border-slate-200 bg-white text-slate-900 shadow-lg   dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
        direction === "horizontal" ? "border-t-0" : "border-r-0",
        className
      )}
      id={id}
    >
      <div className="absolute inset-1 flex items-center   group-data-[resize-handle-active]:bg-slate-100 dark:group-data-[resize-handle-active]:bg-slate-800">
        <svg
          className={clsx(
            "w-full",
            "text-black   dark:text-white",
            direction === "horizontal" ? "rotate-90" : ""
          )}
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z"
          />
        </svg>
      </div>
    </PanelResizeHandle>
  );
}
