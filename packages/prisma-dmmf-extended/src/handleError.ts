import stripAnsi from "strip-ansi";

export interface SchemaError {
  reason: string;
  row: string;
}

export enum ErrorTypes {
  Prisma,
  Other,
}

export function handleError(error: Error) {
  const message = stripAnsi(error.message);
  if (message.includes("error: ")) {
    return { errors: parseDMMFError(message), type: ErrorTypes.Prisma };
  } else {
    return { errors: [{ reason: message, row: "0" }], type: ErrorTypes.Other };
  }
}

const errRegex =
  /^(?:Error validating.*?:)?(.+?)\n  -->  schema\.prisma:(\d+)\n/;

const parseDMMFError = (error: string): SchemaError[] =>
  error
    .split("error: ")
    .slice(1)
    .map((msg) => {
      const match = msg.match(errRegex);
      return match
        ? { reason: match[1], row: match[2] }
        : { reason: msg, row: "0" };
    });
