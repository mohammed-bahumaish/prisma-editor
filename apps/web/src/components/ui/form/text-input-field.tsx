import * as React from "react";
import { Input } from "../input";
import { type FieldError, useFormContext } from "react-hook-form";
import { Label } from "../label";
import clsx from "clsx";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
};

const TextInputField: React.FC<InputProps> = ({ name, label, ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  const error = errors[name] as FieldError | undefined;
  const errorMessage = error?.message;

  return (
    <div>
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        {...props}
        {...register(name)}
        id={name}
        className={clsx({
          "border-red-400 dark:border-red-400": !!errorMessage,
        })}
      />
      {errorMessage && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
};

TextInputField.displayName = "TextInputField";

export { TextInputField };
