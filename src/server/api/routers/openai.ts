/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  formatSchema,
  schemaToDmmf,
} from "@mohammed-bahumaish/prisma-dmmf-extended";
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
      try {
        const prompt = `write a valid Prisma schema of Prisma ORM.specify attributes for all fields wherever necessary.The database schema should be fully functional so specify all relations between tables. the database is described by the following: "${input}" \n respond by completing the code bellow without any explanation. only schema code should be in the response.\n ${firstLines}`;

        const res = await openai.createCompletion({
          model: "gpt-4o-mini",
          prompt: prompt,
          temperature: 0.7,
          max_tokens: 1000,
          top_p: 1.0,
          frequency_penalty: 0.0,
          presence_penalty: 0.0,
          stop: ["/*", "###", "```"],
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
      } catch (error) {
        console.log(error);
        throw new TRPCClientError("PROMPT_FAILED");
      }
    }),
});

const removeErrorLines = async (schema: string) => {
  const resultArr = schema.split("\n").filter((l) => !l.includes("//"));

  const dmmf = await schemaToDmmf(schema);

  if (!("errors" in dmmf)) return false;

  if (Array.isArray(dmmf.errors)) {
    dmmf.errors.forEach((e: { row: string }) => {
      delete resultArr[Number(e.row) - 1];
    });
  }

  return resultArr.filter((l) => l).join("\n");
};
