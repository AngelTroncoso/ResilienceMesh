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
    <dialog 
      open={open} 
      onClose={() => onOpenChange(false)} 
      className="modal"
    >
      <div className="py-4">
        <h3 className="text-lg font-medium text-foreground">{title}</h3>
        <div className="pt-2">{children}</div>
        <div className="mt-4">
          <button 
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 rounded bg-slate-700 hover:bg-slate-600"
          >
            Cerrar
          </button>
        </div>
      </div>
    </dialog>
  );
}