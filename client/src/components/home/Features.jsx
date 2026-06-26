import { BrainCircuit, Clock, BarChart3, FileDown, Sparkles } from "lucide-react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export default function Features() {
  const [ref, isVisible] = useScrollReveal();

  return (
    <section 
      ref={ref}
      className={`w-full bg-[#0C1016] py-24 sm:py-32 border-b border-zinc-900/50 reveal-fade-up ${
        isVisible ? "is-visible" : ""
      }`}
    >
      {/* Decorative Grid texture */}
      <div className="absolute inset-0 bg-grid-subtle pointer-events-none opacity-40" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Section Header - Left Aligned */}
        <div className="mb-16 max-w-xl">
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest block mb-3">
            Platform Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Deep assessment toolkit.
          </h2>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            Everything you need to benchmark your engineering skills, built into a single focused workspace.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: AI Answer Evaluation (Spans 2 columns) */}
          <div 
            className={`p-6 rounded-2xl border border-zinc-800/40 bg-zinc-900/10 hover:bg-zinc-900/20 hover:border-zinc-700/80 transition-all duration-300 flex flex-col justify-between md:col-span-2 lg:col-span-2 min-h-[250px] transition-all duration-700 delay-100 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="space-y-5">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-primary">
                <BrainCircuit size={18} />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  AI Answer Evaluation
                </h3>
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-md">
                  Detailed grading generated per question with specific, constructive feedback and code improvements — no boilerplate summaries.
                </p>
              </div>
            </div>

            {/* Mock UI Element */}
            <div className="mt-6 p-4 rounded-xl border border-zinc-800/40 bg-zinc-950/60 font-sans text-[11px] space-y-3 shadow-inner">
              <div className="flex justify-between items-center text-zinc-400 border-b border-zinc-900 pb-2">
                <span className="font-medium">Question #1 (JavaScript)</span>
                <span className="text-primary font-bold bg-primary/5 px-2 py-0.5 rounded border border-primary/10">8.5 / 10</span>
              </div>
              <p className="text-zinc-350 font-mono text-[10px] leading-relaxed">
                Explain the difference between call, apply, and bind...
              </p>
              <div className="p-2.5 rounded bg-primary/5 text-primary border border-primary/10 flex items-start gap-2">
                <Sparkles size={12} className="shrink-0 mt-0.5" />
                <span className="text-[10px]">
                  <strong>AI Note:</strong> Excellent detail on context binding. Try highlighting the performance difference of pre-binding.
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Timed Sessions (Spans 1 column) */}
          <div 
            className={`p-6 rounded-2xl border border-zinc-800/40 bg-zinc-900/10 hover:bg-zinc-900/20 hover:border-zinc-700/80 transition-all duration-300 flex flex-col justify-between min-h-[250px] transition-all duration-700 delay-200 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="space-y-5">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500">
                <Clock size={18} />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Timed Sessions
                </h3>
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                  Simulate pressure with custom timelines. Auto-submits your draft response when the count finishes.
                </p>
              </div>
            </div>

            {/* Mock UI Element */}
            <div className="mt-6 p-4 rounded-xl border border-zinc-800/40 bg-zinc-950/60 flex flex-col items-center justify-center space-y-3 shadow-inner">
              <div className="text-2xl font-bold font-mono text-zinc-300 tracking-widest tabular-nums animate-pulse">01:54</div>
              <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                <div className="bg-primary h-full w-[80%] rounded-full transition-all duration-1000" />
              </div>
              <span className="text-[9px] text-zinc-550 uppercase tracking-widest">Time Remaining</span>
            </div>
          </div>

          {/* Card 3: Performance Analytics (Spans 1 column) */}
          <div 
            className={`p-6 rounded-2xl border border-zinc-800/40 bg-zinc-900/10 hover:bg-zinc-900/20 hover:border-zinc-700/80 transition-all duration-300 flex flex-col justify-between min-h-[250px] transition-all duration-700 delay-300 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="space-y-5">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500">
                <BarChart3 size={18} />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Analytics & Metrics
                </h3>
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                  Track your score progression, success rate, and question-type breakdown over multiple sessions.
                </p>
              </div>
            </div>

            {/* Mock UI Element */}
            <div className="mt-6 p-4 rounded-xl border border-zinc-800/40 bg-zinc-950/60 flex flex-col justify-between h-[80px] shadow-inner">
              <div className="flex justify-between items-center text-[10px] text-zinc-555">
                <span>Success Rate</span>
                <span className="font-bold text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded border border-green-550/10 text-[9px]">+12%</span>
              </div>
              <div className="flex items-end gap-1.5 h-7">
                <div className="bg-zinc-855 w-full h-[30%] rounded-sm" />
                <div className="bg-zinc-855 w-full h-[55%] rounded-sm" />
                <div className="bg-zinc-855 w-full h-[40%] rounded-sm" />
                <div className="bg-primary/30 w-full h-[65%] rounded-sm" />
                <div className="bg-primary w-full h-[90%] rounded-sm animate-pulse" />
              </div>
            </div>
          </div>

          {/* Card 4: PDF Report Download (Spans 2 columns) */}
          <div 
            className={`p-6 rounded-2xl border border-zinc-800/40 bg-zinc-900/10 hover:bg-zinc-900/20 hover:border-zinc-700/80 transition-all duration-300 flex flex-col justify-between md:col-span-2 lg:col-span-2 min-h-[250px] transition-all duration-700 delay-400 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="space-y-5">
              <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-500">
                <FileDown size={18} />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  PDF Report Exports
                </h3>
                <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-md">
                  Instantly download a clean, structured PDF summary of your questions, answers, and AI evaluation report card for future study offline.
                </p>
              </div>
            </div>

            {/* Mock UI Element */}
            <div className="mt-6 p-4 rounded-xl border border-zinc-800/40 bg-zinc-950/60 flex items-center justify-between text-[11px] font-sans shadow-inner">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold font-mono text-[9px]">
                  PDF
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-350 text-[11px]">mock_report.pdf</h4>
                  <span className="text-zinc-650 text-[9px]">142 KB • Ready</span>
                </div>
              </div>
              <button 
                type="button" 
                className="text-primary hover:underline font-semibold text-[11px] transition-colors duration-200 cursor-pointer"
              >
                Download
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
