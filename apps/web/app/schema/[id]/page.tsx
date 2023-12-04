import { prisma } from "~/server/db";
import Panels from "./components/panels";
import { getSchemaAsUpdate } from "./doc-utils";
import { YDocProvider } from "app/multiplayer/ydoc-context";

const Schema = async ({ params }: { params: { id: string } }) => {
  const id = +params.id;
  let doc = await prisma.schema.findUnique({ where: { id } });

  const isDemoRoom = id === -1;
  if (!doc && isDemoRoom) {
    await prisma.schema.create({
      data: {
        id: -1,
        title: "Demo",
        userId: "clgkzdihb000056y0oe80qo5s",
        YDoc: getSchemaAsUpdate(),
      },
    });
    doc = await prisma.schema.findUnique({ where: { id } });
  }

  if (!doc) {
    return <div>Schema not found</div>;
  }

  if (!doc.YDoc) {
    doc = await prisma.schema.update({
      data: { YDoc: getSchemaAsUpdate(doc.schema) },
      where: { id },
    });
  }

  return (
    <div className="h-screen overflow-hidden">
      <YDocProvider yDocUpdate={doc.YDoc!} room={`room:${id}`}>
        <Panels />
      </YDocProvider>
    </div>
  );
};

export default Schema;
