import {
  // dmmfToSchema,
  schemaToDmmf,
  // type DMMF,
} from "@prisma-editor/prisma-dmmf-extended";
// import { type ConfigMetaFormat } from "@prisma/internals";
// import { execa } from "execa";
// import fs from "fs";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Configuration, CreateCompletionResponse, OpenAIApi } from "openai";
import { AxiosResponse } from "axios";

const configuration = new Configuration({
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

export const openaiRouter = createTRPCRouter({
  sqlTables: publicProcedure.input(z.string()).mutation(async ({ input }) => {
    let prompt = `/*write sql script to generate the tables described by the follwing : "${input}" */ \nCREATE TABLE`;
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
        stop: ["/*"],
      });
    } catch (e) {
      console.log(e);
    }
    return "CREATE TABLE" + result.data.choices[0].text;
  }),
});
