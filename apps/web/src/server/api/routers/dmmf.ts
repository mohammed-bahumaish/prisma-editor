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
  sqlToSchema: publicProcedure.mutation(async () => {
    const schemafile = "/tmp/schema.sql";
    fs.writeFileSync(
      schemafile,
      `
      DROP SCHEMA public CASCADE;
      CREATE SCHEMA public;

      -- CreateEnum
      CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

      -- CreateTable
      CREATE TABLE "User" (
          "id" SERIAL NOT NULL,
          "email" TEXT NOT NULL,
          "name" TEXT,
      
          CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );
      
      -- CreateTable
      CREATE TABLE "Post" (
          "id" SERIAL NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          "title" TEXT NOT NULL,
          "content" TEXT,
          "published" BOOLEAN NOT NULL DEFAULT false,
          "viewCount" INTEGER NOT NULL DEFAULT 0,
          "authorId" INTEGER,
      
          CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
      );

      -- CreateIndex
      CREATE UNIQUE INDEX "User_email_key" ON "User"("email");


      -- AddForeignKey
    ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
     `
    );
    const { stdout: push } = await execa("./node_modules/.bin/prisma", [
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
