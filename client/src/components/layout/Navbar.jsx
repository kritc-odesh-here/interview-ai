import { BrainCircuit, History, LogOut, Moon, Sun, User, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";

export default function Navbar({ user, theme, toggleTheme, onLogout }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);

  // Helper to extract initials
  const getInitials = (name) => {
    if (!name) return "AI";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Track window scroll progress to floating header transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 navbar-adaptive flex items-center ${isScrolled ? "scrolled" : ""}`}>
      <div className="w-full max-w-7xl mx-auto flex h-[70px] items-center justify-between px-6 sm:px-8">
        
        {/* Left Side: Logo */}
        <Link to="/" className="flex items-center gap-2.5 transition hover:opacity-90">
          <div className="rounded-lg bg-primary/10 border border-primary/20 p-1.5 shrink-0">
            <BrainCircuit className="h-4.5 w-4.5 text-primary" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white select-none">
            InterviewAI
          </span>
        </Link>

        {/* Right Side: Theme toggle & User Avatar Dropdown */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-900/60 hover:text-white transition-colors duration-150 cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* User Profile Dropdown */}
          {user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center focus:outline-none cursor-pointer group"
                aria-label="User profile menu"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 text-primary text-xs font-bold font-mono shadow-sm shrink-0 transition-all duration-200 group-hover:scale-105 group-hover:border-primary/45">
                  {getInitials(user.name || user.email)}
                </div>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-60 rounded-xl border border-zinc-850 bg-zinc-950/95 backdrop-blur-xl shadow-xl shadow-black/50 py-2 animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                  
                  {/* User Account Details */}
                  <div className="px-4 py-2.5 flex items-center gap-3 select-none">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 text-primary text-sm font-bold font-mono">
                      {getInitials(user.name || user.email)}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="text-xs font-semibold text-white truncate">
                        {user.name || "Candidate"}
                      </h4>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="h-[1px] bg-zinc-850/80 my-1.5" />

                  {/* Profile Link */}
                  <Link
                    to="/profile"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-900/60 hover:text-white transition-colors"
                  >
                    <User size={13} className="text-zinc-500" />
                    <span>Profile</span>
                  </Link>

                  {/* Interview History Link */}
                  <Link
                    to="/history"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-zinc-300 hover:bg-zinc-900/60 hover:text-white transition-colors"
                  >
                    <History size={13} className="text-zinc-500" />
                    <span>Interview History</span>
                  </Link>



                  <div className="h-[1px] bg-zinc-850/80 my-1.5" />

                  {/* Logout Action */}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onLogout();
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-950/20 transition-colors text-left cursor-pointer font-medium"
                  >
                    <LogOut size={13} className="text-red-400" />
                    <span>Logout</span>
                  </button>

                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
