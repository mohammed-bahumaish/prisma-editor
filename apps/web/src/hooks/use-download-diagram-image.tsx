import { toPng } from "html-to-image";
import { getRectOfNodes, getTransformForBounds, useReactFlow } from "reactflow";

const downloadImage = (dataUrl: string) => {
  const a = document.createElement("a");

  a.setAttribute("download", "prisma-editor.png");
  a.setAttribute("href", dataUrl);
  a.click();
};

const imageWidth = 1024;
const imageHeight = 768;

export const useDownloadDiagramImage = () => {
  const { getNodes } = useReactFlow();
  const download = () => {
    // we calculate a transform for the nodes so that all nodes are visible
    // we then overwrite the transform of the `.react-flow__viewport` element
    // with the style option of the html-to-image library
    const nodesBounds = getRectOfNodes(getNodes());
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2
    );

    void toPng(document.querySelector(".react-flow__viewport") as HTMLElement, {
      backgroundColor: "#1a365d",
      width: imageWidth,
      height: imageHeight,
      style: {
        width: imageWidth.toString(),
        height: imageHeight.toString(),
        transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
      },
    }).then(downloadImage);
  };

  return download;
};
