"use client";

import React from "react";

type BadgeTone = "success" | "warning" | "error" | "info" | "neutral";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneClasses: Record<BadgeTone, string> = {
  success: "bg-primary-100 text-primary-800",
  warning: "bg-accent-100 text-accent-800",
  error: "bg-red-100 text-red-700",
  info: "bg-blue-100 text-blue-700",
  neutral: "bg-neutral-100 text-neutral-700",
};

export function Badge({
  tone = "neutral",
  className = "",
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
        toneClasses[tone],
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </span>
  );
}
