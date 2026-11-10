import { ReactNode } from "react";

export function EmergencyCard({
  title,
  children,
  className,
  action,
  actionLabel,
}: {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
  actionLabel?: string;
}): JSX.Element {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-sm flex flex-col {className}">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <div className="flex-1">{children}</div>
      {action && <div className="mt-4 flex justify-end">{action}</div>}
    </div>
  );
}