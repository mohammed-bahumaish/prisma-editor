import { createTRPCRouter } from "~/server/api/trpc";
import { dmmfRouter } from "~/server/api/routers/dmmf";

export const appRouter = createTRPCRouter({
  dmmf: dmmfRouter,
});

export type AppRouter = typeof appRouter;
