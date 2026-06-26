import { cn } from "../../lib/utils";

export default function Card({ children, className, hover = true }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-800 bg-zinc-900",
        "transition-all duration-300",
        hover && "hover:border-zinc-700 hover:-translate-y-1",
        className,
      )}
    >
      {children}
    </div>
  );
}
