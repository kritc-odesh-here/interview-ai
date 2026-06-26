import { cn } from "../../lib/utils";

export default function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border border-border-subtle bg-zinc-900/40",
        "px-4 py-3 text-sm text-white transition-all duration-200",
        "placeholder:text-zinc-500",
        "focus:border-primary/60 focus:bg-zinc-900/80 focus:outline-none focus:ring-2 focus:ring-primary/20",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
