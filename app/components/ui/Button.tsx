"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "accent" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary-600 hover:bg-primary-700 text-white shadow-lg disabled:bg-neutral-300 disabled:text-neutral-500",
  secondary:
    "bg-secondary-800 hover:bg-secondary-900 text-white shadow-lg disabled:bg-neutral-300 disabled:text-neutral-500",
  accent:
    "bg-accent-500 hover:bg-accent-600 text-neutral-900 shadow-lg disabled:bg-neutral-300 disabled:text-neutral-500",
  ghost:
    "bg-transparent hover:bg-neutral-100 text-neutral-800 border border-neutral-300 disabled:text-neutral-400",
  danger:
    "bg-error hover:bg-red-700 text-white shadow-lg disabled:bg-neutral-300 disabled:text-neutral-500",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-6 py-3 text-base rounded-full",
  lg: "px-8 py-4 text-lg rounded-full",
};

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  fullWidth = false,
  disabled,
  className = "",
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        "font-semibold transition-all transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed cursor-pointer",
        variantClasses[variant],
        sizeClasses[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {loading ? "Enviando..." : children}
    </button>
  );
}
