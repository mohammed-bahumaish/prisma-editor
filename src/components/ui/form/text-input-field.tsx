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
  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  // Hide error when field is focused
  const showError = errorMessage && !isFocused;

  return (
    <div>
      {label && <Label htmlFor={name}>{label}</Label>}
      <Input
        {...props}
        {...register(name, {
          onBlur: handleBlur,
        })}
        id={name}
        onFocus={handleFocus}
        className={clsx({
          "border-red-400 dark:border-red-400": !!errorMessage,
        })}
      />
      {showError && <p className="text-sm text-red-500">{errorMessage}</p>}
    </div>
  );
};

TextInputField.displayName = "TextInputField";

export { TextInputField };
