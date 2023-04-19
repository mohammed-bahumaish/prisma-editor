import { useRouter } from "next/navigation";
import * as React from "react";
import { FormProvider, useForm } from "react-hook-form";
import Client from "~/components/shared/client";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { TextInputField } from "~/components/ui/form";
import { Icons } from "~/components/ui/icons";
import { cn } from "~/components/ui/lib/cn";
import { api } from "~/utils/api";

type SchemaCreateButtonProps = React.HTMLAttributes<HTMLButtonElement>;

export function SchemaCreateButton({
  className,
  ...props
}: SchemaCreateButtonProps) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const { mutate, isLoading } = api.manageSchema.createSchema.useMutation({
    onSuccess(data) {
      router.push(`/schema/${data}`);
    },
  });

  const methods = useForm({
    defaultValues: {
      title: "",
    },
  });

  const { handleSubmit } = methods;
  const handleCreate = handleSubmit(({ title }) => {
    mutate({ title });
  });
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Client>
        <DialogTrigger>
          <Button
            className={cn(
              "text-lg",
              {
                "cursor-not-allowed opacity-60": isLoading,
              },
              className
            )}
            onClick={() => setOpen(true)}
            {...props}
          >
            New schema
          </Button>
        </DialogTrigger>
      </Client>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new schema.</DialogTitle>
          <FormProvider {...methods}>
            <form onSubmit={handleCreate}>
              <TextInputField name="title" label="Title" />

              <Button
                type="submit"
                className="mt-5 w-full"
                disabled={isLoading}
              >
                {isLoading && <Icons.spinner />}
                <span>Create</span>
              </Button>
            </form>
          </FormProvider>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
