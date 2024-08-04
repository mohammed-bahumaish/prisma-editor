import { cn } from "~/components/ui/lib/cn";

export const metadata = {
  title: "Prisma Editor | Visualize and Edit Prisma Schemas",
  description:
    "Prisma Editor: Prisma Schema Editor, Prisma Schema visualization, visualize and edit Prisma schemas.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className={cn("dots min-h-screen bg-slate-100 dark:bg-[#1e1e1e]")}>
      {children}
    </main>
  );
}
