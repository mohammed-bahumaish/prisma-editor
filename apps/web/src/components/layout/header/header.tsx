"use client";
import Link from "next/link";
import { UserAccountNav } from "~/components/shared/user-account-nav";
import { Icons } from "~/components/ui/icons";
import { cn } from "~/components/ui/lib/cn";
import { ModeToggle } from "~/components/ui/mode-toggle";

const Header = () => {
  return (
    <header className="border-b border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
      <div className="mx-auto max-w-7xl">
        <div className="relative flex h-16 items-center justify-between px-4">
          <div className="flex flex-1 items-center sm:justify-start">
            <div className="flex flex-shrink-0 items-center gap-4">
              <Link
                href="/"
                className={cn("flex items-center justify-center gap-2")}
              >
                <Icons.logo />
                <h1 className="text-lg font-bold">Prisma Editor</h1>
              </Link>
              <p className="sr-only">
                Prisma Editor: Prisma Schema Editor, Prisma Schema
                visualization, visualize and edit Prisma schemas.
              </p>
            </div>
          </div>
          <div className="flex items-center sm:gap-2">
            <ModeToggle />
            <UserAccountNav />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
