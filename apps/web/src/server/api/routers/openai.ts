import {
  formatSchema,
  schemaToDmmf,
} from "@prisma-editor/prisma-dmmf-extended";
import { TRPCClientError } from "@trpc/client";
import { Configuration, OpenAIApi } from "openai";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const configuration = new Configuration({
  apiKey: env.OPEN_AI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const firstLines = `
generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}`;
export const openaiRouter = createTRPCRouter({
  prismaAiPrompt: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const prompt = `/*write a valid Prisma schema of Prisma ORM (specify @relation attributes on relations and @default where necessary) described by the following: "${input}" */
${firstLines}
`;

      const res = await openai.createCompletion({
        model: "code-davinci-002",
        prompt: prompt,
        temperature: 0,
        max_tokens: 1000,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["/*", "###"],
      });

      if (!res.data.choices[0]?.text)
        throw new TRPCClientError("PROMPT_FAILED");

      const openAiOutput = `
    ${firstLines}
    ${res.data.choices[0].text || ""}
    `;

      let schema = openAiOutput;
      // in some cases not all errors removed
      let iterate = true;
      const iterations: string[] = [];
      while (iterate) {
        const r = await removeErrorLines(schema);
        if (r === false) iterate = r;
        else {
          schema = r;
          iterations.push(r);
        }
      }

      const formattedSchema = await formatSchema({ schema });

      return formattedSchema;
    }),
});

const removeErrorLines = async (schema: string) => {
  const resultArr = schema.split("\n");

  const dmmf = await schemaToDmmf(schema);

  if (!dmmf.errors) return false;

  dmmf.errors?.forEach((e: { row: string }) => {
    delete resultArr[Number(e.row) - 1];
  });

  return await formatSchema({
    schema: resultArr.filter((l) => l).join("\n"),
  });
};
