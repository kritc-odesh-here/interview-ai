import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Search,
  Calendar,
  Award,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Activity,
  Zap,
  BarChart3,
  CheckCircle,
  HelpCircle,
  FileText,
  MessageSquareCode,
} from "lucide-react";
import API from "../utils/api";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import PageHeader from "../components/common/PageHeader";
import EmptyState from "../components/common/EmptyState";
import Badge from "../components/ui/Badge";
import Card from "../components/ui/Card";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";

function History({ toggleTheme, theme }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const res = await API.get("/api/interview/sessions");
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getScoreVariant = (score) => {
    if (score >= 7) return "success";
    if (score >= 5) return "warning";
    return "danger";
  };

  // Filter sessions by search query
  const filteredSessions = sessions.filter((session) =>
    session.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Prepare chart data
  const chartData = [...sessions].reverse().map((session, index) => ({
    name: `#${index + 1} ${session.role.split(" ")[0]}`,
    score: session.overallScore,
    date: formatDate(session.createdAt),
  }));

  // Statistics
  const totalSessions = sessions.length;
  const averageScore = totalSessions
    ? Math.round(sessions.reduce((sum, s) => sum + s.overallScore, 0) / totalSessions)
    : 0;
  const bestScore = totalSessions ? Math.max(...sessions.map((s) => s.overallScore)) : 0;
  const latestScore = totalSessions ? sessions[0]?.overallScore : 0;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans select-none">
      <Navbar
        user={JSON.parse(localStorage.getItem("user"))}
        theme={theme}
        toggleTheme={toggleTheme}
        onLogout={handleLogout}
      />

      <main className="flex-grow max-w-5xl w-full mx-auto px-6 py-8">
        <PageHeader
          title="Interview History & Analytics"
          description="Track your performance, review feedback details, and measure progress."
          action={
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<ArrowLeft size={14} />}
              onClick={() => navigate("/")}
            >
              Back to Home
            </Button>
          }
        />

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-zinc-800 border-t-primary" />
            <p className="text-zinc-500 text-sm">Loading history data...</p>
          </div>
        ) : sessions.length === 0 ? (
          <EmptyState
            icon={Activity}
            title="No sessions recorded yet"
            description="Start practicing by picking a role or inputting a custom job description to begin your mock session."
            action={
              <Button
                variant="primary"
                onClick={() => navigate("/")}
                leftIcon={<Zap size={14} />}
              >
                Start First Mock Session
              </Button>
            }
          />
        ) : (
          <div className="space-y-8">
            {/* Top Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-5 border border-border-subtle bg-zinc-900/40" hover={false}>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Total Sessions
                </p>
                <h3 className="text-3xl font-extrabold text-white mt-1.5">{totalSessions}</h3>
                <p className="text-[10px] text-zinc-600 mt-1">Sessions completed</p>
              </Card>

              <Card className="p-5 border border-border-subtle bg-zinc-900/40" hover={false}>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Average Score
                </p>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <h3 className="text-3xl font-extrabold text-white">{averageScore}</h3>
                  <span className="text-sm font-semibold text-zinc-500">/10</span>
                </div>
                <p className="text-[10px] text-zinc-600 mt-1">Overall avg score</p>
              </Card>

              <Card className="p-5 border border-border-subtle bg-zinc-900/40" hover={false}>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Best Session
                </p>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <h3 className="text-3xl font-extrabold text-white">{bestScore}</h3>
                  <span className="text-sm font-semibold text-zinc-500">/10</span>
                </div>
                <p className="text-[10px] text-zinc-600 mt-1">Highest rating hit</p>
              </Card>

              <Card className="p-5 border border-border-subtle bg-zinc-900/40" hover={false}>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Latest Score
                </p>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <h3 className="text-3xl font-extrabold text-white">{latestScore}</h3>
                  <span className="text-sm font-semibold text-zinc-500">/10</span>
                </div>
                <p className="text-[10px] text-zinc-600 mt-1">Most recent mock</p>
              </Card>
            </div>

            {/* Performance Trend Graph */}
            {sessions.length > 1 && (
              <Card className="p-6 border border-border-subtle bg-zinc-900/20" hover={false}>
                <h3 className="text-sm font-bold tracking-tight text-white mb-6 flex items-center gap-2">
                  <BarChart3 size={16} className="text-primary" />
                  <span>Performance Over Time</span>
                </h3>
                <div className="w-full h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ left: -20, right: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                      <XAxis
                        dataKey="name"
                        stroke="#4b5563"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        domain={[0, 10]}
                        stroke="#4b5563"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        contentStyle={{
                          background: "#18181b",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "12px",
                          fontSize: "12px",
                          color: "#fafafa",
                        }}
                        formatter={(value) => [`${value}/10`, "Score"]}
                        labelFormatter={(label) => `Session: ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#14b8a6"
                        strokeWidth={2.5}
                        dot={{ fill: "#14b8a6", stroke: "#09090b", strokeWidth: 2, r: 5 }}
                        activeDot={{ r: 7, fill: "#14b8a6", stroke: "#fafafa" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            {/* Session Logs List */}
            <div className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold tracking-tight text-white">Mock Session Logs</h3>
                  <p className="text-xs text-zinc-500">Expand a card to view questions, responses, and AI evaluations.</p>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3.5 top-3 h-4 w-4 text-zinc-500" />
                  <Input
                    className="pl-10 py-2 h-9"
                    type="text"
                    placeholder="Search roles..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              {filteredSessions.length === 0 ? (
                <div className="text-center py-12 border border-border-subtle bg-zinc-900/10 rounded-2xl">
                  <p className="text-sm text-zinc-500">No session matched your search criteria.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredSessions.map((session, index) => {
                    const isExpanded = expanded === index;
                    return (
                      <div
                        key={session._id}
                        className="rounded-2xl border border-border-subtle bg-zinc-900/40 overflow-hidden transition-all duration-300"
                      >
                        {/* Collapsed Header Bar */}
                        <div
                          onClick={() => setExpanded(isExpanded ? null : index)}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 cursor-pointer hover:bg-zinc-900/80 transition-colors"
                        >
                          <div className="flex items-start gap-3 sm:gap-4">
                            <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-zinc-950 border border-zinc-850 text-zinc-400 shrink-0 mt-0.5">
                              <FileText size={18} />
                            </div>
                            <div>
                              <h4 className="text-sm sm:text-base font-semibold text-white tracking-tight leading-snug">
                                {session.role}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-zinc-500 mt-1">
                                <Calendar size={12} />
                                <span>{formatDate(session.createdAt)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t border-zinc-900/40 sm:border-t-0 pt-3 sm:pt-0 shrink-0">
                            <Badge variant={getScoreVariant(session.overallScore)}>
                              Score: {session.overallScore}/10
                            </Badge>
                            <div className="text-zinc-500 hover:text-zinc-300">
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </div>
                          </div>
                        </div>

                        {/* Expandable detailed content */}
                        {isExpanded && (
                          <div className="border-t border-border-subtle bg-zinc-950/40 p-6 space-y-6">
                            <h5 className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                              Evaluation Breakdown
                            </h5>

                            <div className="space-y-4">
                              {session.questions.map((q, i) => (
                                <div
                                  key={i}
                                  className="p-5 rounded-xl border border-border-subtle bg-zinc-900/20 space-y-3"
                                >
                                  <div className="flex items-center justify-between gap-3 flex-wrap">
                                    <span className="text-xs font-bold uppercase text-primary tracking-wider flex items-center gap-1.5">
                                      <HelpCircle size={13} />
                                      <span>Question {i + 1}</span>
                                    </span>
                                    <Badge variant={getScoreVariant(q.score)}>
                                      Score: {q.score}/10
                                    </Badge>
                                  </div>

                                  <p className="text-sm font-medium text-white leading-relaxed">
                                    {q.question}
                                  </p>

                                  <div className="space-y-2 border-t border-border-subtle pt-3 mt-3">
                                    <div className="text-xs">
                                      <span className="font-semibold text-zinc-400 block mb-1">
                                        Your Answer
                                      </span>
                                      <p className="text-zinc-300 bg-zinc-950/60 p-3 rounded-lg border border-border-subtle/40 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap">
                                        {q.answer}
                                      </p>
                                    </div>

                                    <div className="text-xs">
                                      <span className="font-semibold text-zinc-400 block mb-1">
                                        AI Feedback
                                      </span>
                                      <p className="text-zinc-400 leading-relaxed bg-zinc-900/10 p-3 rounded-lg border border-border-subtle/20">
                                        {q.feedback}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default History;
