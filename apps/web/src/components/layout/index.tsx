import { type FC, type ReactNode } from "react";
import Header from "~/components/layout/header/header";

const Layout: FC<{ children: ReactNode; showPromptButton?: boolean }> = ({
  children,
  showPromptButton = false,
}) => {
  return (
    <main className="h-screen">
      <Header showPromptButton={showPromptButton} />
      {children}
    </main>
  );
};

export default Layout;
