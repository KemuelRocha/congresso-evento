"use client";

import React from "react";

type SectionTone = "light" | "dark-gradient" | "neutral";

interface PageSectionProps extends React.HTMLAttributes<HTMLElement> {
  tone?: SectionTone;
  overlay?: boolean;
}

const toneClasses: Record<SectionTone, string> = {
  light: "bg-gradient-to-b from-primary-50 to-primary-100 text-neutral-900",
  "dark-gradient":
    "bg-gradient-to-b from-primary-900 via-primary-800 to-primary-900 text-white",
  neutral: "bg-white text-neutral-900",
};

export function PageSection({
  tone = "neutral",
  overlay = false,
  className = "",
  children,
  ...rest
}: PageSectionProps) {
  return (
    <section
      className={[
        "py-16 md:py-20 relative overflow-hidden",
        toneClasses[tone],
        className,
      ].join(" ")}
      {...rest}
    >
      {overlay && (
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      )}
      <div className="container mx-auto px-6 relative z-10">{children}</div>
    </section>
  );
}
