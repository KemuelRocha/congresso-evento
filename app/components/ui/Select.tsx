"use client";

import React, { useId } from "react";
import { ChevronDown } from "lucide-react";
import { fieldClasses, FieldLabel, FieldMessage } from "./Input";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, className = "", id, children, ...rest }, ref) => {
    const autoId = useId();
    const selectId = id ?? autoId;

    return (
      <div>
        {label && <FieldLabel htmlFor={selectId}>{label}</FieldLabel>}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            aria-invalid={!!error}
            className={[
              fieldClasses(error),
              "appearance-none pr-10 cursor-pointer",
              className,
            ].join(" ")}
            {...rest}
          >
            {children}
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500"
            aria-hidden
          />
        </div>
        <FieldMessage error={error} hint={hint} />
      </div>
    );
  }
);
Select.displayName = "Select";
