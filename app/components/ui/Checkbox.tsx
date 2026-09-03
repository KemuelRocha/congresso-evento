"use client";

import React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className = "", id, ...rest }, ref) => {
    return (
      <label
        htmlFor={id}
        className="flex items-start gap-2 cursor-pointer select-none"
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          className={[
            "mt-1 h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500",
            className,
          ].join(" ")}
          {...rest}
        />
        <span className="text-sm text-neutral-700">{label}</span>
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
