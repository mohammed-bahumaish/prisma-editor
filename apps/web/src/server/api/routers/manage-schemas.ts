import { type Permission } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { string, z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const manageSchemaRouter = createTRPCRouter({
  createSchema: protectedProcedure
    .input(
      z.object({
        title: z.string(),
      })
    )
    .mutation(async ({ input, ctx: { prisma, session } }) => {
      const schema = await prisma.schema.create({
        data: {
          title: input.title,
          user: { connect: { id: session?.user.id } },
        },
        select: { id: true },
      });
      return schema.id;
    }),
  getSchema: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        token: z.string().optional(),
      })
    )
    .query(async ({ input, ctx: { prisma, session } }) => {
      const schema = await prisma.schema.findUnique({
        where: { id: input.id },
        select: {
          schema: true,
          userId: true,
          shareSchema: {
            select: {
              id: true,
              sharedUsers: { select: { id: true } },
              token: true,
              permission: true,
            },
          },
        },
      });

      const isSchemaSharedWith = schema?.shareSchema?.sharedUsers
        .map((u) => u.id)
        .includes(session.user.id);

      const isOwner = schema?.userId === session.user.id;

      if (!isOwner && !isSchemaSharedWith) {
        if (schema?.shareSchema?.token === input.token) {
          await prisma.shareSchema.update({
            where: {
              id: schema?.shareSchema?.id,
            },
            data: { sharedUsers: { connect: { id: session.user.id } } },
          });
        } else {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "NOT AUTHORIZED",
            cause: "NOT AUTHORIZED",
          });
        }
      }

      const permission: Permission = isOwner
        ? "UPDATE"
        : schema?.shareSchema?.permission || "VIEW";

      return { schema: schema?.schema || "", permission: permission };
    }),
  getSchemas: protectedProcedure.query(async ({ ctx: { prisma, session } }) => {
    const schemas = await prisma.schema.findMany({
      where: {
        OR: [
          { user: { id: { equals: session?.user.id } } },
          { shareSchema: { sharedUsers: { some: { id: session?.user.id } } } },
        ],
      },
      select: {
        id: true,
        title: true,
        schema: true,
        updatedAt: true,
        userId: true,
      },
    });

    return schemas;
  }),
  updateSchema: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        schema: string(),
      })
    )
    .mutation(async ({ input, ctx: { prisma, session } }) => {
      const schema = await prisma.schema.findUnique({
        where: { id: input.id },
        select: {
          userId: true,
          shareSchema: {
            select: { sharedUsers: { select: { id: true } }, permission: true },
          },
        },
      });

      const isOwner = schema?.userId === session.user.id;
      const isSchemaSharedWith = schema?.shareSchema?.sharedUsers
        .map((u) => u.id)
        .includes(session.user.id);

      const permission: Permission = isOwner
        ? "UPDATE"
        : isSchemaSharedWith
        ? schema?.shareSchema?.permission || "VIEW"
        : "VIEW";

      if (permission !== "UPDATE") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "NO PERMISSION",
          cause: "NO PERMISSION",
        });
      }

      await prisma.schema.update({
        where: { id: input.id },
        data: { schema: input.schema },
        select: { id: true },
      });
      return true;
    }),
  deleteSchema: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ input, ctx: { prisma, session } }) => {
      const schema = await prisma.schema.findUnique({
        where: { id: input.id },
        select: {
          userId: true,
          shareSchema: { select: { sharedUsers: { select: { id: true } } } },
        },
      });

      const isOwner = schema?.userId === session.user.id;
      const isSchemaSharedWith = schema?.shareSchema?.sharedUsers
        .map((u) => u.id)
        .includes(session.user.id);

      if (!isOwner && !isSchemaSharedWith) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "NOT AUTHORIZED",
          cause: "NOT AUTHORIZED",
        });
      } else if (isSchemaSharedWith) {
        await prisma.shareSchema.update({
          where: {
            schemaId: input.id,
          },
          data: {
            sharedUsers: {
              disconnect: {
                id: session.user.id,
              },
            },
          },
        });
        return true;
      }

      await prisma.schema.delete({
        where: { id: input.id },
      });
      return true;
    }),
});
