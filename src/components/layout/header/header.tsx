"use client";
import { type Message } from "app/multiplayer/multiplayer-state";
import Link from "next/link";
import { PromptDialog } from "~/components/diagram/components/prompt-dialog";
import MultiplayerAvatars from "~/components/multi-player/avatars";
import MultiplayerChat from "~/components/multi-player/chat";
import { UserAccountNav } from "~/components/shared/user-account-nav";
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/ui/icons";
import { cn } from "~/components/ui/lib/cn";
import { ModeToggle } from "~/components/ui/mode-toggle";

const Header = ({
  isSaving,
  users,
}: {
  isSaving?: boolean;
  users?: Message["sender"][];
}) => {
  return (
    <header className="border-b border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
      <div className="mx-auto max-w-7xl">
        <div className="relative flex h-16 items-center justify-between px-4">
          <div className="flex flex-1 items-center sm:justify-start">
            <div className="flex flex-shrink-0 items-center gap-4">
              <Link
                href="/"
                className={cn("flex items-center justify-center gap-2", {
                  "hidden md:flex": !!users,
                })}
              >
                <Icons.logo />
                <h1 className="text-lg font-bold">Prisma Editor</h1>
              </Link>

              {users && (
                <>
                  {isSaving ? (
                    <div title="Saving state...">
                      <Icons.spinner />
                    </div>
                  ) : (
                    <div title="State is saved.">
                      <svg
                        width="25px"
                        height="25px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M15.0303 10.4696C15.3232 10.7625 15.3232 11.2374 15.0303 11.5303L11.5303 15.0303C11.2374 15.3232 10.7625 15.3232 10.4696 15.0303L8.46962 13.0303C8.17673 12.7374 8.17673 12.2625 8.46962 11.9696C8.76252 11.6767 9.23739 11.6767 9.53028 11.9696L11 13.4393L13.9696 10.4696C14.2625 10.1767 14.7374 10.1767 15.0303 10.4696Z"
                          fill="#ffffff"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12.9318 6.20825C11.3815 6.20825 10.0405 7.11058 9.40807 8.42206C9.23802 8.77467 8.82537 8.93718 8.46055 8.79522C7.96981 8.60427 7.43535 8.49913 6.87455 8.49913C4.45808 8.49913 2.49915 10.4581 2.49915 12.8745C2.49915 15.291 4.45808 17.2499 6.87455 17.2499H18.5232C20.1677 17.2499 21.5008 15.9168 21.5008 14.2724C21.5008 12.6279 20.1677 11.2948 18.5232 11.2948C18.2556 11.2948 17.9974 11.3299 17.7523 11.3954C17.5121 11.4595 17.2558 11.4005 17.0678 11.2377C16.8799 11.0749 16.7848 10.8296 16.814 10.5827C16.832 10.4305 16.8413 10.2753 16.8413 10.1177C16.8413 7.95858 15.091 6.20825 12.9318 6.20825ZM8.37996 7.19396C9.34171 5.69967 11.0204 4.70825 12.9318 4.70825C15.8124 4.70825 18.167 6.9597 18.3321 9.79883C18.3955 9.79616 18.4592 9.79481 18.5232 9.79481C20.9961 9.79481 23.0008 11.7995 23.0008 14.2724C23.0008 16.7453 20.9961 18.7499 18.5232 18.7499H6.87455C3.62965 18.7499 0.999146 16.1194 0.999146 12.8745C0.999146 9.62964 3.62965 6.99913 6.87455 6.99913C7.39421 6.99913 7.89893 7.06678 8.37996 7.19396Z"
                          fill="#ffffff"
                        />
                      </svg>
                    </div>
                  )}
                  <MultiplayerChat>
                    <MultiplayerAvatars users={users} />
                  </MultiplayerChat>
                </>
              )}
              <p className="sr-only">
                Prisma Editor: Prisma Schema Editor, Prisma Schema
                visualization, visualize and edit Prisma schemas.
              </p>
            </div>
          </div>
          <div className="flex items-center sm:gap-2">
            <a
              href="https://github.com/mohammed-bahumaish/prisma-editor/issues/new"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="sm">
                🐛 <span className="hidden md:block">{` `}Report an issue</span>
              </Button>
            </a>
            <PromptDialog />
            <ModeToggle />
            <UserAccountNav />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
