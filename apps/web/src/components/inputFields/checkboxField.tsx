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
              "focus:ring-brand-indigo-1 h-4 w-4 rounded border-gray-300 ",
              rest.disabled
                ? "cursor-not-allowed bg-gray-500 text-gray-500"
                : "text-brand-indigo-1 cursor-pointer bg-white"
            )}
            {...rest}
            ref={ref}
          />
        </div>
        <div className="ml-3 text-sm">
          <label
            htmlFor={rest.name}
            className={clsx(
              "font-medium ",
              rest.disabled
                ? "cursor-not-allowed text-gray-500"
                : "cursor-pointer text-white"
            )}
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
