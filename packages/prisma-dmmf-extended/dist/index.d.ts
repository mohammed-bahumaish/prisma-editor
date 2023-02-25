import * as _prisma_internals from '@prisma/internals';
import { ConfigMetaFormat } from '@prisma/internals';
export { ConfigMetaFormat } from '@prisma/internals';
import * as _prisma_generator_helper from '@prisma/generator-helper';
import { DMMF } from '@prisma/generator-helper';
export * from '@prisma/generator-helper';

declare const dmmfToSchema: ({ dmmf: { models, enums }, config: { datasources, generators }, }: {
    dmmf: DMMF.Document["datamodel"];
    config: ConfigMetaFormat;
}) => Promise<string>;

interface SchemaError {
    reason: string;
    row: string;
}
declare enum ErrorTypes {
    Prisma = 0,
    Other = 1
}
declare const schemaToDmmf: (schema: string) => Promise<{
    datamodel: _prisma_generator_helper.DMMF.Datamodel;
    config: _prisma_internals.ConfigMetaFormat;
    errors?: undefined;
    type?: undefined;
} | {
    errors: SchemaError[];
    type: ErrorTypes;
    datamodel?: undefined;
    config?: undefined;
}>;

export { ErrorTypes, SchemaError, dmmfToSchema, schemaToDmmf };
