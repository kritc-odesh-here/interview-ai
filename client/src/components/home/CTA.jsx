import { ArrowRight, Sparkles } from "lucide-react";
import Button from "../ui/Button";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export default function CTA({ onStart }) {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section 
      ref={ref}
      className={`w-full bg-[#09090B] py-24 md:py-32 border-t border-zinc-900/50 overflow-hidden relative reveal-fade-up ${
        isVisible ? "is-visible" : ""
      }`}
    >
      {/* Decorative radial gradient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
      
      {/* Grid texture */}
      <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-50" />

      <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-800/80 bg-zinc-900/80 text-[10px] font-bold text-primary uppercase tracking-widest mb-6">
          <Sparkles size={11} />
          <span>Launch Your Assessment</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-6">
          Ready to Ace Your Next Interview?
        </h2>

        {/* Description */}
        <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed mb-10">
          Get real-time feedback, structure your answers, and identify gaps before speaking to recruiters. Start a customized interview session instantly.
        </p>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button
            onClick={onStart}
            className="h-12 px-8 text-sm font-semibold shadow-md hover:shadow-primary/10 transition-all duration-300"
            rightIcon={<ArrowRight size={15} />}
          >
            Start AI Interview
          </Button>
        </div>
      </div>
    </section>
  );
}
