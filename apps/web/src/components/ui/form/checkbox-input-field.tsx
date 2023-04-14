import type * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import clsx from "clsx";
import * as React from "react";
import { useFormContext, type FieldError, Controller } from "react-hook-form";
import { Checkbox } from "../checkbox";
import { Label } from "../label";

type InputProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> & {
  name: string;
  label?: string;
  onCheckedChange?: (value: boolean) => void;
};

const CheckboxInputField: React.FC<InputProps> = ({
  name,
  label,
  onCheckedChange,
  ...props
}) => {
  const {
    formState: { errors },
    control,
  } = useFormContext();
  const error = errors[name] as FieldError | undefined;
  const errorMessage = error?.message;

  return (
    <div>
      <div className="flex items-center gap-2">
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Checkbox
              {...props}
              {...field}
              value={undefined}
              checked={field.value as boolean}
              onCheckedChange={(e) => {
                field.onChange(e);
                if (onCheckedChange) onCheckedChange(e as boolean);
              }}
              id={name}
              className={clsx({
                "border-red-400 dark:border-red-400": !!errorMessage,
              })}
            />
          )}
        />
        {label && (
          <Label
            htmlFor={name}
            className={clsx({
              "text-gray-500 dark:text-gray-500": !!props.disabled,
            })}
          >
            {label}
          </Label>
        )}
      </div>

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
};

CheckboxInputField.displayName = "CheckboxInputField";

export { CheckboxInputField };
