"use client";

import React, { useId } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const fieldClasses = (error?: string) =>
  [
    "w-full h-11 rounded-xl border bg-neutral-50 px-3.5 text-neutral-900 transition-all",
    "placeholder:text-neutral-400",
    "hover:border-neutral-400",
    "focus:outline-none focus:bg-white focus:ring-4",
    "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:border-neutral-300",
    error
      ? "border-error focus:border-error focus:ring-error/15"
      : "border-neutral-300 focus:border-primary-500 focus:ring-primary-500/15",
  ].join(" ");

export const FieldLabel = ({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) => (
  <label
    htmlFor={htmlFor}
    className="mb-1.5 block text-sm font-medium text-neutral-700"
  >
    {children}
  </label>
);

export const FieldMessage = ({
  error,
  hint,
}: {
  error?: string;
  hint?: string;
}) =>
  error ? (
    <p className="mt-1.5 text-sm text-error">{error}</p>
  ) : hint ? (
    <p className="mt-1.5 text-xs text-neutral-500">{hint}</p>
  ) : null;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, className = "", id, ...rest }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <div>
        {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={!!error}
          className={[fieldClasses(error), className].join(" ")}
          {...rest}
        />
        <FieldMessage error={error} hint={hint} />
      </div>
    );
  }
);
Input.displayName = "Input";
