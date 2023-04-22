import { type DMMF } from "@prisma/generator-helper";
import { formatSchema, type ConfigMetaFormat } from "@prisma/internals";
import {
  datasourcesDeserializer,
  dmmfEnumsDeserializer,
  dmmfModelsdeserializer,
  generatorsDeserializer,
} from "./util/parser";

export const dmmfToSchema = async ({
  dmmf: { models, enums },
  config: { datasources, generators },
}: {
  dmmf: DMMF.Document["datamodel"];
  config: ConfigMetaFormat;
}) => {
  const outputSchema = [
    datasourcesDeserializer(datasources),
    generatorsDeserializer(generators),
    dmmfModelsdeserializer(models),
    dmmfEnumsDeserializer(enums),
  ]
    .filter((e) => e)
    .join("\n\n\n");

  return await formatSchema({ schema: outputSchema });
};
