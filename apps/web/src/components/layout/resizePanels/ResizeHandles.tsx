import clsx from "clsx";
import { PanelResizeHandle } from "react-resizable-panels";

import styles from "./styles.module.css";

export default function ResizeHandle({
  className = "",
  id,
}: {
  className?: string;
  id?: string;
}) {
  return (
    <PanelResizeHandle
      className={[
        styles.ResizeHandleOuter,
        className,
        "shadow-lg border-[1px] border-t-0 border-brand-dark",
      ].join(" ")}
      id={id}
    >
      <div className={clsx(styles.ResizeHandleInner)}>
        <svg className={clsx(styles.Icon, "text-white")} viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z"
          />
        </svg>
      </div>
    </PanelResizeHandle>
  );
}
