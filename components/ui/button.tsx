import { ReactNode } from "react";

export function Button({
  children,
  onClick,
  className,
  disabled,
  ...props
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}): JSX.Element {
  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-lg font-medium px-4 py-2 text-sm
        transition-all duration-200 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
        disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed
        active:scale-95
        ${className || ""}
      `}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

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
  const variantStyles = {
    default: "bg-slate-700 hover:bg-slate-600 text-slate-100 border-slate-600",
    primary: "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg shadow-blue-500/25",
    destructive: "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-lg shadow-red-500/25",
    secondary: "bg-slate-800/50 hover:bg-slate-700/70 text-slate-300 hover:text-white border border-slate-700"
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    default: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center rounded-lg font-medium
        transition-all duration-200 ease-out
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900
        disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed
        active:scale-95
        hover:shadow-xl
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className || ""}
      `}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}