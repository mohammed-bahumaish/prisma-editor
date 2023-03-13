import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

export const openaiRouter = createTRPCRouter({
  sqlTables: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    let usePrisma = true;
    let prompt: string;
    let prefix: string;
    if (usePrisma) {
      prompt = `/// write prisma file to generate the tables for a relational database described by the follwing : "${input}" \n
    datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    `;
      prefix = `datasource db {
      provider = "postgresql"
      url      = env("DATABASE_URL")
    }
    `;
    } else {
      prompt = `/*write sql script to generate the tables for a database described by the follwing : "${input}" */ \nCREATE TABLE`;
      prefix = "CREATE TABLE";
    }
    let result: any;
    try {
      result = await openai.createCompletion({
        model: "code-davinci-002",
        prompt: prompt,
        temperature: 0,
        max_tokens: 1000,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stop: ["/*", "###"],
      });
    } catch (e) {
      console.log(e);
    }

    return prefix + result.data.choices[0].text;
  }),
});
