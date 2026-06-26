import {
  Code2,
  Layout,
  Database,
  BarChart2,
  Cloud,
  ClipboardList,
  PenTool,
  Brain,
  HelpCircle,
} from "lucide-react";

const roleData = {
  "Full Stack Developer": {
    icon: Code2,
    description: "End-to-end web development across frontend and backend stacks.",
  },
  "Frontend Developer": {
    icon: Layout,
    description: "UI engineering, component design, and browser performance.",
  },
  "Backend Developer": {
    icon: Database,
    description: "APIs, databases, server-side logic, and system architecture.",
  },
  "Data Scientist": {
    icon: BarChart2,
    description: "Statistical modeling, ML pipelines, and data storytelling.",
  },
  "DevOps Engineer": {
    icon: Cloud,
    description: "CI/CD, infrastructure automation, and reliability engineering.",
  },
  "Product Manager": {
    icon: ClipboardList,
    description: "Roadmapping, stakeholder alignment, and product strategy.",
  },
  "UI/UX Designer": {
    icon: PenTool,
    description: "User research, interaction design, and visual systems.",
  },
  "Machine Learning Engineer": {
    icon: Brain,
    description: "Model training, deployment, and production ML systems.",
  },
};

export default function RoleCard({ title, onSelect, isHighlighted }) {
  const data = roleData[title];
  const IconComponent = data?.icon ?? HelpCircle;
  const description = data?.description ?? "AI-powered mock assessment.";

  return (
    <button
      type="button"
      onClick={() => onSelect(title)}
      className={`group w-full text-left p-6 rounded-2xl border transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 active:scale-[0.97] flex flex-col justify-between min-h-[170px] cursor-pointer ${
        isHighlighted
          ? "border-primary/20 bg-zinc-900/30 hover:border-primary/45 hover:bg-zinc-900/60 shadow-sm shadow-primary/5"
          : "border-zinc-800/40 bg-zinc-900/10 hover:bg-zinc-900/30 hover:border-zinc-700/80"
      }`}
    >
      <div>
        {/* Icon Container */}
        <div className={`h-10 w-10 flex items-center justify-center rounded-xl border transition-all duration-300 mb-5 ${
          isHighlighted
            ? "bg-zinc-900 border-primary/20 text-primary"
            : "bg-zinc-900 border-zinc-800 text-zinc-500 group-hover:text-primary group-hover:border-primary/20"
        }`}>
          <IconComponent size={18} />
        </div>

        {/* Text Details */}
        <h3 className="text-base font-bold text-white group-hover:text-primary tracking-tight mb-3 transition-colors duration-200">
          {title}
        </h3>
        <p className="text-sm text-zinc-400 group-hover:text-zinc-300 leading-relaxed transition-colors duration-200">
          {description}
        </p>
      </div>

      {isHighlighted && (
        <span className="inline-block mt-4 text-[9px] font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-0.5 rounded border border-primary/10 w-fit">
          Popular
        </span>
      )}
    </button>
  );
}
