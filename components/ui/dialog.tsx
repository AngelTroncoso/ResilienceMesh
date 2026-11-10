import { ReactNode } from "react";

export function EmergencyDialog({
  open,
  onOpenChange,
  title,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
}): JSX.Element {
  return (
    <dialog open={open} onClose={onOpenChange} className="modal">
      <div className="py-4">
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        <div className="pt-2">{children}</div>
      </div>
    </dialog>
  );
}