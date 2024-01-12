import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { SchemaCreateButton } from "~/components/dashboard/components/create-schema-button";
import { SchemaItem } from "~/components/dashboard/components/schema-item";
import { DashboardHeader } from "~/components/dashboard/layout/dashboard-header";
import Layout from "~/components/layout";
import LoadingScreen from "~/components/shared/loading-screen";
import { Container } from "~/components/ui/container";
import { EmptyPlaceholder } from "~/components/ui/empty-placeholder";
import { api } from "~/utils/api";

export default function Dashboard() {
  const { data, refetch, isLoading } = api.manageSchema.getSchemas.useQuery();

  const { status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    void router.push("/");
    return <></>;
  }

  if (status === "loading" || isLoading) {
    return (
      <Layout>
        <LoadingScreen />
      </Layout>
    );
  }

  return (
    <Layout>
      <Head>
        <title>My Schemas | Prisma Editor</title>
      </Head>
      <Container className="mt-8 p-4 sm:p-8">
        <DashboardHeader heading="Schemas" text="Create and manage schemas.">
          <SchemaCreateButton />
        </DashboardHeader>
        <div className="mt-4">
          {data?.length ? (
            <Container className="divide-y divide-slate-300 dark:divide-slate-700">
              {data.map((schema) => (
                <SchemaItem
                  key={schema.id}
                  schema={schema}
                  onOperationDone={() => refetch()}
                />
              ))}
            </Container>
          ) : (
            <EmptyPlaceholder>
              <EmptyPlaceholder.Icon name="post" />
              <EmptyPlaceholder.Title>
                No schemas created
              </EmptyPlaceholder.Title>
              <EmptyPlaceholder.Description>
                You don&apos;t have any schemas yet.
              </EmptyPlaceholder.Description>
              <SchemaCreateButton />
            </EmptyPlaceholder>
          )}
        </div>
      </Container>
    </Layout>
  );
}
