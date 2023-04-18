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
      })
    )
    .query(async ({ input, ctx: { prisma, session } }) => {
      const schema = await prisma.schema.findUnique({
        where: { id: input.id },
        select: { schema: true, userId: true },
      });
      if (schema?.userId !== session.user.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "NOT AUTHORIZED",
          cause: "NOT AUTHORIZED",
        });
      }
      return schema?.schema || "";
    }),
  getSchemas: protectedProcedure.query(async ({ ctx: { prisma, session } }) => {
    const schemas = await prisma.schema.findMany({
      where: { user: { id: { equals: session?.user.id } } },
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
        select: { userId: true },
      });

      if (schema?.userId !== session.user.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "NOT AUTHORIZED",
          cause: "NOT AUTHORIZED",
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
        select: { userId: true },
      });

      if (schema?.userId !== session.user.id) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "NOT AUTHORIZED",
          cause: "NOT AUTHORIZED",
        });
      }

      await prisma.schema.delete({
        where: { id: input.id },
      });
      return true;
    }),
});
