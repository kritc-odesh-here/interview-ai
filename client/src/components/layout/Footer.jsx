export default function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-zinc-950 py-8 mt-auto">
      <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <p className="text-sm font-semibold text-zinc-300">InterviewAI</p>
          <p className="text-xs text-zinc-500">
            Professional AI-powered technical mock interviews.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 text-xs text-zinc-500">
          <span className="hover:text-zinc-300 cursor-default transition">Privacy Policy</span>
          <span className="hover:text-zinc-300 cursor-default transition">Terms of Service</span>
          <span>&copy; {new Date().getFullYear()} InterviewAI. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
