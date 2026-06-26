import { Inbox } from "lucide-react";

export default function EmptyState({
  icon: Icon = Inbox,
  title = "No data found",
  description = "There is nothing to display here yet.",
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-border-subtle bg-zinc-900/30 p-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500 mb-4">
        <Icon size={20} />
      </div>

      <h3 className="text-base font-semibold text-white mb-1">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-sm mb-6 leading-relaxed">
        {description}
      </p>

      {action && <div className="flex justify-center">{action}</div>}
    </div>
  );
}
