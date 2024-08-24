import { toPng } from "html-to-image";
import { getRectOfNodes, useReactFlow } from "reactflow";

const downloadImage = (dataUrl: string) => {
  const a = document.createElement("a");
  a.setAttribute("download", "prisma-editor.png");
  a.setAttribute("href", dataUrl);
  a.click();
};

export const useDownloadDiagramImage = () => {
  const { getNodes } = useReactFlow();

  const download = () => {
    const nodes = getNodes();

    if (nodes.length === 0) {
      console.warn("No nodes found.");
      return;
    }

    const nodesBounds = getRectOfNodes(nodes);
    const padding = 20; // Add padding to ensure nodes are not too close to the edges

    const width = nodesBounds.width + padding * 2;
    const height = nodesBounds.height + padding * 2;

    const reactFlowElement = document.querySelector(
      ".react-flow__viewport"
    ) as HTMLElement;

    if (!reactFlowElement) {
      console.error("React Flow viewport element not found.");
      return;
    }

    // Backup original styles
    const originalWidth = reactFlowElement.style.width;
    const originalHeight = reactFlowElement.style.height;
    const originalTransform = reactFlowElement.style.transform;

    // Temporarily set the size of the viewport to fit the entire diagram
    reactFlowElement.style.width = `${width}px`;
    reactFlowElement.style.height = `${height}px`;
    reactFlowElement.style.transform = `translate(${
      -nodesBounds.x + padding
    }px, ${-nodesBounds.y + padding}px) scale(1)`;

    // Adjust the parent container size to accommodate the resized viewport
    const reactFlowParentElement = reactFlowElement.parentElement as HTMLElement;
    const originalParentWidth = reactFlowParentElement.style.width;
    const originalParentHeight = reactFlowParentElement.style.height;
    reactFlowParentElement.style.width = `${width}px`;
    reactFlowParentElement.style.height = `${height}px`;

    toPng(reactFlowElement, {
      backgroundColor: "transparent",
      width,
      height,
      style: {
        width: `${width}px`,
        height: `${height}px`,
      },
    })
      .then((dataUrl) => {
        // Reset styles after capture
        reactFlowElement.style.width = originalWidth;
        reactFlowElement.style.height = originalHeight;
        reactFlowElement.style.transform = originalTransform;

        // Reset parent container size
        reactFlowParentElement.style.width = originalParentWidth;
        reactFlowParentElement.style.height = originalParentHeight;

        downloadImage(dataUrl);
      })
      .catch((err) => {
        console.error("Error capturing image:", err);
        // Reset styles in case of an error
        reactFlowElement.style.width = originalWidth;
        reactFlowElement.style.height = originalHeight;
        reactFlowElement.style.transform = originalTransform;

        // Reset parent container size
        reactFlowParentElement.style.width = originalParentWidth;
        reactFlowParentElement.style.height = originalParentHeight;
      });
  };

  return download;
};
