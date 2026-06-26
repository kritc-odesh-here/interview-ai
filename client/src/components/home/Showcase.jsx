import { Sparkles, Cpu, Clock, FileDown, ArrowUpRight, CheckCircle, Circle } from "lucide-react";
import Button from "../ui/Button";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export default function Showcase({ onCTAClick }) {
  const [ref, isVisible] = useScrollReveal();

  const features = [
    {
      icon: Sparkles,
      title: "AI-generated questions",
      desc: "Get unique, industry-standard interview topics tailored specifically to your target level."
    },
    {
      icon: Cpu,
      title: "Instant answer evaluation",
      desc: "Receive actionable diagnostics detailing code syntax issues, design patterns, and scores."
    },
    {
      icon: Clock,
      title: "Live timer & session tracking",
      desc: "Develop your response under a realistic timed window to match high-pressure interviews."
    },
    {
      icon: FileDown,
      title: "Downloadable PDF reports",
      desc: "Save comprehensive transcripts of your sessions, grading logs, and code solutions."
    }
  ];

  return (
    <section 
      ref={ref}
      className={`w-full bg-[#0E1117] py-24 md:py-32 border-b border-zinc-900/50 overflow-hidden relative reveal-fade-up ${
        isVisible ? "is-visible" : ""
      }`}
    >
      {/* Background radial glow */}
      <div className="absolute right-[-100px] top-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-20" />

      <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Column: Product Info */}
        <div className="space-y-12 relative z-10">
          <div className="space-y-6">
            <span className="text-[11px] font-bold text-primary uppercase tracking-widest block">
              AI Interview Workspace
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[64px] font-bold text-white tracking-tight leading-[1.02] max-w-xl">
              Practice in a focused developer environment.
            </h2>
            <p className="text-[20px] text-zinc-400 leading-[1.6] max-w-[640px]">
              Experience realistic mock interviews powered by AI. Write your answers in a clean, IDE-style interface, receive instant diagnostic feedback, and track your progress in real-time.
            </p>
          </div>

          {/* Feature List (Spaced rows with dividers) */}
          <div className="space-y-8 max-w-2xl">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={idx} 
                  className="flex gap-4 items-start border-t border-zinc-900/60 pt-8 first:border-0 first:pt-0"
                >
                  <Icon size={18} className="text-primary shrink-0 mt-1.5" />
                  <div className="space-y-2">
                    <h4 className="text-[22px] font-bold text-white tracking-tight leading-tight">
                      {feat.title}
                    </h4>
                    <p className="text-[16px] text-zinc-400 leading-[1.7] max-w-xl">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* CTA Trigger */}
          <div className="pt-2">
            <Button
              onClick={onCTAClick}
              className="h-10 px-5 text-xs font-semibold hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              rightIcon={<ArrowUpRight size={13} />}
            >
              Configure Your Session
            </Button>
          </div>
        </div>

        {/* Right Column: Simulated Product Mockup */}
        <div className="relative w-full z-10 flex justify-center">
          {/* Backing visual glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-2xl filter blur-xl opacity-30 pointer-events-none" />

          {/* Mock Browser Container */}
          <div className="w-full max-w-[480px] rounded-xl border border-zinc-800 bg-zinc-950/85 shadow-2xl shadow-black/80 overflow-hidden flex flex-col animate-float">
            
            {/* Header chrome */}
            <div className="h-9 bg-zinc-950 border-b border-zinc-900 flex items-center px-4 justify-between select-none">
              {/* Window Controls */}
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 rounded-full bg-red-500/70" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/70" />
                <div className="w-2 h-2 rounded-full bg-green-500/70" />
              </div>

              {/* Mock Address bar */}
              <div className="bg-zinc-900 border border-zinc-850 rounded text-[9px] text-zinc-500 px-10 py-0.5 font-mono truncate max-w-[200px]">
                interviewai.dev/session/active
              </div>

              {/* Extra Chrome detail */}
              <div className="w-6 h-1.5 rounded bg-zinc-900" />
            </div>

            {/* Simulated Workspace */}
            <div className="flex h-[280px] text-[10px] font-sans relative">
              
              {/* Mock Sidebar */}
              <div className="w-[130px] border-r border-zinc-900 bg-zinc-950/40 p-3 flex flex-col justify-between select-none">
                <div className="space-y-4">
                  <div>
                    <h5 className="text-[8px] font-bold text-zinc-600 uppercase tracking-wider mb-2">
                      Questions
                    </h5>
                    <div className="space-y-2">
                      {/* Completed Question */}
                      <div className="flex items-center gap-1.5 text-zinc-550">
                        <CheckCircle size={10} className="text-zinc-700" />
                        <span className="truncate">01: Lexical Scope</span>
                      </div>
                      {/* Active Question */}
                      <div className="flex items-center gap-1.5 text-zinc-200 font-semibold bg-zinc-900/60 p-1 rounded-md border-l border-primary">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="truncate">02: Context Bind</span>
                      </div>
                      {/* Next Question */}
                      <div className="flex items-center gap-1.5 text-zinc-600">
                        <Circle size={10} className="text-zinc-800" />
                        <span className="truncate">03: Event Loop</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar timer */}
                <div className="border-t border-zinc-900 pt-2 flex items-center justify-between text-[8px] text-zinc-650">
                  <span>TIME REMAINING</span>
                  <span className="font-mono text-zinc-400 font-bold">08:42</span>
                </div>
              </div>

              {/* Mock Code Editor */}
              <div className="flex-1 bg-zinc-900/10 p-4 font-mono text-[9px] text-zinc-400 leading-normal select-none overflow-hidden">
                <span className="text-zinc-600 block mb-2">// Question #2: Explain call, apply, bind</span>
                <span className="text-primary">const</span> person = &#123; name: <span className="text-teal-400">"Alex"</span> &#125;;<br /><br />
                <span className="text-zinc-600">// bind yields a callable wrapper:</span><br />
                <span className="text-primary">const</span> greet = <span className="text-zinc-300">function</span>(msg) &#123;<br />
                &nbsp;&nbsp;<span className="text-zinc-300">return</span> <span className="text-teal-400">`$&#123;msg&#125;, $&#123;</span><span className="text-zinc-300">this</span>.name<span className="text-teal-400">&#125;`</span>;<br />
                &#125;;<br /><br />
                <span className="text-primary">const</span> hello = greet.bind(person);<br />
                console.log(hello(<span className="text-teal-400">"Hey"</span>));
              </div>

              {/* Layered Floating AI Feedback widget */}
              <div className="absolute bottom-3 right-3 left-3 md:left-auto md:w-[280px] bg-zinc-950/95 border border-primary/20 rounded-xl p-3.5 space-y-2.5 shadow-xl shadow-black/80 z-20 select-none">
                <div className="flex justify-between items-center pb-1.5 border-b border-zinc-900">
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-primary uppercase tracking-wider">
                    <Sparkles size={10} />
                    <span>AI Evaluation Complete</span>
                  </div>
                  <span className="font-mono font-bold text-zinc-100 bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded text-[9px]">
                    9.2 / 10
                  </span>
                </div>
                
                <div className="space-y-1.5 text-[9px] leading-relaxed text-zinc-400">
                  <p>
                    <strong className="text-zinc-200">✓ Strength:</strong> Correctly distinguished immediate invocation (call/apply) from partial binding (bind).
                  </p>
                  <p>
                    <strong className="text-zinc-200">⚠ Gap:</strong> Mention arguments array difference in apply vs call to push score to 10.
                  </p>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
