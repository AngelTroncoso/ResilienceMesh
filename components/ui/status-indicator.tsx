import { ReactNode } from "react";

export function StatusIndicator({
  status,
  size = "md",
  ...props
}: {
  status: "active" | "low-battery" | "critical-battery" | "offline" | "returning";
  size?: "sm" | "md" | "lg";
  [key: string]: any;
}): JSX.Element {
  const sizeMap = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };
  const statusColors = {
    active: "bg-green-500",
    low-battery: "bg-yellow-500",
    critical-battery: "bg-red-500",
    offline: "bg-gray-500",
    returning: "bg-blue-500",
  };

  return (
    <span
      className={`
        ${sizeMap[size]}
        rounded-full
        ${statusColors[status]}
        ${status === "active" ? "border-2 border-slate-950" : ""}
      `}
      {...props}
    />
  );
}