import { createTRPCRouter } from "~/server/api/trpc";
import { dmmfRouter } from "~/server/api/routers/dmmf";
import { openaiRouter } from "~/server/api/routers/openai";
// import { openaiRouter } from "./routers/openai";

export const appRouter = createTRPCRouter({
  dmmf: dmmfRouter,
  openai: openaiRouter,
});

export type AppRouter = typeof appRouter;
