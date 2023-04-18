/* eslint-disable @next/next/no-img-element */
import { type FC } from "react";
import { PromptDialog } from "~/components/diagram/components/prompt-dialog";
import { UserAccountNav } from "~/components/shared/user-account-nav";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/ui/icons";
import { ModeToggle } from "~/components/ui/mode-toggle";

const Header: FC<{ showPromptButton?: boolean }> = ({
  showPromptButton = false,
}) => {
  return (
    <div className="border-b border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
      <div className="mx-auto max-w-7xl">
        <div className="relative flex h-16 items-center justify-between px-4">
          <div className="flex flex-1 items-center sm:justify-start">
            <div className="flex flex-shrink-0 items-center gap-4">
              <Icons.logo />
              <span className="text-lg font-bold">Prisma Editor</span>
            </div>
          </div>
          <div className="flex items-center sm:gap-2">
            <a
              href="https://github.com/mohammed-bahumaish/prisma-editor/issues/new"
              className="hidden text-sm sm:block"
            >
              <Button variant="ghost" size="sm" className="mx-0">
                Report issue
              </Button>
            </a>
            <a
              href="https://github.com/mohammed-bahumaish/prisma-editor"
              target="_blank"
              rel="noopener noreferrer"
              title="Source code on Github"
            >
              <Button variant="ghost" size="sm" className="mx-0">
                <Icons.gitHub />
              </Button>
            </a>
            {showPromptButton && <PromptDialog />}
            <ModeToggle />
            <UserAccountNav />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
