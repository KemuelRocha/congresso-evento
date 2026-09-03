"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  shadow?: "card" | "elevated";
  padding?: "sm" | "md" | "lg";
}

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  shadow = "card",
  padding = "md",
  className = "",
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={[
        "bg-white rounded-2xl",
        shadow === "elevated" ? "shadow-elevated" : "shadow-card",
        paddingClasses[padding],
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </div>
  );
}
