import { type FC, type ReactNode } from "react";
import Header from "~/components/layout/header/header";

const Layout: FC<{ children: ReactNode; showPromptButton?: boolean }> = ({
  children,
  showPromptButton = false,
}) => {
  return (
    <main
      className="h-screen bg-slate-100 transition-colors duration-200 dark:bg-[#1e1e1e]"
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23777777' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='0.5'/%3E%3Ccircle cx='13' cy='13' r='0'/%3E%3C/g%3E%3C/svg%3E")`,
      }}
    >
      <Header showPromptButton={showPromptButton} />
      {children}
    </main>
  );
};

export default Layout;
