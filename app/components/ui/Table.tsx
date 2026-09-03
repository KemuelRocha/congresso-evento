"use client";

import React from "react";

export function Table({
  className = "",
  children,
  ...rest
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto rounded-2xl shadow-card bg-white">
      <table className={["min-w-full text-left", className].join(" ")} {...rest}>
        {children}
      </table>
    </div>
  );
}

export function TableHead({
  className = "",
  children,
  ...rest
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={["bg-secondary-100 text-secondary-700", className].join(" ")}
      {...rest}
    >
      {children}
    </thead>
  );
}

export function TableBody({
  children,
  ...rest
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...rest}>{children}</tbody>;
}

export function TableRow({
  className = "",
  children,
  ...rest
}: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={[
        "border-b border-neutral-200 last:border-b-0 hover:bg-neutral-50",
        className,
      ].join(" ")}
      {...rest}
    >
      {children}
    </tr>
  );
}

export function TableCell({
  className = "",
  children,
  ...rest
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className={["px-4 py-3", className].join(" ")} {...rest}>
      {children}
    </td>
  );
}

export function TableHeaderCell({
  className = "",
  children,
  ...rest
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th className={["px-4 py-3 font-semibold", className].join(" ")} {...rest}>
      {children}
    </th>
  );
}
