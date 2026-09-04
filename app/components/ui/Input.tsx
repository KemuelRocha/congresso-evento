"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", id, ...rest }, ref) => {
    return (
      <div>
        {label && (
          <label htmlFor={id} className="block font-medium mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={[
            "w-full rounded-md border p-2 bg-white text-neutral-900 transition-colors",
            "border-neutral-400 placeholder:text-neutral-400",
            "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500",
            error ? "border-error focus:ring-error focus:border-error" : "",
            className,
          ].join(" ")}
          {...rest}
        />
        {error && <p className="text-error text-sm mt-1">{error}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
