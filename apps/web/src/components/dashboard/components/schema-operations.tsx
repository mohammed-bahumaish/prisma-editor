import { type Schema } from "@prisma/client";
import Link from "next/link";
import * as React from "react";
import { Dialog } from "~/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Icons } from "~/components/ui/icons";
import DeleteSchemaDialog from "./delete-schema-dialog";
import ShareSchemaDialogContent from "./share-schema-dialog-content";

interface SchemaOperationsProps {
  schema: Pick<Schema, "id" | "title">;
  onOperationDone: () => void;
  isOwner: boolean;
}

export function SchemaOperations({
  schema,
  onOperationDone,
  isOwner,
}: SchemaOperationsProps) {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
  const [showShareDialog, setShowShareDialog] = React.useState<boolean>(false);
  return (
    <Dialog
      open={showShareDialog}
      onOpenChange={(open) => {
        setShowShareDialog(open);
      }}
    >
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300  hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <Icons.ellipsis className="h-4 w-4" />
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href={`/schema/${schema.id}`} className="flex w-full">
              View
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setShowShareDialog(true)}
            disabled={!isOwner}
          >
            Share
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-red-600 focus:bg-red-50"
            onSelect={() => setShowDeleteAlert(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {showShareDialog && (
        <ShareSchemaDialogContent
          schemaId={schema.id}
          onOperationDone={() => setShowShareDialog(false)}
        />
      )}
      <DeleteSchemaDialog
        onOperationDone={onOperationDone}
        schemaId={schema.id}
        setShowDeleteAlert={setShowDeleteAlert}
        showDeleteAlert={showDeleteAlert}
      />
    </Dialog>
  );
}
