import clsx from "clsx";
import { forwardRef, type FC, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

const CheckboxField: FC<Props> = forwardRef<HTMLInputElement, Props>(
  ({ label, ...rest }, ref) => {
    return (
      <div className="relative flex items-start">
        <div className="flex h-5 items-center">
          <input
            id={rest.name}
            aria-describedby="comments-description"
            type="checkbox"
            className={clsx(
              "focus:ring-brand-indigo-1 text-brand-indigo-1 h-4 w-4 cursor-pointer rounded border-gray-300",
              {
                "cursor-not-allowed text-gray-500": rest.disabled,
              }
            )}
            {...rest}
            ref={ref}
          />
        </div>
        <div className="ml-3 text-sm">
          <label
            htmlFor={rest.name}
            className={clsx("cursor-pointer font-medium text-white", {
              "cursor-not-allowed text-gray-500": rest.disabled,
            })}
          >
            {label}
          </label>
        </div>
      </div>
    );
  }
);

CheckboxField.displayName = "CheckboxField";

export default CheckboxField;
