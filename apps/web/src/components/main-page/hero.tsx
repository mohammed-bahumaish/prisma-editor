import { useSession } from "next-auth/react";
import Link from "next/link";
import { Icons } from "../ui/icons";
import { Button } from "./components/button";
import { GithubStarsButton } from "./components/github-button";

export default function Hero() {
  const { status } = useSession();

  return (
    <section className="container mx-auto space-y-28 px-6">
      <div className="mx-auto pt-12 text-center lg:pt-16 xl:pt-24">
        <div>
          <h2 className="mx-auto max-w-3xl whitespace-pre-wrap text-center text-2xl font-extrabold leading-tight tracking-tight md:text-3xl lg:text-4xl xl:text-5xl">
            A powerful tool to visualize and edit Prisma Schema with ease.
          </h2>
          <p className="mx-auto max-w-[60ch] pt-3 text-center text-sm font-medium text-zinc-600 dark:text-zinc-300 md:text-lg">
            Get real-time visualization and editing capabilities for your Prisma
            schema.
          </p>
          <p className="sr-only">
            Prisma Editor: Prisma Schema Editor, Prisma Schema visualization,
            visualize and edit Prisma schemas.
          </p>
          <p className="sr-only">
            The Prisma schema is the main configuration file when using Prisma.
            It is typically called schema.prisma and contains your database
            connection and data model.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 ">
            <p className="sr-only">
              Source code on github mohammed-bahumaish/prisma-editor
            </p>
            <Link
              href="https://github.com/mohammed-bahumaish/prisma-editor"
              target="_blank"
              rel="noopener noreferrer"
              title="Source code on Github"
            >
              <GithubStarsButton className="lg:text-lg" />
            </Link>

            <>
              <p className="sr-only">Login</p>
              {status !== "authenticated" ? (
                <Link href={`/api/auth/signin`}>
                  <Button variant="primary" className="lg:text-lg">
                    Login
                    <Icons.arrowRight size={20} strokeWidth={3} />
                  </Button>
                </Link>
              ) : (
                <Link href="/schema">
                  <Button variant="primary" className="lg:text-lg">
                    My schemas
                    <Icons.arrowRight size={20} strokeWidth={3} />
                  </Button>
                </Link>
              )}
            </>
          </div>
        </div>
      </div>
    </section>
  );
}
