import { signIn, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { Panel, PanelGroup } from "react-resizable-panels";
import { ReactFlowProvider } from "reactflow";
import { shallow } from "zustand/shallow";
import Diagram from "~/components/diagram/diagram";
import { CodeEditor } from "~/components/editor";
import Layout from "~/components/layout";
import ResizeHandle from "~/components/layout/resizePanels/ResizeHandles";
import LoadingScreen from "~/components/shared/loading-screen";
import { useSchemaStore } from "~/components/store/schemaStore";

const Schema = () => {
  const {
    isParseDmmfLoading,
    isRestoreSavedSchemaLoading,
    restoreSavedSchema,
  } = useSchemaStore()(
    (state) => ({
      isParseDmmfLoading: state.isParseDmmfLoading,
      isRestoreSavedSchemaLoading: state.isRestoreSavedSchemaLoading,
      restoreSavedSchema: state.restoreSavedSchema,
    }),
    shallow
  );
  const router = useRouter();

  useEffect(() => {
    void restoreSavedSchema((router.query.token || "") as string);
  }, [restoreSavedSchema, router.query.token]);

  const { status } = useSession();
  const isFirst = useRef(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      void signIn("github", { callbackUrl: router.asPath });
    }
  }, [router.asPath, status]);

  if (
    status === "loading" ||
    status === "unauthenticated" ||
    ((isParseDmmfLoading || isRestoreSavedSchemaLoading) && isFirst.current)
  ) {
    isFirst.current = false;

    return (
      <Layout className="h-screen">
        <LoadingScreen />
      </Layout>
    );
  }

  return (
    <Layout showPromptButton className="h-screen">
      <Head>
        <title>Edit Schema | Prisma Editor</title>
      </Head>
      <div className="h-[calc(100%-65px)] overflow-hidden">
        <PanelGroup autoSaveId="example" direction="horizontal">
          <Panel defaultSize={20} minSize={0}>
            <div className="h-full w-full overflow-hidden bg-slate-100 dark:bg-[#1e1e1e]">
              <CodeEditor key="code" />
            </div>
          </Panel>
          <ResizeHandle />
          <Panel minSize={0}>
            <div className="h-full w-full overflow-hidden bg-slate-100 dark:bg-[#1e1e1e]">
              <ReactFlowProvider>
                <Diagram />
              </ReactFlowProvider>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </Layout>
  );
};

export default Schema;
