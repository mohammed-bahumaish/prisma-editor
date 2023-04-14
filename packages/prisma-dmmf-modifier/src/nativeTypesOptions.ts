import { type ConnectorType } from "@prisma/generator-helper";

const stringNativeTypes = [
  {
    nativeType: "@db.Text",
    databases: ["postgresql", "mysql", "sqlserver"],
  },
  {
    nativeType: "@db.Char(x)",
    databases: ["postgresql", "mysql", "sqlserver", "cockroachdb"],
  },
  {
    nativeType: "@db.VarChar(x)",
    databases: ["postgresql", "mysql", "sqlserver"],
  },
  {
    nativeType: "@db.Bit(x)",
    databases: ["postgresql", "cockroachdb"],
  },
  {
    nativeType: "@db.VarBit",
    databases: ["postgresql", "cockroachdb"],
  },
  {
    nativeType: "@db.Uuid",
    databases: ["postgresql", "cockroachdb"],
  },
  {
    nativeType: "@db.Xml",
    databases: ["postgresql", "sqlserver"],
  },
  {
    nativeType: "@db.Inet",
    databases: ["postgresql", "cockroachdb"],
  },
  {
    nativeType: "@db.Citext",
    databases: ["postgresql"],
  },
  {
    nativeType: "@db.TinyText",
    databases: ["mysql"],
  },
  {
    nativeType: "@db.MediumText",
    databases: ["mysql"],
  },
  {
    nativeType: "@db.LongText",
    databases: ["mysql"],
  },
  {
    nativeType: "@db.String",
    databases: ["mongodb"],
  },
  {
    nativeType: "@db.ObjectId",
    databases: ["mongodb"],
  },
  {
    nativeType: "@db.NChar(x)",
    databases: ["sqlserver"],
  },
  {
    nativeType: "@db.NVarChar(x)",
    databases: ["sqlserver"],
  },
  {
    nativeType: "@db.NText",
    databases: ["sqlserver"],
  },
  {
    nativeType: "@db.UniqueIdentifier",
    databases: ["sqlserver"],
  },
  {
    nativeType: "@db.String(x)",
    databases: ["sqlserver", "cockroachdb"],
  },
  {
    nativeType: "@db.CatalogSingleChar",
    databases: ["cockroachdb"],
  },
];

const booleanNativeTypes = [
  {
    nativeType: "@db.Boolean",
    databases: ["postgresql"],
  },
  {
    nativeType: "@db.TinyInt(1)",
    databases: ["mysql"],
  },
  {
    nativeType: "@db.Bit",
    databases: ["mysql", "sqlserver"],
  },
  {
    nativeType: "@db.Bool",
    databases: ["cockroachdb"],
  },
];
const intNativeTypes = [
  {
    nativeType: "@db.Integer",
    databases: ["postgresql"],
  },
  {
    nativeType: "@db.SmallInt",
    databases: ["postgresql", "mysql", "sqlserver"],
  },
  {
    nativeType: "@db.Oid",
    databases: ["postgresql"],
  },
  {
    nativeType: "@db.Int",
    databases: ["mysql", "mongodb", "sqlserver"],
  },
  {
    nativeType: "@db.UnsignedInt",
    databases: ["mysql"],
  },
  {
    nativeType: "@db.UnsignedSmallInt",
    databases: ["mysql"],
  },
  {
    nativeType: "@db.MediumInt",
    databases: ["mysql"],
  },
  {
    nativeType: "@db.UnsignedMediumInt",
    databases: ["mysql"],
  },
  {
    nativeType: "@db.TinyInt",
    databases: ["mysql", "sqlserver"],
  },
  {
    nativeType: "@db.UnsignedTinyInt",
    databases: ["mysql"],
  },
  {
    nativeType: "@db.Year",
    databases: ["mysql"],
  },
  {
    nativeType: "@db.Long",
    databases: ["mongodb"],
  },
  {
    nativeType: "@db.Bit",
    databases: ["sqlserver"],
  },
  {
    nativeType: "@db.Int8",
    databases: ["cockroachdb"],
  },
  {
    nativeType: "@db.Int2",
    databases: ["cockroachdb"],
  },
];
const bigIntNativeTypes = [
  {
    nativeType: "@db.BigInt",
    databases: ["postgresql", "mysql", "sqlserver"],
  },
  {
    nativeType: "@db.UnsignedBigInt",
    databases: ["mysql"],
  },
  {
    nativeType: "@db.Int8",
    databases: ["cockroachdb"],
  },
];
const floatNativeTypes = [
  {
    nativeType: "@db.DoublePrecision",
    databases: ["postgresql"],
  },
  {
    nativeType: "@db.Real",
    databases: ["postgresql"],
  },
  {
    nativeType: "@db.Float",
    databases: ["mysql", "sqlserver"],
  },
  {
    nativeType: "@db.Double",
    databases: ["mysql"],
  },
  {
    nativeType: "@db.Money",
    databases: ["sqlserver"],
  },
  {
    nativeType: "@db.SmallMoney",
    databases: ["sqlserver"],
  },
  {
    nativeType: "@db.Real",
    databases: ["sqlserver"],
  },
  {
    nativeType: "@db.Float8",
    databases: ["cockroachdb"],
  },
  {
    nativeType: "@db.Float4",
    databases: ["cockroachdb"],
  },
];
const decimalNativeTypes = [
  {
    nativeType: "@db.Decimal(p, s)",
    databases: ["postgresql", "mysql", "sqlserver", "cockroachdb"],
  },
  {
    nativeType: "@db.Money",
    databases: ["postgresql"],
  },
];
const dateTimeNativeTypes = [
  {
    nativeType: "@db.Timestamp(x)",
    databases: ["postgresql", "mysql", "cockroachdb"],
  },
  {
    nativeType: "@db.Date",
    databases: ["postgresql", "mysql", "sqlserver", "cockroachdb"],
  },
  {
    nativeType: "@db.Time(x)",
    databases: ["postgresql", "mysql", "cockroachdb"],
  },
  {
    nativeType: "@db.Timetz(x)",
    databases: ["postgresql", "cockroachdb"],
  },
  {
    nativeType: "@db.DateTime(x)",
    databases: ["mysql"],
  },
  {
    nativeType: "@db.Time",
    databases: ["sqlserver"],
  },
  {
    nativeType: "@db.DateTime",
    databases: ["sqlserver"],
  },
  {
    nativeType: "@db.DateTime2",
    databases: ["sqlserver"],
  },
  {
    nativeType: "@db.SmallDateTime",
    databases: ["sqlserver"],
  },
  {
    nativeType: "@db.DateTimeOffset",
    databases: ["sqlserver"],
  },
  {
    nativeType: "@db.Timestamptz(x)",
    databases: ["cockroachdb"],
  },
];
const jsonNativeTypes = [
  {
    nativeType: "@db.Json",
    databases: ["postgresql", "mysql"],
  },
  {
    nativeType: "@db.JsonB",
    databases: ["postgresql", "sqlite"],
  },
  {
    nativeType: "@db.NVarChar",
    databases: ["sqlserver"],
  },
];
const bytesNativeTypes = [
  {
    nativeType: "@db.ByteA",
    databases: ["postgresql"],
  },
  {
    nativeType: "@db.LongBlob",
    databases: ["mysql"],
  },
  {
    nativeType: "@db.Binary",
    databases: ["mysql", "sqlserver"],
  },
  {
    nativeType: "@db.VarBinary",
    databases: ["mysql", "sqlserver"],
  },
  {
    nativeType: "@db.TinyBlob",
    databases: ["mysql"],
  },
  {
    nativeType: "@db.Blob",
    databases: ["mysql"],
  },
  {
    nativeType: "@db.MediumBlob",
    databases: ["mysql"],
  },
  {
    nativeType: "@db.Bit",
    databases: ["mysql"],
  },
  {
    nativeType: "@db.ObjectId",
    databases: ["mongodb"],
  },
  {
    nativeType: "@db.BinData",
    databases: ["mongodb"],
  },
  {
    nativeType: "@db.Image",
    databases: ["sqlserver"],
  },
  {
    nativeType: "@db.Bytes",
    databases: ["cockroachdb"],
  },
  {
    nativeType: "@db.Bytes",
    databases: ["cockroachdb"],
  },
];

export type primitiveDataTypes =
  | "String"
  | "Int"
  | "Boolean"
  | "Float"
  | "DateTime"
  | "Decimal"
  | "BigInt"
  | "Bytes"
  | "JSON";

export const getNativeTypes = (
  database: ConnectorType,
  dataType: primitiveDataTypes
) => {
  const nativeTypes = {
    String: stringNativeTypes,
    Int: intNativeTypes,
    Boolean: booleanNativeTypes,
    Float: floatNativeTypes,
    DateTime: dateTimeNativeTypes,
    Decimal: decimalNativeTypes,
    BigInt: bigIntNativeTypes,
    Bytes: bytesNativeTypes,
    JSON: jsonNativeTypes,
  };
  if (!(dataType in nativeTypes)) return [];
  return nativeTypes[dataType]
    .filter((o) => o.databases.includes(database))
    .map((o) => o.nativeType);
};
