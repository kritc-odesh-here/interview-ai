import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import jsPDF from "jspdf";
import toast from "react-hot-toast";
import { 
  User, 
  Mail, 
  Calendar, 
  TrendingUp, 
  Award, 
  Clock, 
  FileText, 
  Plus, 
  Play, 
  Upload,
  CalendarDays,
  Activity,
  CheckCircle2,
  FileCode,
  ShieldAlert,
  Info,
  ChevronRight,
  History,
  KeyRound,
  ArrowLeft
} from "lucide-react";
import API from "../utils/api";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

// Custom Google Brand Icon SVG
const GoogleIcon = ({ size = 16, className = "" }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
  >
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
  </svg>
);

export default function Profile({ toggleTheme, theme }) {
  const navigate = useNavigate();

  // User and Stats states
  const [userProfile, setUserProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);

  // Fetch real profile details and aggregated statistics from MongoDB on-mount
  useEffect(() => {
    const fetchProfileAndStats = async () => {
      try {
        const [profileRes, statsRes] = await Promise.all([
          API.get("/api/auth/me"),
          API.get("/api/interview/stats")
        ]);
        setUserProfile(profileRes.data);
        setStats(statsRes.data);
        localStorage.setItem("user", JSON.stringify(profileRes.data));
      } catch (err) {
        console.error("Failed to sync profile and statistics details:", err);
        toast.error("Failed to load user information.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("activeQuestions");
    localStorage.removeItem("activeQuestionIndex");
    localStorage.removeItem("activeUserAnswers");
    localStorage.removeItem("activeQuestionTimers");
    navigate("/login");
  };

  const getInitials = (name) => {
    if (!name) return "AI";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long.");
      return;
    }

    setUpdatingPassword(true);
    try {
      await API.put("/api/auth/update-password", {
        currentPassword,
        newPassword
      });
      toast.success("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password. Please check your current password.");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const downloadLatestReport = async () => {
    if (!stats || stats.totalInterviews === 0) {
      toast.error("No mock interviews completed yet!");
      return;
    }

    setDownloadingReport(true);
    try {
      const res = await API.get("/api/interview/sessions");
      const sessionsList = res.data;
      if (sessionsList.length === 0) {
        toast.error("No interview history found!");
        return;
      }

      const latest = sessionsList[0];
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      // Header Title
      doc.setFontSize(22);
      doc.setTextColor(20, 184, 166); // Teal
      doc.text("InterviewAI Report Card", pageWidth / 2, y, { align: "center" });
      y += 10;

      // Session Meta details
      doc.setFontSize(12);
      doc.setTextColor(100, 100, 100);
      doc.text(`Target Role: ${latest.role}`, pageWidth / 2, (y += 8), { align: "center" });
      doc.text(`Date Evaluated: ${new Date(latest.createdAt).toLocaleDateString()}`, pageWidth / 2, (y += 6), {
        align: "center",
      });

      // Score Summary
      doc.setFontSize(16);
      doc.setTextColor(99, 102, 241); // Indigo
      doc.text(`Overall Score: ${latest.overallScore}/10`, pageWidth / 2, (y += 12), {
        align: "center",
      });

      // Separation line
      doc.setDrawColor(99, 102, 241);
      doc.line(20, (y += 8), pageWidth - 20, y);
      y += 10;

      // Question / Assessment evaluations
      latest.questions.forEach((q, index) => {
        if (y > 250) {
          doc.addPage();
          y = 20;
        }

        // Question Text
        doc.setFontSize(12);
        doc.setTextColor(99, 102, 241);
        doc.text(`Q${index + 1}: ${q.question}`, 20, y, {
          maxWidth: pageWidth - 40,
        });
        y += Math.ceil(q.question.length / 80) * 6 + 4;

        // Candidate Response
        doc.setFontSize(10);
        doc.setTextColor(60, 60, 60);
        doc.text(`Your Response: ${q.answer || "No response provided."}`, 20, y, {
          maxWidth: pageWidth - 40,
        });
        y += Math.ceil((q.answer || "No response provided.").length / 90) * 5 + 4;

        // AI grading feedback
        doc.setTextColor(100, 100, 100);
        doc.text(`AI Feedback: ${q.feedback}`, 20, y, {
          maxWidth: pageWidth - 40,
        });
        y += Math.ceil(q.feedback.length / 90) * 5 + 4;

        // AI Score
        doc.setTextColor(99, 102, 241);
        doc.text(`Score: ${q.score}/10`, 20, y);
        y += 10;

        // Card separation line
        doc.setDrawColor(220, 220, 220);
        doc.line(20, y, pageWidth - 20, y);
        y += 8;
      });

      doc.save(`InterviewAI-Report-${latest.role.replace(/\s+/g, "_")}-${new Date(latest.createdAt).toLocaleDateString()}.pdf`);
      toast.success("Latest report PDF downloaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate PDF report.");
    } finally {
      setDownloadingReport(false);
    }
  };

  const handleDeleteAccountConfirm = async () => {
    if (deleteConfirmText.toLowerCase() !== "delete my account") {
      toast.error("Please match the confirmation phrase exactly.");
      return;
    }
    if (userProfile.provider === "local" && !deletePassword) {
      toast.error("Please enter your current password to confirm deletion.");
      return;
    }

    setDeletingAccount(true);
    try {
      await API.delete("/api/auth/delete-account", {
        data: { password: deletePassword }
      });
      toast.success("Your account and mock history have been permanently deleted.");
      handleLogout();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete account. Please verify your password.");
    } finally {
      setDeletingAccount(false);
    }
  };

  const triggerResumeUploaderRedirect = () => {
    localStorage.setItem("preselectPersonalized", "true");
    navigate("/");
  };

  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) return "0m";
    const minutes = Math.round(seconds / 60);
    return `${minutes}m`;
  };

  // Center-aligned loading layout
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col font-sans text-zinc-100 justify-between">
        <Navbar user={null} theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />
        <div className="flex-grow flex flex-col items-center justify-center space-y-4">
          <div className="h-9 w-9 animate-spin rounded-full border-[3px] border-primary border-t-transparent" />
          <p className="text-sm font-medium text-zinc-400">Loading user profile and statistics...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // Safety guard check for failed database/API profile loads
  if (!userProfile || !stats) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col font-sans text-zinc-100 justify-between">
        <Navbar user={null} theme={theme} toggleTheme={toggleTheme} onLogout={handleLogout} />
        <div className="flex-grow flex flex-col items-center justify-center space-y-4 px-6 text-center animate-in fade-in duration-200">
          <div className="p-3.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 mb-2">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">Failed to Load Profile</h2>
          <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
            There was an error communicating with the authentication and statistics service. Please ensure the backend is running and try again.
          </p>
          <Button
            onClick={() => window.location.reload()}
            variant="primary"
            size="sm"
            className="mt-4 rounded-lg text-xs"
          >
            Retry Loading
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans text-zinc-100 bg-grid-subtle">
      <Navbar
        user={userProfile}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      <main className="flex-grow max-w-7xl w-full mx-auto px-6 sm:px-8 py-10">
        
        {/* Back to Home Button */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors group select-none"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform text-zinc-400 group-hover:text-white" />
            <span className="text-zinc-400 group-hover:text-white">Back to Home</span>
          </Link>
        </div>

        {/* Profile Header */}
        <section className="bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6 md:p-8 mb-8 backdrop-blur-sm select-none animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              {userProfile.avatarUrl ? (
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="h-20 w-20 md:h-24 md:w-24 rounded-full border border-primary/25 object-cover shadow-lg shadow-primary/5"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/25 text-primary text-3xl font-bold font-mono shadow-lg shadow-primary/5">
                  {getInitials(userProfile.name)}
                </div>
              )}
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">{userProfile.name}</h1>
                <p className="text-zinc-400 text-sm mt-1">{userProfile.email}</p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900/40 border border-zinc-850 px-3 py-1.5 rounded-lg select-none">
                    <CalendarDays size={13} className="text-primary/70" />
                    <span>Account created: {new Date(userProfile.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 bg-zinc-900/40 border border-zinc-850 px-3 py-1.5 rounded-lg select-none">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">Auth:</span>
                    <span className="text-white font-semibold text-xs uppercase">{userProfile.provider === "google" ? "Google OAuth" : "Email / Password"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Header stats */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-2 md:mt-0">
              <div className="bg-zinc-900/50 border border-zinc-850 px-4 py-2.5 rounded-xl text-center shadow-inner">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">Interviews</span>
                <span className="text-base font-bold text-white mt-0.5 block">{stats.totalInterviews}</span>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-850 px-4 py-2.5 rounded-xl text-center shadow-inner">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">Average</span>
                <span className="text-base font-bold text-teal-400 mt-0.5 block">{stats.averageScore}/10</span>
              </div>
              <div className="bg-zinc-900/50 border border-zinc-850 px-4 py-2.5 rounded-xl text-center max-w-[140px] truncate shadow-inner">
                <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold block">Fav Role</span>
                <span className="text-base font-bold text-white mt-0.5 block truncate" title={stats.favoriteRole}>
                  {stats.favoriteRole}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Stats Dashboard */}
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Performance Overview</h3>
            <div className="grid grid-cols-1 gap-4">
              
              <Card hover={false} className="p-4 bg-zinc-900/20 select-none">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 block">Completed Drills</span>
                    <h4 className="text-xl font-bold text-white mt-1">{stats.totalInterviews} Mock Sessions</h4>
                    <span className="text-[9px] text-zinc-500 mt-1 block">
                      {stats.resumeCount} Resume personalized • {stats.quickCount} Quick runs
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-teal-500/10 border border-teal-500/20 text-primary">
                    <CheckCircle2 size={16} />
                  </div>
                </div>
              </Card>

              <Card hover={false} className="p-4 bg-zinc-900/20 select-none">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 block">Questions Answered</span>
                    <h4 className="text-xl font-bold text-white mt-1">{stats.totalQuestions} Questions</h4>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <FileCode size={16} />
                  </div>
                </div>
              </Card>

              <Card hover={false} className="p-4 bg-zinc-900/20 select-none">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 block">Average Rating</span>
                    <h4 className="text-xl font-bold text-white mt-1">{stats.averageScore} / 10</h4>
                  </div>
                  <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                    <Activity size={16} />
                  </div>
                </div>
              </Card>

              <Card hover={false} className="p-4 bg-zinc-900/20 select-none">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 block">Peak Score</span>
                    <h4 className="text-xl font-bold text-white mt-1">{stats.bestScore} / 10</h4>
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <Award size={16} />
                  </div>
                </div>
              </Card>

              <Card hover={false} className="p-4 bg-zinc-900/20 select-none">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-500 block">Average Duration</span>
                    <h4 className="text-xl font-bold text-white mt-1">~{formatDuration(stats.averageDuration)}</h4>
                  </div>
                  <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400">
                    <Clock size={16} />
                  </div>
                </div>
              </Card>

            </div>
          </div>

          {/* RIGHT COLUMN: Actions & Settings */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <button
                  onClick={() => navigate("/history")}
                  className="group bg-zinc-900/20 border border-zinc-850 p-5 rounded-xl hover:border-zinc-750 transition-all text-left flex flex-col justify-between h-32 select-none cursor-pointer"
                >
                  <History size={18} className="text-primary group-hover:scale-110 transition-transform" />
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">View Evaluation History</h4>
                      <ChevronRight size={13} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-normal">Access grading history, review questions and scores.</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate("/")}
                  className="group bg-zinc-900/20 border border-zinc-850 p-5 rounded-xl hover:border-zinc-750 transition-all text-left flex flex-col justify-between h-32 select-none cursor-pointer"
                >
                  <Play size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">Drill New Mock Interview</h4>
                      <ChevronRight size={13} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-normal">Set parameters and initialize a simulated panel session.</p>
                  </div>
                </button>

                <button
                  onClick={triggerResumeUploaderRedirect}
                  className="group bg-zinc-900/20 border border-zinc-850 p-5 rounded-xl hover:border-zinc-750 transition-all text-left flex flex-col justify-between h-32 select-none cursor-pointer"
                >
                  <Upload size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">Upload / Swap Resume</h4>
                      <ChevronRight size={13} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-normal">Configure personalized interviews matching your career profile.</p>
                  </div>
                </button>

                <button
                  onClick={downloadLatestReport}
                  disabled={downloadingReport || stats.totalInterviews === 0}
                  className="group bg-zinc-900/20 border border-zinc-850 p-5 rounded-xl hover:border-zinc-750 transition-all text-left flex flex-col justify-between h-32 select-none cursor-pointer disabled:opacity-40 disabled:pointer-events-none"
                >
                  <FileText size={18} className="text-purple-400 group-hover:scale-110 transition-transform" />
                  <div className="w-full">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white">
                        {downloadingReport ? "Generating PDF..." : "Download Latest Report"}
                      </h4>
                      <ChevronRight size={13} className="text-zinc-500 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-1 leading-normal">
                      {stats.totalInterviews === 0 
                        ? "No completed interviews available." 
                        : "Generate offline review PDF detailing questions and ratings."}
                    </p>
                  </div>
                </button>

              </div>
            </div>

            {/* Workspace Theme Settings */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Theme & Integrations</h3>
              <Card hover={false} className="p-6 bg-zinc-900/20 space-y-6">
                
                {/* Theme Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="text-xs font-bold text-white">Color Theme</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5 leading-normal">Toggle light or dark styling templates.</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { if(theme !== "dark") toggleTheme(); }}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        theme === "dark" 
                          ? "bg-primary/10 border-primary/30 text-primary shadow-sm" 
                          : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      Dark Theme
                    </button>
                    <button
                      onClick={() => { if(theme !== "light") toggleTheme(); }}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        theme === "light" 
                          ? "bg-zinc-800 border-zinc-700 text-zinc-100" 
                          : "bg-zinc-950 border-zinc-850 text-zinc-400 hover:border-zinc-700"
                      }`}
                    >
                      Light Theme
                    </button>
                  </div>
                </div>

                <div className="h-[1px] bg-zinc-850/80" />

                {/* Connected OAuth Accounts */}
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">OAuth Connected Profile</h4>
                    <p className="text-[10px] text-zinc-500 mt-0.5 leading-normal">Configure Google account authentication integrations.</p>
                  </div>
                  {userProfile.provider === "google" ? (
                    <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 rounded-xl text-xs text-emerald-400 select-none">
                      <GoogleIcon size={14} />
                      <span className="font-semibold">Connected ({userProfile.email})</span>
                    </div>
                  ) : (
                    <button
                      disabled
                      className="flex items-center gap-2 bg-zinc-950 border border-zinc-850 px-3.5 py-2 rounded-xl text-xs text-zinc-400 select-none opacity-50 cursor-not-allowed"
                      title="Google OAuth linking is coming soon for credentials accounts."
                    >
                      <GoogleIcon size={14} />
                      <span>Not Connected (Coming Soon)</span>
                    </button>
                  )}
                </div>

              </Card>
            </div>

            {/* Reset Password Form / OAuth Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Security & Access</h3>
              
              {userProfile.provider === "google" ? (
                <Card hover={false} className="p-6 bg-zinc-900/10 border border-zinc-850">
                  <div className="flex items-start gap-3">
                    <Info size={16} className="text-primary mt-0.5 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Google OAuth Login Active</h4>
                      <p className="text-[11px] text-zinc-400 leading-relaxed mt-1">
                        This account uses Google Sign-In. Password changes are managed through your Google Account.
                      </p>
                    </div>
                  </div>
                </Card>
              ) : (
                <Card hover={false} className="p-6 bg-zinc-900/20">
                  <div className="flex items-center gap-2 mb-4">
                    <KeyRound size={15} className="text-primary/80" />
                    <h4 className="text-xs font-bold text-white">Reset Account Password</h4>
                  </div>
                  <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-zinc-500 font-bold mb-1.5">Current Password</label>
                        <input
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-850 px-3 py-2 text-xs text-zinc-200 rounded-lg focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-zinc-500 font-bold mb-1.5">New Password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-850 px-3 py-2 text-xs text-zinc-200 rounded-lg focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none"
                          placeholder="••••••••"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-wider text-zinc-500 font-bold mb-1.5">Confirm Password</label>
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-850 px-3 py-2 text-xs text-zinc-200 rounded-lg focus:border-primary/50 focus:ring-1 focus:ring-primary/20 outline-none"
                          placeholder="••••••••"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <Button
                        type="submit"
                        variant="secondary"
                        size="sm"
                        disabled={updatingPassword}
                        className="rounded-lg text-xs"
                      >
                        {updatingPassword ? "Updating..." : "Update Password"}
                      </Button>
                    </div>
                  </form>
                </Card>
              )}
            </div>

            {/* Account Deletion */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest pl-1">Danger Control</h3>
              <Card hover={false} className="p-6 bg-red-950/5 border border-red-950/20">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert size={15} className="text-red-400" />
                  <h4 className="text-xs font-bold text-red-400">Permanently Delete Workspace</h4>
                </div>
                <p className="text-[10px] text-zinc-500 leading-normal">
                  Permanently delete your profile workspace and all associated session logs. This action cannot be undone.
                </p>
                
                <div className="mt-4">
                  {!showDeleteConfirm ? (
                    <Button
                      onClick={() => setShowDeleteConfirm(true)}
                      variant="danger"
                      size="sm"
                      className="rounded-lg text-xs"
                    >
                      Delete Account...
                    </Button>
                  ) : (
                    <div className="bg-zinc-950/50 border border-zinc-850 p-4 rounded-xl space-y-4 animate-in fade-in duration-200">
                      <div className="flex gap-2 text-zinc-400 text-[10px] leading-relaxed">
                        <Info size={14} className="text-amber-500 shrink-0 mt-0.5" />
                        <div className="space-y-1">
                          <p>All stored data, sessions, grades, and PDFs will be wiped.</p>
                          <p>To confirm deletion, type <strong className="text-white">delete my account</strong> below.</p>
                        </div>
                      </div>
                      
                      {userProfile.provider === "local" && (
                        <div className="space-y-1.5">
                          <label className="block text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Confirm Account Password</label>
                          <input
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-850 px-3 py-2 text-xs text-zinc-200 rounded-lg focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 outline-none"
                            placeholder="Current password"
                          />
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <label className="block text-[9px] uppercase tracking-wider text-zinc-500 font-bold">Verification Phrase</label>
                        <input
                          type="text"
                          value={deleteConfirmText}
                          onChange={(e) => setDeleteConfirmText(e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-850 px-3 py-2 text-xs text-zinc-200 rounded-lg focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20 outline-none placeholder:text-zinc-700"
                          placeholder="delete my account"
                        />
                      </div>

                      <div className="flex justify-end gap-2 text-xs">
                        <button
                          onClick={() => {
                            setShowDeleteConfirm(false);
                            setDeleteConfirmText("");
                            setDeletePassword("");
                          }}
                          disabled={deletingAccount}
                          className="px-3.5 h-9 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                        <Button
                          onClick={handleDeleteAccountConfirm}
                          variant="danger"
                          size="sm"
                          disabled={
                            deletingAccount || 
                            deleteConfirmText.toLowerCase() !== "delete my account" ||
                            (userProfile.provider === "local" && !deletePassword)
                          }
                          className="rounded-lg text-xs"
                        >
                          {deletingAccount ? "Deleting..." : "Permanently Delete Profile"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
