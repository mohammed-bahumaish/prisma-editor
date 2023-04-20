import React from "react";
import Link from "next/link";
import { Icons } from "../ui/icons";

export default function Footer() {
  return (
    <footer className="dark:bg-brand-darker bg-brand-dark/5 ">
      <div className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          {/* Top area: Blocks */}
          <div className="mb-8 grid gap-8 md:mb-12 md:grid-cols-12 lg:gap-20">
            {/* 1st block */}
            <div className="md:col-span-4 lg:col-span-5">
              <div className="mb-2">
                {/* Logo */}
                <Link href="/">
                  <div className="flex flex-shrink-0 items-center gap-4">
                    <Icons.logo />
                    <span className="text-lg font-bold">Prisma Editor</span>
                  </div>
                </Link>
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                A powerful tool to visualize and edit Prisma Schema.
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                This is a community project, not associated with Prisma.
              </div>
            </div>

            {/* 2nd, 3rd and 4th blocks */}
            <div className="grid gap-8 sm:grid-cols-3 md:col-span-8 lg:col-span-7">
              {/* 2nd block */}
              <div className="text-sm">
                <h6 className="mb-1 font-medium text-gray-700 dark:text-gray-200">
                  Featured in
                </h6>
                <ul>
                  <li className="mb-1">
                    <a
                      href="https://trpc.io/docs/awesome-trpc#-open-source-projects-using-trpc"
                      className="text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      Awesome tRPC Collection
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      href="https://create.t3.gg/en/t3-collection"
                      className="text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      T3 Collection
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      href="https://github.com/catalinmiron/awesome-prisma"
                      className="text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      Awesome Prisma
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      href="https://www.futurepedia.io/tool/prisma-editor"
                      className="text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      Futurepedia
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      href="https://www.producthunt.com/posts/prisma-editor"
                      className="text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      Product Hunt
                    </a>
                  </li>
                </ul>
              </div>

              {/* 3rd block */}
              <div className="text-sm">
                <h6 className="mb-1 font-medium text-gray-700 dark:text-gray-200">
                  Resources
                </h6>
                <ul>
                  <li className="mb-1">
                    <a
                      href="https://www.prisma.io/docs/getting-started"
                      className="text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      Set up Prisma
                    </a>
                  </li>
                  <li className="mb-1">
                    <a
                      href="https://www.prisma.io/docs/concepts/components/prisma-schema"
                      className="text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      Prisma Schema
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
