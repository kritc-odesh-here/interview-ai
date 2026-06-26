import { cn } from "../../lib/utils";

export default function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  leftIcon,
  rightIcon,
  ...props
}) {
  const variants = {
    primary:
      "bg-primary text-white hover:bg-primary-hover shadow-md shadow-primary/10 border border-primary/20",
    secondary:
      "bg-zinc-900 border border-zinc-800 text-zinc-100 hover:bg-zinc-850 hover:border-zinc-700",
    outline:
      "border border-border-subtle bg-transparent text-zinc-200 hover:bg-zinc-900 hover:border-zinc-700",
    ghost:
      "bg-transparent text-zinc-400 hover:bg-zinc-900 hover:text-white",
    danger:
      "bg-red-950/40 border border-red-900/30 text-red-400 hover:bg-red-900/50 hover:text-red-300",
  };

  const sizes = {
    sm: "h-9 px-4 text-xs",
    md: "h-11 px-6 text-sm",
    lg: "h-12 px-8 text-base",
  };

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200",
        "focus:outline-none focus:ring-2 focus:ring-primary/40",
        "disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {leftIcon && <span className="inline-flex">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </button>
  );
}
