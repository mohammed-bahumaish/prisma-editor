import { type Schema } from "@prisma/client";
import Link from "next/link";
import { Skeleton } from "~/components/ui/skeleton";
import { SchemaOperations } from "./schema-operations";
import { format } from "date-fns";

interface SchemaItemProps {
  schema: Pick<Schema, "id" | "schema" | "title" | "updatedAt">;
  onOperationDone: () => void;
}

export function SchemaItem({ schema, onOperationDone }: SchemaItemProps) {
  return (
    <div className="flex items-center justify-between p-4">
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href={`/schema/${schema.id}`}
          className="font-semibold hover:underline"
        >
          {schema.title}
        </Link>
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            last updated at {` `} {format(schema.updatedAt, "dd-MM-yyyy")}
          </p>
        </div>
      </div>
      <SchemaOperations
        schema={{ id: schema.id, title: schema.title }}
        onOperationDone={onOperationDone}
      />
    </div>
  );
}

SchemaItem.Skeleton = function SchemaItemSkeleton() {
  return (
    <div className="p-4">
      <div className="space-y-3">
        <Skeleton className="h-5 w-2/5" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  );
};
