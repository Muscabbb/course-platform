import { cn } from "@/lib/utils";
import React from "react";

export default function PageHeader({
  title,
  children,
  className,
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(className, "mb-8 flex gap-4 items-center justify-between")}
    >
      <h1 className="font-semibold text-2xl">{title}</h1>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
