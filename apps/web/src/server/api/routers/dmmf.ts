import {
  dmmfToSchema,
  schemaToDmmf,
  type DMMF,
} from "@mohammed-bahumaish/prisma-dmmf-extended";
import { type ConfigMetaFormat } from "@prisma/internals";
import { execa } from "execa";
import fs from "fs";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const dmmfRouter = createTRPCRouter({
  dmmfToPrismaSchema: publicProcedure
    .input(
      z.object({
        dmmf: z.object({
          models: z.array(z.any()),
          enums: z.array(z.any()),
        }),
        config: z
          .object({
            datasources: z.array(z.any()),
            generators: z.array(z.any()),
          })
          .nullish(),
      })
    )
    .mutation(
      async ({ input }) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        await dmmfToSchema(
          input as {
            dmmf: DMMF.Document["datamodel"];
            config: ConfigMetaFormat;
          }
        )
    ),

  schemaToDmmf: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => await schemaToDmmf(input)),

  schemaToSql: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const schemafile = "./temp.prisma";
    fs.writeFileSync(schemafile, input);
    const { stdout } = await execa("./node_modules/.bin/prisma", [
      "migrate",
      "diff",
      "--to-schema-datamodel",
      schemafile,
      "--from-empty",
      "--script",
    ]);

    return stdout;
  }),
});
