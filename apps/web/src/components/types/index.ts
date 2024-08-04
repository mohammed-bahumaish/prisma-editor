export type addFieldProps = {
  name: string;
  type:
    | "String"
    | "Int"
    | "Boolean"
    | "Float"
    | "DateTime"
    | "Decimal"
    | "BigInt"
    | "Bytes"
    | "JSON";
  isRequired: boolean;
  isUnique: boolean;
  isUpdatedAt?: boolean;
  isList: boolean;
  isId: boolean;
  isManyToManyRelation?: boolean;
  default:
    | number
    | string
    | boolean
    | { name: string; args: string[] }
    | undefined;
  kind: "object" | "enum" | "scalar" | "unsupported";
  native?: string;
};
