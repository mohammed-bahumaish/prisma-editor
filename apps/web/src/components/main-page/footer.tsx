import React from "react";
import Link from "next/link";
import { Icons } from "../ui/icons";

export default function Footer() {
  return (
    <footer className="dark:bg-brand-darker bg-brand-dark/5 ">
      <div className="py-12 md:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-8 grid gap-8 md:mb-12 md:grid-cols-12 lg:gap-20">
            <div className="md:col-span-4 lg:col-span-5">
              <div className="mb-2">
                <Link href="/">
                  <div className="flex flex-shrink-0 items-center gap-4">
                    <Icons.logo />
                    <span className="text-lg font-bold">Prisma Editor</span>
                  </div>
                </Link>
              </div>
              <h5 className="sr-only">
                Prisma Editor: Prisma Schema Editor, Prisma Schema
                visualization, visualize and edit Prisma schemas.
              </h5>
              <div className="text-gray-600 dark:text-gray-400">
                A powerful tool to visualize and edit Prisma Schema.
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                This is a community project, not associated with Prisma.
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-3 md:col-span-8 lg:col-span-7">
              <div className="text-sm">
                <h6 className="mb-1 font-medium text-gray-700 dark:text-gray-200">
                  Featured in
                </h6>
                <ul className="flex flex-col">
                  <li className="mb-1 w-full">
                    <h5 className="sr-only">
                      tRPC End-to-end typesafe APIs made easy. Automatic
                      typesafety & autocompletion inferred from your API-paths,
                      their input data, & outputs
                    </h5>
                    <a
                      href="https://trpc.io/docs/awesome-trpc#-open-source-projects-using-trpc"
                      className="inline-block w-full text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 "
                    >
                      Awesome tRPC Collection
                    </a>
                  </li>
                  <li className="mb-1 w-full">
                    <h5 className="sr-only">
                      Create T3 App The best way to start a full-stack, typesafe
                      Next.js app.
                    </h5>
                    <a
                      href="https://create.t3.gg/en/t3-collection"
                      className="inline-block w-full text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      T3 Collection
                    </a>
                  </li>
                  <li className="mb-1 w-full">
                    <h5 className="sr-only">
                      This is a collection of awesome resources about Prisma.
                      Prisma is an open-source ORM. It makes database access
                      easy with type safety and an auto-generated query builder
                      for TypeScript & Node.js.
                    </h5>
                    <a
                      href="https://github.com/catalinmiron/awesome-prisma"
                      className="inline-block w-full text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      Awesome Prisma
                    </a>
                  </li>
                  <li className="mb-1 w-full">
                    <h5 className="sr-only">
                      Futurepedia is the largest AI tools directory. Browse
                      1500+ AI tools in 50+ categories like copywriting, image
                      generation and video editing. Search and filter the tools
                      by categories, pricing and features.
                    </h5>
                    <a
                      href="https://www.futurepedia.io/tool/prisma-editor"
                      className="inline-block w-full text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      Futurepedia
                    </a>
                  </li>
                  <li className="mb-1 w-full">
                    <h5 className="sr-only">
                      Product Hunt is a curation of the best new products, every
                      day. Discover the latest mobile apps, websites, and
                      technology products that everyone talking about.
                    </h5>
                    <a
                      href="https://www.producthunt.com/posts/prisma-editor"
                      className="inline-block w-full text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      Product Hunt
                    </a>
                  </li>
                </ul>
              </div>

              <div className="text-sm">
                <h6 className="mb-1 font-medium text-gray-700 dark:text-gray-200">
                  Resources
                </h6>
                <ul>
                  <li className="mb-1 w-full">
                    <h5 className="sr-only">
                      Get started with Prisma in 5 minutes. You will learn how
                      to send queries to a SQLite database in a plain TypeScript
                      script using Prisma Client.
                    </h5>
                    <a
                      href="https://www.prisma.io/docs/getting-started"
                      className="inline-block w-full text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                    >
                      Set up Prisma
                    </a>
                  </li>
                  <li className="mb-1 w-full">
                    <h5 className="sr-only">
                      The Prisma schema is the main configuration file when
                      using Prisma. It is typically called schema.prisma and
                      contains your database connection and data model.
                    </h5>
                    <a
                      href="https://www.prisma.io/docs/concepts/components/prisma-schema"
                      className="inline-block w-full text-gray-600 transition duration-150 ease-in-out hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
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
