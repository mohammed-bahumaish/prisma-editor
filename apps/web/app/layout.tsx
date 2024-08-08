import "~/styles/globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Prisma Editor | Visualize and Edit Prisma Schemas",
  description:
    "Prisma Editor: Prisma Schema Editor, Prisma Schema visualization, visualize and edit Prisma schemas.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
