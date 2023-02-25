import { dmmfToSchema } from "@prisma-editor/prisma-dmmf-extended";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.status(200).send(await dmmfToSchema(req.body as any));
}
