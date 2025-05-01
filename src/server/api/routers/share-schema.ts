import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const shareSchemaRouter = createTRPCRouter({
  getShareToken: protectedProcedure
    .input(
      z.object({
        schemaId: z.number(),
        permissions: z.enum(["UPDATE", "VIEW"]).optional(),
      })
    )
    .query(async ({ input, ctx: { prisma, session } }) => {
      const schema = await prisma.schema.findUnique({
        where: {
          id: input.schemaId,
        },
        select: {
          userId: true,
          shareSchema: {
            select: {
              id: true,
            },
          },
        },
      });

      if (schema?.userId !== session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "NOT AUTHORIZED",
          cause: "NOT AUTHORIZED",
        });
      }

      if (typeof schema.shareSchema?.id === "undefined") {
        const shareSchema = await prisma.shareSchema.create({
          data: {
            schema: { connect: { id: input.schemaId } },
            permission: input.permissions || "VIEW",
          },
          select: { id: true, token: true, permission: true },
        });

        return shareSchema;
      } else {
        const shareSchema = await prisma.shareSchema.update({
          where: { id: schema.shareSchema.id },
          data: {
            ...(input.permissions
              ? { permission: { set: input.permissions } }
              : {}),
          },
          select: { id: true, token: true, permission: true },
        });

        return shareSchema;
      }
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
