import { type FC, type ReactNode } from "react";
import Header from "~/components/layout/header/header";
import { cn } from "../ui/lib/cn";

const Layout: FC<{
  children: ReactNode;
  showPromptButton?: boolean;
  className?: string;
}> = ({ children, showPromptButton = false, className }) => {
  return (
    <main
      className={cn(
        "dots min-h-screen bg-slate-100   dark:bg-[#1e1e1e]",
        className
      )}
    >
      <Header showPromptButton={showPromptButton} />
      {children}
    </main>
  );
};

export default Layout;
