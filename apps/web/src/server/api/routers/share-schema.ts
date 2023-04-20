import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const shareSchemaRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        schemaId: z.number(),
        permissions: z.enum(["UPDATE", "VIEW"]),
      })
    )
    .mutation(async ({ input, ctx: { prisma, session } }) => {
      const schema = await prisma.schema.findUnique({
        where: {
          id: input.schemaId,
        },
        select: {
          userId: true,
        },
      });

      if (schema?.userId !== session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "NOT AUTHORIZED",
          cause: "NOT AUTHORIZED",
        });
      }

      const shareSchema = await prisma.shareSchema.create({
        data: {
          schema: { connect: { id: input.schemaId } },
          permission: input.permissions,
        },
        select: { id: true, token: true, permission: true },
      });

      return shareSchema;
    }),
  updatePermission: protectedProcedure
    .input(
      z.object({
        shareSchemaId: z.number(),
        permissions: z.enum(["UPDATE", "VIEW"]),
      })
    )
    .mutation(async ({ input, ctx: { prisma, session } }) => {
      const schema = await prisma.shareSchema.findUnique({
        where: {
          id: input.shareSchemaId,
        },
        select: {
          schema: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (schema?.schema?.userId !== session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "NOT AUTHORIZED",
          cause: "NOT AUTHORIZED",
        });
      }

      const shareSchema = await prisma.shareSchema.update({
        data: {
          permission: input.permissions,
        },
        where: {
          id: input.shareSchemaId,
        },
        select: { id: true, token: true, permission: true },
      });

      return shareSchema;
    }),
  remove: protectedProcedure
    .input(
      z.object({
        shareSchemaId: z.number(),
      })
    )
    .mutation(async ({ input, ctx: { prisma, session } }) => {
      const schema = await prisma.shareSchema.findUnique({
        where: {
          id: input.shareSchemaId,
        },
        select: {
          schema: {
            select: {
              userId: true,
            },
          },
        },
      });

      if (schema?.schema?.userId !== session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "NOT AUTHORIZED",
          cause: "NOT AUTHORIZED",
        });
      }

      await prisma.shareSchema.delete({
        where: {
          id: input.shareSchemaId,
        },
        select: { id: true },
      });

      return true;
    }),
});
