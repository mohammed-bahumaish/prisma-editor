import { YDocProvider } from "app/multiplayer/ydoc-context";
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import Panels from "./components/panels";
import { SchemaHeader } from "./components/schema-header";
import { getSchemaAsUpdate } from "./doc-utils";

const Schema = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(authOptions)
  const id = +params.id;

  let doc = await prisma.schema.findUnique({
    where: { id },
    include: {
      shareSchema: { select: { sharedUsers: { select: { id: true } }, permission: true } },
    },
  });

  const isOwner = doc?.userId === session?.user.id;
  const isSchemaSharedWith = doc?.shareSchema?.sharedUsers
    .map((u) => u.id)
    .includes(session?.user.id || '-')

  if (!isOwner && !isSchemaSharedWith) {
    return <div>You can not view this schema</div>;
  }

  const isDemoRoom = id === -1;
  if (!doc && isDemoRoom) {
    await prisma.schema.create({
      data: {
        id: id,
        title: "Demo",
        userId: "clgkzdihb000056y0oe80qo5s",
        YDoc: getSchemaAsUpdate(),
      },
    });
    doc = await prisma.schema.findUnique({
      where: { id }, include: {
        shareSchema: { select: { sharedUsers: { select: { id: true } }, permission: true } },
      },
    });
  }

  if (!doc) {
    return <div>Schema not found</div>;
  }

  if (!doc.YDoc) {
    doc = await prisma.schema.update({
      data: { YDoc: getSchemaAsUpdate(doc.schema) },
      where: { id },
      include: {
        shareSchema: { select: { sharedUsers: { select: { id: true } }, permission: true } },
      },
    });
  }

  return (
    <div className="h-screen overflow-hidden">
      <YDocProvider yDocUpdate={doc.YDoc!} room={id} isViewOnly={!isOwner && doc.shareSchema?.permission === "VIEW"}>
        <SchemaHeader />
        <Panels />
      </YDocProvider>
    </div>
  );
};

export default Schema;
