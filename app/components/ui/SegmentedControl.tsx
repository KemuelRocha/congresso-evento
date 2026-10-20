"use client";

import React, { useId } from "react";
import { FieldLabel } from "./Input";

interface SegmentedControlProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

// Grupo de opções lado a lado (substitui um <select> com poucas opções)
export function SegmentedControl({
  label,
  value,
  onChange,
  options,
}: SegmentedControlProps) {
  const id = useId();

  return (
    <div>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      <div
        id={id}
        role="radiogroup"
        aria-label={label}
        className="grid h-11 gap-1 rounded-xl border border-neutral-300 bg-neutral-50 p-1"
        style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}
      >
        {options.map((opt) => {
          const selected = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(opt.value)}
              className={[
                "cursor-pointer rounded-lg text-sm font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500",
                selected
                  ? "bg-white text-primary-700 shadow-sm ring-1 ring-neutral-200"
                  : "text-neutral-600 hover:text-neutral-900",
              ].join(" ")}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
