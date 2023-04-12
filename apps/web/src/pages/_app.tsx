import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import Head from "next/head";
import Script from "next/script";
import { DefaultSeo } from "next-seo";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <>
      <DefaultSeo
        title="Prisma Editor | Visualize and Edit Prisma Schemas"
        description="Effortlessly visualize and edit Prisma schemas with Prisma Editor. Create, modify, and maintain complex database structures, generate SQL, and edit schemas directly from the graph."
        canonical="https://prisma-editor.up.railway.app/"
        openGraph={{
          url: "https://prisma-editor.up.railway.app/",
          title: "Prisma Editor | Visualize and Edit Prisma Schemas",
          description:
            "Effortlessly visualize and edit Prisma schemas with Prisma Editor. Create, modify, and maintain complex database structures, generate SQL, and edit schemas directly from the graph.",
          siteName: "Prisma Editor | Visualize and Edit Prisma Schemas",
        }}
        twitter={{
          handle: "@prisma_editor",
          site: "@prisma_editor",
          cardType: "summary_large_image",
        }}
        additionalMetaTags={[
          {
            name: "keywords",
            content:
              "Prisma Editor, Prisma schema visualization, Prisma schema editing, Database schema editor, Visual database schema design, Prisma schema generator, SQL generation from Prisma schema",
          },
        ]}
      />
      <Head>
        <meta
          name="google-site-verification"
          content="8U9A6jsEwr0vCbYVqJC33MwLSq7YNbk5uRIz8EJdKjs"
        />
      </Head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-F8EGGW12QB"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-F8EGGW12QB');
        `}
      </Script>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
