/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
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
    <header className="border-b border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
      {process.env.NEXT_PUBLIC_SHOW_NEW_URL && (
        <div className=" bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-blue-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-blue-700">
                Prisma editor is now at{" "}
                <a href="https://prisma-editor.vercel.app">
                  https://prisma-editor.vercel.app
                </a>
              </p>
              <p className="mt-3 text-sm md:ml-6 md:mt-0">
                <a
                  href="https://prisma-editor.vercel.app"
                  className="whitespace-nowrap font-medium text-blue-700 hover:text-blue-600"
                >
                  Go
                  <span aria-hidden="true"> &rarr;</span>
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="mx-auto max-w-7xl">
        <div className="relative flex h-16 items-center justify-between px-4">
          <div className="flex flex-1 items-center sm:justify-start">
            <Link href="/">
              <div className="flex flex-shrink-0 items-center gap-4">
                <Icons.logo />
                <h1 className="text-lg font-bold">Prisma Editor</h1>
                <p className="sr-only">
                  Prisma Editor: Prisma Schema Editor, Prisma Schema
                  visualization, visualize and edit Prisma schemas.
                </p>
              </div>
            </Link>
          </div>
          <div className="flex items-center sm:gap-2">
            {showPromptButton && (
              <>
                <a
                  href="https://github.com/mohammed-bahumaish/prisma-editor/issues/new"
                  className="hidden text-sm sm:block"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="sm" className="mx-0">
                    Report issue
                  </Button>
                </a>
                <PromptDialog />
              </>
            )}
            <ModeToggle />
            <UserAccountNav />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
