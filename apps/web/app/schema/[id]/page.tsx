import { YDocProvider } from "app/multiplayer/ydoc-context";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "~/server/auth";
import { prisma } from "~/server/db";
import { MenuBar } from "./components/menu-bar";
import Panels from "./components/panels";
import { getSchemaAsUpdate } from "./doc-utils";

const demoRoomId = -1;

const Schema = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { token: string };
}) => {
  const id = +params.id;
  const isDemoRoom = id === demoRoomId;
  const session = await getServerSession(authOptions);
  if (!session && !isDemoRoom) {
    redirect("/api/auth/signin");
  }

  let doc = await prisma.schema.findUnique({
    where: { id },
    include: {
      shareSchema: {
        select: {
          id: true,
          sharedUsers: { select: { id: true } },
          permission: true,
          token: true,
        },
      },
    },
  });

  let isSchemaSharedWith = false;

  const isOwner = doc?.userId === session?.user.id || isDemoRoom;
  isSchemaSharedWith =
    isSchemaSharedWith ||
    !!doc?.shareSchema?.sharedUsers
      .map((u) => u.id)
      .includes(session?.user.id || "-");

  if (doc?.shareSchema && searchParams.token === doc.shareSchema.token) {
    isSchemaSharedWith = true;
    await prisma.shareSchema.update({
      data: { sharedUsers: { connect: { id: session?.user.id } } },
      where: { id: doc.shareSchema.id },
    });
  }

  if (!isOwner && !isSchemaSharedWith) {
    return <div>You can not view this schema</div>;
  }

  if (!doc && isDemoRoom) {
    await prisma.schema.create({
      data: {
        id: id,
        title: "Demo",
        userId: "clgkzdihb000056y0oe80qo5s", // demo user
        YDoc: getSchemaAsUpdate(),
      },
    });
    doc = await prisma.schema.findUnique({
      where: { id },
      include: {
        shareSchema: {
          select: {
            id: true,
            sharedUsers: { select: { id: true } },
            permission: true,
            token: true,
          },
        },
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
        shareSchema: {
          select: {
            id: true,
            sharedUsers: { select: { id: true } },
            permission: true,
            token: true,
          },
        },
      },
    });
  }

  return (
    <div className="h-screen overflow-hidden">
      <YDocProvider
        yDocUpdate={doc.YDoc!}
        room={id}
        isViewOnly={!isOwner && doc.shareSchema?.permission === "VIEW"}
      >
        <MenuBar />
        <Panels />
      </YDocProvider>
    </div>
  );
};

export default Schema;
