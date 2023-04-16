import { Panel, PanelGroup } from "react-resizable-panels";
import { ReactFlowProvider } from "reactflow";
import Diagram from "~/components/diagram/diagram";
import { CodeEditor } from "~/components/editor";
import Header from "~/components/layout/header/header";
import ResizeHandle from "~/components/layout/resizePanels/ResizeHandles";

export default function Home() {
  return (
    <main className="h-screen">
      <Header />
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
    </main>
  );
}
