/* eslint-disable @next/next/no-img-element */
import { Button } from "~/components/ui/button";
import { Icons } from "~/components/ui/icons";
import { ModeToggle } from "~/components/ui/mode-toggle";

const Header = () => {
  return (
    <div className="border-b border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
      <div className="mx-auto max-w-7xl">
        <div className="relative flex h-16 items-center justify-between px-4">
          <div className="flex flex-1 items-center sm:justify-start">
            <div className="flex flex-shrink-0 items-center gap-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 159 194"
                fill="none"
                className="h-8 w-8"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M2.39749 122.867C0.476293 126 0.506027 129.955 2.47414 133.059L38.0964 189.252C40.4083 192.899 44.8647 194.562 49.0006 193.321L151.798 162.482C157.408 160.799 160.23 154.541 157.778 149.222L91.6953 5.87265C88.4726 -1.11816 78.7573 -1.69199 74.734 4.87082L2.39749 122.867ZM89.9395 38.6438C88.535 35.3938 83.7788 35.8944 83.0817 39.3656L57.64 166.044C57.1035 168.715 59.6044 170.996 62.215 170.217L133.24 149.015C135.313 148.397 136.381 146.107 135.522 144.121L89.9395 38.6438Z"
                  fill="currentColor"
                />
              </svg>
              <span className="text-lg font-bold">Prisma Editor</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/mohammed-bahumaish/prisma-editor/issues/new"
              className="text-sm"
            >
              <Button variant="ghost">Report issue</Button>
            </a>
            <a
              href="https://github.com/mohammed-bahumaish/prisma-editor"
              target="_blank"
              rel="noopener noreferrer"
              title="Source code on Github"
            >
              <Button variant="ghost">
                <Icons.gitHub />
              </Button>
            </a>
            <ModeToggle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
