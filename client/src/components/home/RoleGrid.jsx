import RoleCard from "./RoleCard";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export default function RoleGrid({ roles, setCustomRole }) {
  const [ref, isVisible] = useScrollReveal();

  const handleSelect = (title) => {
    setCustomRole(title);
    // Scroll to the top of the page so user sees the filled input
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // List of roles to highlight for variety
  const highlightedRoles = ["Full Stack Developer", "Backend Developer", "Machine Learning Engineer"];

  // Custom staggered delay class names based on index
  const getDelayClass = (idx) => {
    const delays = [
      "delay-100",
      "delay-150",
      "delay-200",
      "delay-250",
      "delay-300",
      "delay-350",
      "delay-400",
      "delay-450",
    ];
    return delays[idx % delays.length];
  };

  return (
    <section 
      ref={ref}
      className={`w-full bg-[#0F1115] py-24 sm:py-32 border-y border-zinc-900/50 reveal-fade-up ${
        isVisible ? "is-visible" : ""
      }`}
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Header - Left Aligned */}
        <div className="mb-16 max-w-xl">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-3">
            Featured Roles
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Practice for popular tracks.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Select a specialized profile below to pre-configure your questions. The workspace will load standard technical topics matching the role.
          </p>
        </div>

        {/* Roles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {roles.map((role, idx) => (
            <div 
              key={role.title} 
              className={`transition-all duration-700 ease-out transform ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              } ${getDelayClass(idx)}`}
            >
              <RoleCard
                title={role.title}
                onSelect={handleSelect}
                isHighlighted={highlightedRoles.includes(role.title)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
