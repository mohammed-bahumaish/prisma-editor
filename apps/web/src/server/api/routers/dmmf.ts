import {
  dmmfToSchema,
  schemaToDmmf,
  type DMMF,
} from "@prisma-editor/prisma-dmmf-extended";
import { formatSchema, type ConfigMetaFormat } from "@prisma/internals";
import { execa } from "execa";
import fs from "fs";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import stripAnsi from "strip-ansi";

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
    try {
      await execa("./node_modules/.bin/prisma", [
        "db",
        "execute",
        "--url",
        env.SQL_CONVERTER_DATABASE_URL,
        "--file",
        schemafile,
      ]);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      const message = stripAnsi(error?.stderr)
        .replaceAll("\n", "")
        .replaceAll("db error: ", "")
        .replaceAll("ERROR: ", "")
        .replaceAll("Error: ", "");

      if (message.includes("database"))
        return { error: "Can't reach database" };

      return { error: message };
    }

    const { stdout } = await execa("./node_modules/.bin/prisma", [
      "db",
      "pull",
      "--url",
      env.SQL_CONVERTER_DATABASE_URL,
      "--force",
      "--print",
    ]);

    const clean = stdout
      .split("\n")
      .map((line) => {
        if (line.includes("url") && line.includes("="))
          return `url = env("DATABASE_URL")`;
        if (line.includes("//")) return "";
        return line;
      })
      .join("\n");

    const schema = await formatSchema({ schema: clean });

    const dmmf = await schemaToDmmf(schema);
    return { schema, dmmf };
  }),
});
