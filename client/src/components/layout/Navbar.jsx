import { BrainCircuit, History, LogOut, Moon, Sun, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import Button from "../ui/Button";

export default function Navbar({ user, theme, toggleTheme, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to extract uppercase initials from candidate name
  const getInitials = (name) => {
    if (!name) return "AI";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-900 bg-zinc-950/70 backdrop-blur-md">
      <div className="w-full max-w-7xl mx-auto flex h-[70px] items-center justify-between px-6 sm:px-8">
        
        {/* Left Side: Shrunk Logo */}
        <Link to="/" className="flex items-center gap-2.5 transition hover:opacity-90">
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-1.5 shrink-0">
            <BrainCircuit className="h-4.5 w-4.5 text-primary" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white select-none">
            InterviewAI
          </span>
        </Link>

        {/* Desktop Navbar Actions (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* User Profile info (Compact name, no subtitle) */}
          {user && (
            <div className="flex items-center gap-2.5 select-none">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 text-primary text-xs font-bold font-mono shadow-sm shrink-0">
                {getInitials(user.name || user.email)}
              </div>
              <span className="inline text-xs font-semibold text-zinc-300 tracking-tight max-w-[120px] truncate">
                {user.name || "Candidate"}
              </span>
            </div>
          )}

          {/* Short, subtle vertical divider */}
          {user && <div className="h-4 w-[1px] bg-zinc-850/80" />}

          {/* Actions group */}
          <div className="flex items-center gap-1.5">
            
            {/* Theme Toggle (40px square) */}
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900/60 hover:text-white transition-colors duration-150 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            {/* History Link (40px height, compact) */}
            <Link to="/history" className="shrink-0">
              <Button
                variant="outline"
                leftIcon={<History size={13} className="text-zinc-500" />}
                className="h-10 px-3 border-zinc-800/80 text-zinc-300 hover:bg-zinc-900/60 rounded-lg text-xs"
              >
                History
              </Button>
            </Link>

            {/* Logout button (40px height, custom hover color) */}
            {user && (
              <button
                onClick={onLogout}
                className="flex h-10 items-center gap-1.5 px-3.5 rounded-lg bg-red-950/20 border border-red-900/20 text-red-400/90 hover:bg-red-900 hover:text-white transition-colors duration-150 text-xs font-medium cursor-pointer"
              >
                <LogOut size={13} />
                <span>Logout</span>
              </button>
            )}

          </div>
        </div>

        {/* Mobile Navbar Actions Group (Visible on Mobile) */}
        <div className="flex md:hidden items-center gap-2">
          
          {/* Theme Toggle (Always visible) */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900/60 hover:text-white transition-colors duration-150 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Profile Initials (Always visible if logged in) */}
          {user && (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 text-primary text-xs font-bold font-mono shadow-sm shrink-0 select-none">
              {getInitials(user.name || user.email)}
            </div>
          )}

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900/60 hover:text-white transition-colors duration-150 cursor-pointer border border-zinc-800/50"
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

        </div>

      </div>

      {/* Mobile Dropdown Panel */}
      {isOpen && (
        <div className="md:hidden border-t border-zinc-900 bg-zinc-950 px-6 py-5 space-y-4 animate-in slide-in-from-top duration-200">
          {user && (
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-900">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 text-primary text-xs font-bold font-mono shadow-sm">
                {getInitials(user.name || user.email)}
              </div>
              <div className="select-none">
                <p className="text-xs font-semibold text-white">
                  {user.name || "Candidate"}
                </p>
                <p className="text-[10px] text-zinc-500 truncate max-w-[200px]">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {/* History Link (Full Width) */}
            <Link to="/history" className="w-full" onClick={() => setIsOpen(false)}>
              <Button
                variant="outline"
                leftIcon={<History size={14} className="text-zinc-500" />}
                className="w-full h-11 border-zinc-800 text-zinc-300 hover:bg-zinc-900 rounded-xl text-xs flex justify-center items-center"
              >
                View History
              </Button>
            </Link>

            {/* Logout button (Full Width) */}
            {user && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="w-full flex h-11 items-center justify-center gap-2 px-4 rounded-xl bg-red-950/20 border border-red-900/20 text-red-400 hover:bg-red-900 hover:text-white transition-colors duration-150 text-xs font-semibold cursor-pointer"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
