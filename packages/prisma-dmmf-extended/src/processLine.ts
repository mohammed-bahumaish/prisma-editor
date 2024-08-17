import { type DMMF } from "@prisma/generator-helper";

export function processLine(
  line: string,
  index: number,
  datamodel: DMMF.Datamodel,
  currentModel: (DMMF.Model & { endComments?: string[] }) | undefined,
  startComments: string[],
  lines: string[]
) {
  if (line.includes("model")) {
    currentModel = processModelLine(line, datamodel, startComments);
    startComments = [];
  }
  if (line.includes("@db")) {
    currentModel = processDbLine(line, currentModel);
  }
  if (line.includes("//")) {
    const result = processCommentLine(
      line,
      index,
      currentModel,
      startComments,
      lines
    );
    currentModel = result.currentModel;
    startComments = result.startComments;
  }
  if (line.includes("@@index")) {
    currentModel = processIndexLine(line, currentModel);
  }
  if (line.includes("}")) {
    currentModel = undefined;
  }
  if (line.includes("onUpdate")) {
    currentModel = processOnUpdateLine(line, currentModel);
  }

  return { currentModel, startComments };
}

function processModelLine(
  line: string,
  datamodel: DMMF.Datamodel,
  startComments: string[]
): (DMMF.Model & { endComments?: string[] }) | undefined {
  const modelName = line.trim().split(" ")[1];
  const model = datamodel.models.find((m) => m.name === modelName);
  if (model && startComments.length > 0) {
    return { ...model, startComments: [...startComments] };
  }
  return model;
}

function processDbLine(
  line: string,
  model: (DMMF.Model & { endComments?: string[] }) | undefined
) {
  if (!model) return model;
  const [field] = line.trim().split(" ");
  const dbTypeRegex = /@db\.(\w+(?:\([^)]*\))?)/;
  const match = line.trim().match(dbTypeRegex) as unknown as string;

  const updatedFields = model.fields.map((f) =>
    f.name === field ? { ...f, native: match[0] } : f
  );
  return { ...model, fields: updatedFields };
}

function processCommentLine(
  line: string,
  index: number,
  model: (DMMF.Model & { endComments?: string[] }) | undefined,
  startComments: string[],
  lines: string[]
): {
  currentModel: (DMMF.Model & { endComments?: string[] }) | undefined;
  startComments: string[];
} {
  const comment = line.trim().split("//")[1].trim();
  const isCommentLine = line.trim().startsWith("//");

  if (!isCommentLine) {
    return {
      currentModel: processInlineComment(line, comment, model),
      startComments,
    };
  } else {
    return processStandaloneComment(
      comment,
      index,
      lines,
      model,
      startComments
    );
  }
}

function processInlineComment(
  line: string,
  comment: string,
  model: (DMMF.Model & { endComments?: string[] }) | undefined
) {
  if (!model) return model;
  const field = line.trim().split(" ")[0];
  const updatedFields = model.fields.map((f) =>
    f.name === field ? { ...f, comment } : f
  );
  return { ...model, fields: updatedFields };
}

function processStandaloneComment(
  comment: string,
  index: number,
  lines: string[],
  model: (DMMF.Model & { endComments?: string[] }) | undefined,
  startComments: string[]
): {
  currentModel: (DMMF.Model & { endComments?: string[] }) | undefined;
  startComments: string[];
} {
  if (!model) {
    return { currentModel: model, startComments: [...startComments, comment] };
  }

  const lastLine = lines[index - 1];
  const [lastField] = lastLine.trim().split(" ");

  const commentField = {
    kind: "comment" as unknown as DMMF.FieldKind,
    name: comment,
  } as unknown as DMMF.Field;

  let updatedFields: DMMF.Field[];

  if (lastField === "model") {
    updatedFields = [commentField, ...model.fields];
  } else {
    const fieldIndex = model.fields.findIndex((f) => f.name === lastField);
    if (fieldIndex !== -1) {
      updatedFields = [
        ...model.fields.slice(0, fieldIndex + 1),
        commentField,
        ...model.fields.slice(fieldIndex + 1),
      ];
    } else {
      updatedFields = [...model.fields, commentField];
    }
  }

  return { currentModel: { ...model, fields: updatedFields }, startComments };
}

function processIndexLine(
  line: string,
  model: (DMMF.Model & { endComments?: string[] }) | undefined
) {
  if (!model) return model;
  const index = line.trim();
  return { ...model, index: [...(model.index || []), index] };
}

function processOnUpdateLine(
  line: string,
  model: (DMMF.Model & { endComments?: string[] }) | undefined
) {
  if (!model) return model;
  const [field, ...rest] = line.trim().split(" ");
  const onUpdate = rest
    .find((word) => word.startsWith("onUpdate:"))
    ?.split(":")[1];
  const updatedFields = model.fields.map((f) =>
    f.name === field ? { ...f, relationOnUpdate: onUpdate } : f
  );
  return { ...model, fields: updatedFields };
}
