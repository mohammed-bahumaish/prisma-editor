import { forwardRef, type FC, type InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  error?: string;
}

const TextInputField: FC<Props> = forwardRef<HTMLInputElement, Props>(
  ({ label, error, ...rest }, ref) => {
    return (
      <div>
        <label
          htmlFor={rest.name}
          className="block text-sm font-medium text-white"
        >
          {label}
        </label>
        <div className="relative mt-1 rounded-md shadow-sm">
          <input
            ref={ref}
            {...rest}
            type="text"
            id={rest.name}
            className="focus:ring-brand-indigo-1 focus:border-brand-indigo-1 block w-full rounded-md border-gray-300 sm:text-sm"
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
      </div>
    );
  }
);
TextInputField.displayName = "TextInputField";
export default TextInputField;
