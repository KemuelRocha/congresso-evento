"use client";

import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className = "", id, children, ...rest }, ref) => {
    return (
      <div>
        {label && (
          <label htmlFor={id} className="block font-medium mb-1">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={[
            "w-full rounded-md border p-2 transition-colors bg-white text-neutral-900",
            "border-neutral-400",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            error ? "border-error focus:ring-error focus:border-error" : "",
            className,
          ].join(" ")}
          {...rest}
        >
          {children}
        </select>
        {error && <p className="text-error text-sm mt-1">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
