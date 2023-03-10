import {
  datasourcesDeserializer,
  dmmfEnumsDeserializer,
  dmmfModelsdeserializer,
  generatorsDeserializer,
} from "./util/parser";
import { type ConfigMetaFormat, formatSchema } from "@prisma/internals";
import { type DMMF } from "@prisma/generator-helper";

export const dmmfToSchema = async ({
  dmmf: { models, enums },
  config: { datasources, generators },
}: {
  dmmf: DMMF.Document["datamodel"];
  config: ConfigMetaFormat;
}) => {
  const outputSchema = [
    await datasourcesDeserializer(datasources),
    await generatorsDeserializer(generators),
    await dmmfModelsdeserializer(models),
    await dmmfEnumsDeserializer(enums),
  ]
    .filter((e) => e)
    .join("\n\n\n");

  return await formatSchema({ schema: outputSchema });
};
