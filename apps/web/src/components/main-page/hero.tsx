import Link from "next/link";
import { Icons } from "../ui/icons";
import { Button } from "./components/button";
import { GithubStarsButton } from "./components/github-button";
import { signIn, useSession } from "next-auth/react";

export default function Hero() {
  const { status } = useSession();

  return (
    <section className="container mx-auto space-y-28 px-6">
      <header className="mx-auto pt-12 text-center lg:pt-16 xl:pt-24">
        <div>
          <h1 className="mx-auto max-w-3xl whitespace-pre-wrap text-center text-2xl font-extrabold leading-tight tracking-tight md:text-3xl lg:text-4xl xl:text-5xl">
            A powerful tool to visualize and edit{" "}
            <span className="decoration-brand-teal-1 text-slate-900 underline decoration-wavy decoration-from-font underline-offset-2 dark:text-slate-100">
              Prisma Schema
            </span>{" "}
            with ease.
          </h1>
          <p className="mx-auto max-w-[60ch] pt-3 text-center text-sm font-medium text-zinc-600 dark:text-zinc-300 md:text-lg">
            See your database structures in real-time as you create, modify and
            maintain them.
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 ">
            <div className="">
              <GithubStarsButton className="lg:text-lg" />
            </div>
            <div className="">
              {status !== "authenticated" ? (
                <Button
                  variant="primary"
                  className="lg:text-lg"
                  onClick={() => signIn("github", { callbackUrl: "/schema" })}
                >
                  Login
                  <Icons.arrowRight size={20} strokeWidth={3} />
                </Button>
              ) : (
                <Link href="/schema">
                  <Button variant="primary" className="lg:text-lg">
                    My schemas
                    <Icons.arrowRight size={20} strokeWidth={3} />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>
    </section>
  );
}
