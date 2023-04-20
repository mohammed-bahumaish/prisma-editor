import { clsx } from "clsx";
import React from "react";

type ButtonProps = React.HtmlHTMLAttributes<HTMLDivElement>;

type Props = ButtonProps & {
  variant: "primary" | "secondary" | "tertiary";
  href?: string;
};

export const Button = ({
  variant,
  className: _className,
  children,
  ...props
}: Props) => {
  const className = clsx(
    "inline-grid cursor-pointer appearance-none grid-flow-col items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-sm font-bold tracking-normal no-underline shadow-xl shadow-brand-lighter/30 transition-all duration-300 hover:no-underline sm:gap-1.5 sm:px-4 sm:py-2 sm:text-base",
    {
      ["bg-brand-lighter text-white hover:text-white hover:bg-brand-light "]:
        variant === "primary",
      ["bg-gradient-to-r from-blue-50 to-blue-200 text-slate-800 hover:text-primary-[#2e77af]"]:
        variant === "secondary",
      ["bg-gradient-to-r dark:from-neutral-800 dark:to-neutral-800 text-white from-neutral-200 to-neutral-300 shadow-none"]:
        variant === "tertiary",
    },
    _className
  );

  return (
    <div {...props} className={className}>
      {children}
    </div>
  );
};
