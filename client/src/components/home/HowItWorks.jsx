import { Play, PenLine, Cpu, TrendingUp } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const steps = [
  {
    number: "01",
    title: "Configure Session",
    description:
      "Pick a target role, difficulty level, and question count to tailor your practice session.",
    icon: Play,
  },
  {
    number: "02",
    title: "Answer Questions",
    description:
      "Draft structured responses in a timed coding-style workspace with an active countdown.",
    icon: PenLine,
  },
  {
    number: "03",
    title: "Get AI Feedback",
    description:
      "Groq AI evaluates your submissions, highlighting specific areas of strength and gaps.",
    icon: Cpu,
  },
  {
    number: "04",
    title: "Analyze Progress",
    description:
      "Review past reports, track your scores over time, and export summary PDFs.",
    icon: TrendingUp,
  },
];

export default function HowItWorks() {
  const [ref, isVisible] = useScrollReveal();

  const getDelayClass = (idx) => {
    const delays = ["delay-100", "delay-200", "delay-300", "delay-400"];
    return delays[idx % delays.length];
  };

  return (
    <section 
      ref={ref}
      className={`w-full bg-[#09090B] py-24 sm:py-32 border-b border-zinc-900/50 reveal-fade-up ${
        isVisible ? "is-visible" : ""
      }`}
    >
      <div className="max-w-5xl mx-auto px-6">
        {/* Section Header - Left Aligned */}
        <div className="mb-16 max-w-xl">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-3">
            Workflow
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Simple, automated preparation.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Our assessment workflow simulates standard recruiter screens and provides deep, instant technical evaluations.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx} 
                className={`relative space-y-5 transition-all duration-700 ease-out transform ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                } ${getDelayClass(idx)}`}
              >
                {/* Horizontal Connector Line for Desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-5 left-12 w-[calc(100%-2rem)] h-[1px] border-t border-dashed border-zinc-800/80 pointer-events-none" />
                )}

                {/* Step indicator */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800/80 text-zinc-400 shrink-0 relative z-10">
                    <Icon size={16} />
                  </div>
                  <span className="text-[10px] font-bold text-zinc-650 tracking-widest uppercase relative z-10">
                    Step {step.number}
                  </span>
                </div>

                {/* Description details */}
                <div className="pt-3 space-y-3">
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
