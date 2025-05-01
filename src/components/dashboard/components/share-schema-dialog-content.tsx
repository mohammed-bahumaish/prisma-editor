import { type FC } from "react";
import { Button } from "~/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Icons } from "~/components/ui/icons";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { api } from "~/utils/api";

const ShareSchemaDialogContent: FC<{
  schemaId: number;
  onOperationDone: () => void;
}> = ({ schemaId, onOperationDone }) => {
  const { data, refetch, isLoading } = api.shareSchema.getShareToken.useQuery({
    schemaId,
  });
  const { mutateAsync, isLoading: updateIsLoading } =
    api.shareSchema.updatePermission.useMutation({
      onSuccess() {
        void refetch();
      },
    });

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Share your schema with others.</DialogTitle>
        {!data ? (
          <div className="flex justify-center py-8">
            <Icons.spinner className="h-6 w-6" />
          </div>
        ) : (
          <>
            <div className="flex items-center space-x-2 pb-4">
              <Switch
                id="airplane-mode"
                checked={data?.permission === "UPDATE"}
                disabled={isLoading || updateIsLoading}
                onCheckedChange={(canUpdate) => {
                  void mutateAsync({
                    shareSchemaId: data.id,
                    permissions: canUpdate ? "UPDATE" : "VIEW",
                  });
                }}
              />
              <Label htmlFor="airplane-mode">Can edit the schema.</Label>
            </div>
            {typeof data.token === "string" && (
              <Button
                onClick={async () =>
                  await navigator.clipboard
                    .writeText(
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      `https://prisma-editor.vercel.app/schema/${schemaId}?token=${data.token}`
                    )
                    .then(() => onOperationDone())
                }
              >
                Copy share link
              </Button>
            )}
          </>
        )}
      </DialogHeader>
    </DialogContent>
  );
};

export default ShareSchemaDialogContent;
