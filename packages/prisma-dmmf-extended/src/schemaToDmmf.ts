import { getConfig, getDMMF } from "@prisma/internals";
import stripAnsi from "strip-ansi";

export interface SchemaError {
  reason: string;
  row: string;
}

export enum ErrorTypes {
  Prisma,
  Other,
}

export const schemaToDmmf = async (schema: string) => {
  try {
    const { datamodel } = await getDMMF({
      datamodel: schema,
    });
    const config = await getConfig({
      datamodel: schema,
      ignoreEnvVarErrors: true,
    });

    const lines = schema.split("\n");
    let model = "";
    let isOutsideModel = false;
    let startComments: string[] = [];
    lines.forEach((line, index) => {
      if (line.includes("model")) {
        model = (line || "").trim().split(" ")[1];
        isOutsideModel = false;
        const dataModel = datamodel.models.find((m) => m.name === model);
        if (startComments.length > 0 && typeof dataModel !== "undefined") {
          dataModel.startComments = [...startComments];
          startComments = [];
        }
      }
      if (line.includes("@db")) {
        const lineWords = (line || "").trim().split(" ");
        const field = lineWords[0];
        const nativeAttribute = lineWords.find((word) => word.includes("@db"));
        const dmmfModel = datamodel.models.find((m) => m.name === model);
        const dmmfField = dmmfModel?.fields.find((f) => f.name === field);

        if (dmmfField) dmmfField["native"] = nativeAttribute;
      }
      if (line.includes("//")) {
        const dmmfModel = datamodel.models.find((m) => m.name === model);
        const lineWords = (line || "").trim().split(" ");
        const comment = (line || "").trim().split("//")[1];
        const isCommentLine = lineWords[0].includes("//");
        if (!isCommentLine) {
          const field = lineWords[0];
          const dmmfField = dmmfModel?.fields.find((f) => f.name === field);
          if (dmmfField) dmmfField["comment"] = comment;
        } else {
          const lastLine = lines[index - 1];
          const lineWords = (lastLine || "").trim().split(" ");
          const field = lineWords[0];
          if (field === "model") {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
            dmmfModel?.fields.unshift({
              kind: "comment",
              name: comment,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any);
          } else if (isOutsideModel) {
            startComments.push((comment || "").trim());
          } else {
            const dmmfFieldIndex = dmmfModel?.fields.findIndex(
              (f) => f.name === field
            );
            if (dmmfFieldIndex) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              dmmfModel?.fields.splice(dmmfFieldIndex + 1, 0, {
                kind: "comment",
                name: comment,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } as any);
            } else {
              startComments.push(comment);
            }
          }
        }
      }
      if (line.includes("@@index")) {
        const index = (line || "").trim();
        const dmmfModel = datamodel.models.find((m) => m.name === model);

        if (dmmfModel)
          dmmfModel["index"] = [
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ...(Array.isArray(dmmfModel["index"]) ? dmmfModel["index"] : []),
            index,
          ];
      }
      if (line.includes("}")) {
        isOutsideModel = true;
      }
    });

    if (startComments.length > 0) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      datamodel.models.find((m) => m.name === model)!.endComments = [
        ...startComments,
      ];
    }

    return { datamodel, config };
  } catch (error) {
    const message = stripAnsi((error as Error).message);
    let errors: SchemaError[];
    let errType: ErrorTypes;

    if (message.includes("error: ")) {
      errors = parseDMMFError(message);
      errType = ErrorTypes.Prisma;
    } else {
      errors = [{ reason: message, row: "0" }];
      errType = ErrorTypes.Other;
    }

    return { errors, type: errType };
  }
};

const errRegex =
  /^(?:Error validating.*?:)?(.+?)\n  -->  schema\.prisma:(\d+)\n/;

const parseDMMFError = (error: string): SchemaError[] =>
  error
    .split("error: ")
    .slice(1)
    .map((msg) => msg.match(errRegex)!.slice(1))
    .map(([reason, row]) => ({ reason, row }));
