import { Sparkles, Briefcase, ArrowRight, Compass, Award, Flame, Clock3, Hourglass, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";

const DIFFICULTIES = [
  { level: "Easy", desc: "Good for beginners", icon: Compass },
  { level: "Medium", desc: "Balanced challenge", icon: Award },
  { level: "Hard", desc: "Advanced interview", icon: Flame },
];

const QUESTION_COUNTS = [
  { count: 5, timeDesc: "~10 min", icon: Clock3 },
  { count: 10, timeDesc: "~20 min", icon: Hourglass },
  { count: 15, timeDesc: "~30 min", icon: Timer },
];

const POPULAR_CHIPS = [
  "Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "React Developer",
  "Node.js Developer",
  "Java Developer",
  "Python Developer",
  "DevOps Engineer",
  "Data Scientist"
];

export default function Hero({
  customRole,
  setCustomRole,
  handleCustomRole,
  difficulty,
  setDifficulty,
  questionCount,
  setQuestionCount,
  isMobile,
  interviewMode,
  setInterviewMode,
  resumeFile,
  setResumeFile,
  resumeFilename,
  setResumeFilename,
  analyzing,
}) {
  const [mounted, setMounted] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 80);
  };

  const handleFileChange = (file) => {
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Only PDF files are supported!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit!");
      return;
    }
    setResumeFile(file);
    setResumeFilename(file.name);
    setUploadProgress(0);
    simulateUpload();
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    setResumeFilename("");
    setUploadProgress(0);
  };

  return (
    <section className="w-full bg-[#09090B] pt-28 pb-32 md:pt-36 md:pb-40 relative overflow-hidden">
      {/* Decorative radial background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/5 rounded-full blur-[110px] pointer-events-none" />
      
      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-grid-dots pointer-events-none opacity-30" />

      <div 
        className={`max-w-2xl mx-auto px-6 text-center relative z-10 transition-all duration-700 ease-out transform ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        {/* Groq Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-850 bg-zinc-900/60 text-[11px] font-medium text-zinc-400 tracking-wide mb-8">
          <Sparkles size={11} className="text-primary animate-pulse" />
          <span>Powered by Groq AI</span>
        </div>

        {/* Heading */}
        <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold tracking-tight text-white leading-[1.15] mb-5">
          Master Technical Interviews
          <br />
          <span className="text-zinc-400 font-semibold">with AI-powered practice.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-zinc-400 max-w-lg mx-auto leading-relaxed mb-14">
          Practice role-specific questions, receive instant AI feedback, and track
          your progress — all in one focused workspace.
        </p>

        {/* Configuration Panel */}
        <div className="w-full text-left space-y-10 max-w-[630px] mx-auto p-6 md:p-8 rounded-2xl border border-zinc-800/40 bg-zinc-900/10 backdrop-blur-sm shadow-xl shadow-black/20">
          
          {/* Target Role Input & Popular Chips (Step 1) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Target Role
              </label>
              <span className="text-[8px] font-bold text-primary bg-primary/5 px-1.5 py-0.5 border border-primary/10 rounded uppercase tracking-wider">
                Step 1
              </span>
            </div>

            {/* Premium, full-width search input */}
            <div className="relative">
              <Briefcase
                size={15}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-650 pointer-events-none"
              />
              <Input
                type="text"
                className="pl-11 pr-4 h-14 text-sm border-zinc-800/80 bg-zinc-950/20 focus:bg-zinc-950/40 rounded-xl w-full text-zinc-200 placeholder:text-zinc-600 placeholder:text-[13px] tracking-wide"
                placeholder="Search or type the role you're preparing for..."
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCustomRole()}
              />
            </div>

            {/* Popular Roles Chips (Horizontal scrolling chips) */}
            <div className="space-y-2 pt-1">
              <span className="block text-[8px] font-bold text-zinc-500 uppercase tracking-wider">
                Popular Roles
              </span>
              <div className="flex flex-wrap gap-2 pb-1 select-none">
                {POPULAR_CHIPS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => setCustomRole(chip)}
                    className={`px-2.5 py-1.5 rounded-lg border text-[9px] font-semibold transition-all duration-150 cursor-pointer ${
                      customRole === chip
                        ? "border-primary bg-primary/10 text-primary border-primary/20"
                        : "border-zinc-800 bg-zinc-900/10 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300 hover:bg-zinc-900/20"
                    }`}
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interview Mode Selector (Step 2) */}
          <div className="space-y-4 pt-1">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Interview Mode
              </label>
              <span className="text-[8px] font-bold text-primary bg-primary/5 px-1.5 py-0.5 border border-primary/10 rounded uppercase tracking-wider">
                Step 2
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option 1: Quick Interview */}
              <button
                type="button"
                onClick={() => setInterviewMode("quick")}
                className={`relative px-6 py-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[100px] select-none ${
                  interviewMode === "quick"
                    ? "border-primary bg-primary/[0.03] text-zinc-105 shadow-md shadow-primary/5"
                    : "border-zinc-800/50 bg-zinc-900/10 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-sm font-bold text-white">Quick Interview</span>
                  {interviewMode === "quick" && (
                    <div className="h-3.5 w-3.5 rounded-full bg-primary/25 border border-primary/30 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Start instantly. Target questions based purely on selected role and difficulty.
                </p>
              </button>

              {/* Option 2: Personalized Interview */}
              <button
                type="button"
                onClick={() => setInterviewMode("personalized")}
                className={`relative px-6 py-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[100px] select-none ${
                  interviewMode === "personalized"
                    ? "border-primary bg-primary/[0.03] text-zinc-105 shadow-md shadow-primary/5"
                    : "border-zinc-800/50 bg-zinc-900/10 text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
                }`}
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="text-sm font-bold text-white flex items-center gap-1.5">
                    Personalized
                    <span className="text-[9px] font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded leading-none shrink-0">
                      Recommended
                    </span>
                  </span>
                  {interviewMode === "personalized" && (
                    <div className="h-3.5 w-3.5 rounded-full bg-primary/25 border border-primary/30 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    </div>
                  )}
                </div>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  AI analyzes your resume to tailor projects, scaling, and custom technical challenges.
                </p>
              </button>
            </div>
          </div>

          {/* Resume Upload Box (If personalized mode is active) */}
          {interviewMode === "personalized" && (
            <div className="space-y-3 pt-1">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Resume (Optional)
                </label>
              </div>
              
              {!resumeFile ? (
                // Drag & Drop Area
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileChange(e.dataTransfer.files[0]);
                    }
                  }}
                  className="border border-dashed border-zinc-800 rounded-xl p-5 text-center bg-zinc-950/10 hover:border-zinc-700 transition duration-200 flex flex-col items-center justify-center group"
                >
                  <input
                    type="file"
                    id="resume-upload"
                    className="hidden"
                    accept="application/pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileChange(e.target.files[0]);
                      }
                    }}
                  />
                  <label
                    htmlFor="resume-upload"
                    className="cursor-pointer text-xs font-semibold text-zinc-400 group-hover:text-white transition duration-150"
                  >
                    Drag & Drop your resume here or{" "}
                    <span className="text-primary hover:underline">Browse</span>
                  </label>
                  <span className="text-[9px] text-zinc-650 block mt-1.5">PDF only • Max size: 5MB</span>
                </div>
              ) : (
                // Uploaded / Uploading State
                <div className="border border-zinc-800 rounded-xl p-4 bg-zinc-950/30 flex items-center justify-between">
                  <div className="flex-grow mr-4">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs font-bold text-zinc-200 truncate max-w-[130px] xs:max-w-[180px] sm:max-w-[200px]">
                        {uploadProgress < 100 ? "Uploading..." : `✓ ${resumeFilename}`}
                      </span>
                      {uploadProgress === 100 && (
                        <span className="text-[8px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full leading-none">
                          Uploaded Successfully
                        </span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>

                  {uploadProgress === 100 && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-[9px] font-semibold text-red-400 hover:text-red-300 hover:underline px-1 py-1 cursor-pointer"
                      >
                        Remove
                      </button>
                      <label
                        htmlFor="resume-replace"
                        className="text-[9px] font-semibold text-zinc-400 hover:text-white hover:underline px-1 py-1 cursor-pointer"
                      >
                        Replace
                        <input
                          type="file"
                          id="resume-replace"
                          className="hidden"
                          accept="application/pdf"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleFileChange(e.target.files[0]);
                            }
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Difficulty Selection (Step 3) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Difficulty
              </label>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Step 3</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {DIFFICULTIES.map(({ level, desc, icon: IconComponent }) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`relative px-5 py-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[110px] select-none ${
                    difficulty === level
                      ? "border-primary bg-primary/[0.03] text-zinc-100 shadow-md shadow-primary/5"
                      : "border-zinc-800/50 bg-zinc-900/10 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div className={`p-1.5 rounded-lg border transition-colors ${
                      difficulty === level ? "bg-primary/10 border-primary/20 text-primary" : "bg-zinc-950 border-zinc-850 text-zinc-500"
                    }`}>
                      <IconComponent size={16} />
                    </div>
                    {difficulty === level && (
                      <div className="h-4 w-4 rounded-full bg-primary/25 border border-primary/30 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{level}</h4>
                    <p className="text-xs text-zinc-300 leading-relaxed mt-1">{desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Question Count Selection (Step 4) */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Question Count
              </label>
              <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Step 4</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {QUESTION_COUNTS.map(({ count, timeDesc, icon: CountIcon }) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`relative px-5 py-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[110px] select-none ${
                    questionCount === count
                      ? "border-primary bg-primary/[0.03] text-zinc-100 shadow-md shadow-primary/5"
                      : "border-zinc-800/50 bg-zinc-900/10 text-zinc-400 hover:border-zinc-700 hover:text-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-3">
                    <div className={`p-1.5 rounded-lg border transition-colors ${
                      questionCount === count ? "bg-primary/10 border-primary/20 text-primary" : "bg-zinc-950 border-zinc-850 text-zinc-500"
                    }`}>
                      <CountIcon size={16} />
                    </div>
                    {questionCount === count && (
                      <div className="h-4 w-4 rounded-full bg-primary/25 border border-primary/30 flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{count} Questions</h4>
                    <p className="text-xs text-zinc-300 leading-relaxed mt-1">{timeDesc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CTA Submit Button Block */}
          <div className="border-t border-zinc-800/50 pt-8 mt-4">
            <Button
              onClick={handleCustomRole}
              disabled={analyzing || (!customRole.trim() && interviewMode === "quick")}
              className="w-full h-12 text-sm font-semibold hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer"
              rightIcon={analyzing ? null : <ArrowRight size={15} />}
            >
              {analyzing 
                ? (interviewMode === "personalized" ? "Analyzing Resume..." : "Generating Questions...") 
                : "Start AI Interview"}
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
