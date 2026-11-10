import { ReactNode } from "react";

export function EmergencyButton({
  children,
  variant = "default",
  size = "default",
  onClick,
  className,
  disabled,
  ...props
}: {
  children: ReactNode;
  variant?: "default" | "primary" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}): JSX.Element {
  return (
    <button
      className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}