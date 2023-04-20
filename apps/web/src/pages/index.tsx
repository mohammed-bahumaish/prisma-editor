import Layout from "~/components/layout";
import { Preview } from "~/components/main-page/components/preview";
import { Features } from "~/components/main-page/features";
import Footer from "~/components/main-page/footer";
import Hero from "~/components/main-page/hero";

export default function Home() {
  return (
    <Layout>
      <Hero />
      <Preview />
      <Features />
      <Footer />
    </Layout>
  );
}
