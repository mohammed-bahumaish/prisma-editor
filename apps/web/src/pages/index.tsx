import Head from "next/head";
import { Panel, PanelGroup } from "react-resizable-panels";
import Diagram from "~/components/diagram/diagram";
import { CodeEditor, PromptEditor } from "~/components/editor";
import Header from "~/components/layout/header/header";
import ResizeHandle from "~/components/layout/resizePanels/ResizeHandles";
import styles from "~/components/layout/resizePanels/styles.module.css";

export default function Home() {
  return (
    <main className="bg-brand-darker h-screen ">
      <Head>
        <title>
          Prisma Editor - Visualization and Easy Editing of Prisma Schema
        </title>
      </Head>
      <Header />
      <div className="h-[calc(100%-64px)]">
        <PanelGroup autoSaveId="example" direction="horizontal">
          <Panel className={styles.Panel} defaultSize={20} minSize={0}>
            <div className={styles.PanelContent}>
              <div className="h-full w-full">
                <PanelGroup autoSaveId="example" direction="vertical">
                  <Panel className={styles.Panel} defaultSize={100} minSize={0}>
                    <div className={styles.PanelContent}>
                      <CodeEditor />
                    </div>
                  </Panel>
                  <ResizeHandle direction="vertical" />
                  <Panel className={styles.Panel} minSize={0}>
                    <div className={styles.PanelContent}>
                      <PromptEditor />
                    </div>
                  </Panel>
                </PanelGroup>
              </div>
            </div>
          </Panel>
          <ResizeHandle />
          <Panel className={styles.Panel} minSize={0}>
            <div className={styles.PanelContent}>
              <Diagram />
            </div>
          </Panel>
        </PanelGroup>
      </div>
    </main>
  );
}
