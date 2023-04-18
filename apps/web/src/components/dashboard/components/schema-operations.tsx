"use client";

import { type Schema } from "@prisma/client";
import Link from "next/link";
import * as React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Icons } from "~/components/ui/icons";
import { toast } from "~/hooks/use-toast";
import { api } from "~/utils/api";

interface SchemaOperationsProps {
  schema: Pick<Schema, "id" | "title">;
  onOperationDone: () => void;
}

export function SchemaOperations({
  schema,
  onOperationDone,
}: SchemaOperationsProps) {
  const [showDeleteAlert, setShowDeleteAlert] = React.useState<boolean>(false);
  const { mutateAsync, isLoading } = api.manageSchema.deleteSchema.useMutation({
    onSuccess() {
      toast({
        title: "Deleted successfully.",
        description: `Your Schema (${schema.title}) was deleted.`,
        variant: "default",
      });
      setShowDeleteAlert(false);
      onOperationDone();
    },
    onError() {
      toast({
        title: "Something went wrong.",
        description: "Your schema was not deleted. Please try again.",
        variant: "destructive",
      });
      setShowDeleteAlert(false);
    },
  });

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-300 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">
          <Icons.ellipsis className="h-4 w-4" />
          <span className="sr-only">Open</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link href={`/schema/${schema.id}`} className="flex w-full">
              Edit
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-red-600 focus:bg-red-50"
            onSelect={() => setShowDeleteAlert(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this schema?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async (event) => {
                event.preventDefault();
                await mutateAsync({ id: schema.id });
              }}
              className="bg-red-600 focus:ring-red-600"
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.trash className="mr-2 h-4 w-4" />
              )}
              <span>Delete</span>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
