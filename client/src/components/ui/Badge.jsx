import { cn } from "../../lib/utils";

export default function Badge({ children, variant = "default", className }) {
  const variants = {
    default:
      "bg-primary/10 border-primary/20 text-primary",
    success:
      "bg-emerald-950/40 border-emerald-900/30 text-emerald-400",
    warning:
      "bg-amber-950/40 border-amber-900/30 text-amber-400",
    danger:
      "bg-red-950/40 border-red-900/30 text-red-400",
    neutral:
      "bg-zinc-800/60 border-zinc-700/50 text-zinc-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium tracking-wide uppercase",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
