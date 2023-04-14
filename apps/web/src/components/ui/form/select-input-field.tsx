import type * as SelectPrimitive from "@radix-ui/react-select";
import * as React from "react";
import { Controller, useFormContext, type FieldError } from "react-hook-form";
import { Label } from "../label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";

export type InputProps = React.ComponentPropsWithoutRef<
  typeof SelectPrimitive.Root
> & {
  name: string;
  label?: string;
  options: { value: string; label: string }[];
};

const SelectInputField: React.FC<InputProps> = ({
  name,
  label,
  options,
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
      {label && <Label htmlFor={name}>{label}</Label>}
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            {...props}
            {...field}
            onValueChange={(value) => field.onChange(value)}
          >
            <SelectTrigger id={name}>
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {options.map((o) => (
                <SelectItem value={o.value} key={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      />

      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
};

SelectInputField.displayName = "SelectInputField";

export { SelectInputField };
