import { type FC } from "react";
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
import { Icons } from "~/components/ui/icons";
import { toast } from "~/hooks/use-toast";
import { api } from "~/utils/api";

const DeleteSchemaDialog: FC<{
  showDeleteAlert: boolean;
  setShowDeleteAlert: React.Dispatch<React.SetStateAction<boolean>>;
  onOperationDone: () => void;
  schemaId: number;
}> = ({ showDeleteAlert, setShowDeleteAlert, onOperationDone, schemaId }) => {
  const { mutateAsync, isLoading } = api.manageSchema.deleteSchema.useMutation({
    onSuccess() {
      toast({
        title: "Deleted successfully.",
        description: `Schema was deleted.`,
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
              await mutateAsync({ id: schemaId });
            }}
            className="bg-red-600 focus:ring-red-600"
          >
            {isLoading ? (
              <Icons.spinner />
            ) : (
              <Icons.trash className="mr-2 h-4 w-4" />
            )}
            <span>Delete</span>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSchemaDialog;
