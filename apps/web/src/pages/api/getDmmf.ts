import type { NextApiRequest, NextApiResponse } from "next";
import { schemaToDmmf } from "@prisma-editor/prisma-dmmf-extended";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const schema: string = req.body.schema as string;
  const props = await schemaToDmmf(schema);
  res.status(200).send(props);
}
