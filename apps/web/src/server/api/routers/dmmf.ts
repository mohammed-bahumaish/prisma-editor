import {
  dmmfToSchema,
  schemaToDmmf,
  type DMMF,
} from "@prisma-editor/prisma-dmmf-extended";
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
    const schemafile = "/tmp/schema.prisma";
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
  sqlToSchema: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    const schemafile = "/tmp/schema.sql";
    fs.writeFileSync(
      schemafile,
      `
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;

      ${input}
     `
    );
    await execa("./node_modules/.bin/prisma", [
      "db",
      "execute",
      "--url",
      "postgresql://postgres:MsaSpi1@3InFiNiTy@db.qyslgxnvzdfzdxnylyoo.supabase.co:5432/postgres?connection_limit=10000",
      "--file",
      schemafile,
    ]);

    const { stdout } = await execa("./node_modules/.bin/prisma", [
      "db",
      "pull",
      "--force",
      "--print",
    ]);

    return stdout;
  }),
});
