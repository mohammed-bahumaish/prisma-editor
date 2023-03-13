import clsx from "clsx";
import { PanelResizeHandle } from "react-resizable-panels";

import styles from "./styles.module.css";

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
      className={[
        styles.ResizeHandleOuter,
        className,
        "border-brand-dark bg-brand-darker border-[1px] shadow-lg",
        direction === "horizontal" ? "border-t-0" : "border-r-0",
      ].join(" ")}
      id={id}
    >
      <div className={clsx(styles.ResizeHandleInner)}>
        <svg
          className={clsx(
            styles.Icon,
            "text-white",
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
