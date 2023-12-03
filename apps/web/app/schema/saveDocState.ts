"use server";

import { prisma } from "~/server/db";

export const saveDocState = async ({
  docState,
  schemaId,
}: {
  docState: string;
  schemaId: number;
}) => {
  await prisma.schema.update({
    data: { YDoc: docState },
    where: { id: schemaId },
  });
};
