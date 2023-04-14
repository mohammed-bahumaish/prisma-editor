import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import {
  FormProvider,
  useForm,
  type DeepPartial,
  type FieldValues,
  type UseFormReturn,
} from "react-hook-form";
import type * as z from "zod";

const Form = <T extends FieldValues>({
  onSubmit,
  children,
  schema,
  defaultValues,
}: {
  onSubmit: (input: T) => void;
  children:
    | ((methods: UseFormReturn<T, unknown>) => React.ReactNode)
    | React.ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.Schema<unknown, any>;
  defaultValues?: DeepPartial<T>;
}) => {
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {typeof children === "function" ? children(methods) : children}
      </form>
    </FormProvider>
  );
};
Form.displayName = "Form";

export { Form };
