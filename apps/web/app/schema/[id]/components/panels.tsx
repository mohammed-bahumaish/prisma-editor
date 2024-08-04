"use client";

import { Panel, PanelGroup } from "react-resizable-panels";
import { ReactFlowProvider } from "reactflow";
import Diagram from "~/components/diagram/diagram";
import { CodeEditor } from "~/components/editor";
import ResizeHandle from "~/components/layout/resizePanels/ResizeHandles";

const Panels = () => {
  return (
    <PanelGroup autoSaveId="example" direction="horizontal">
      <Panel defaultSize={20} minSize={0}>
        <div className="h-full w-full overflow-hidden bg-slate-100 dark:bg-[#1e1e1e]">
          <CodeEditor />
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
  );
};

export default Panels;
