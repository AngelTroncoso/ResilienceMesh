import { ReactNode } from "react";

export function EventsLog({
  events,
  limit = 10,
}: {
  events: any[];
  limit?: number;
}): JSX.Element {
  const recentEvents = events.slice(-limit);

  return (
    <div className="space-y-2 text-sm text-slate-400">
      {recentEvents.map((event) => (
        <div
          key={event.id}
          className={`flex items-start gap-2 px-2 py-1 rounded-md ${
            event.severity === "critical"
              ? "bg-red-500/20 text-red-400"
              : event.severity === "warning"
              ? "bg-yellow-500/20 text-yellow-300"
              : "bg-slate-950/50 text-slate-400"
          }`}
        >
          <span className="w-1 rounded-full bg-current mr-2"></span>
          <span>
            <span className="font-monospace">{event.type}</span>
            {event.message && <span className="ml-2">: {event.message}</span>}
          </span>
        </div>
      ))}
    </div>
  );
}