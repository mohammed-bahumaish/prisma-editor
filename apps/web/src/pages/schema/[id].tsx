import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Panel, PanelGroup } from "react-resizable-panels";
import { ReactFlowProvider } from "reactflow";
import Diagram from "~/components/diagram/diagram";
import { CodeEditor } from "~/components/editor";
import Layout from "~/components/layout";
import ResizeHandle from "~/components/layout/resizePanels/ResizeHandles";
import LoadingScreen from "~/components/shared/loading-screen";

const Schema = () => {
  const { status } = useSession();
  const router = useRouter();

  if (status === "unauthenticated") {
    void router.push("/api/auth/signin");
    return <></>;
  }

  if (status === "loading") {
    return (
      <Layout>
        <LoadingScreen />
      </Layout>
    );
  }

  return (
    <Layout showPromptButton>
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
