import { execa } from "execa";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const schema = req.body.schema;

  const schemafile = "/tmp/schema.prisma";

  fs.writeFileSync(schemafile, schema);

  const { stdout } = await execa("./node_modules/.bin/prisma", [
    "migrate",
    "diff",
    "--to-schema-datamodel",
    schemafile,
    "--from-empty",
    "--script",
  ]);

  res.status(200).send({ sql: stdout });
}
