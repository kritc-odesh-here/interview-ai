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
import API from "../utils/api";

function History() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
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

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const getScoreColor = (score) => {
    if (score >= 7) return "#00c48c";
    if (score >= 5) return "#ffb347";
    return "#ff6b6b";
  };

  // Prepare chart data
  const chartData = [...sessions].reverse().map((session, index) => ({
    name: `#${index + 1} ${session.role.split(" ")[0]}`,
    score: session.overallScore,
    date: formatDate(session.createdAt),
  }));

  if (loading) {
    return (
      <div style={styles.centered}>
        <p style={{ color: "#888" }}>Loading history...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navTop}>
          <button style={styles.backBtn} onClick={() => navigate("/")}>
            ← Back
          </button>
          <h2 style={styles.title}>Interview History 📋</h2>
        </div>
      </div>

      <div style={styles.content}>
        {sessions.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={styles.emptyIcon}>🎯</p>
            <p style={styles.emptyText}>No interviews yet!</p>
            <button style={styles.startBtn} onClick={() => navigate("/")}>
              Start Your First Interview
            </button>
          </div>
        ) : (
          <>
            {/* Progress Chart */}
            {sessions.length > 1 ? (
              <div style={styles.chartBox}>
                <h3 style={styles.chartTitle}>📈 Your Progress</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={chartData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="rgba(255,255,255,0.05)"
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#666"
                      fontSize={12}
                      tick={{ fill: "#666" }}
                    />
                    <YAxis
                      domain={[0, 10]}
                      stroke="#666"
                      fontSize={12}
                      tick={{ fill: "#666" }}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#1a1a2e",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      formatter={(value) => [`${value}/10`, "Score"]}
                      labelFormatter={(label) => `Session: ${label}`}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#667eea"
                      strokeWidth={3}
                      dot={{ fill: "#764ba2", r: 6 }}
                      activeDot={{ r: 8, fill: "#667eea" }}
                    />
                  </LineChart>
                </ResponsiveContainer>

                {/* Stats Row */}
                <div style={styles.statsRow}>
                  <div style={styles.statBox}>
                    <p style={styles.statValue}>{sessions.length}</p>
                    <p style={styles.statLabel}>Total Sessions</p>
                  </div>
                  <div style={styles.statBox}>
                    <p style={styles.statValue}>
                      {Math.round(
                        sessions.reduce((sum, s) => sum + s.overallScore, 0) /
                          sessions.length,
                      )}
                      /10
                    </p>
                    <p style={styles.statLabel}>Average Score</p>
                  </div>
                  <div style={styles.statBox}>
                    <p style={styles.statValue}>
                      {Math.max(...sessions.map((s) => s.overallScore))}/10
                    </p>
                    <p style={styles.statLabel}>Best Score</p>
                  </div>
                  <div style={styles.statBox}>
                    <p style={styles.statValue}>
                      {sessions[0]?.overallScore}/10
                    </p>
                    <p style={styles.statLabel}>Latest Score</p>
                  </div>
                </div>
              </div>
            ) : (
              <div style={styles.noGraphBox}>
                <p style={styles.noGraphIcon}>📈</p>
                <p style={styles.noGraphText}>
                  Complete at least 2 interviews to see your progress graph!
                </p>
              </div>
            )}

            {/* Sessions List */}
            {sessions.map((session, index) => (
              <div key={session._id} style={styles.card}>
                <div
                  style={styles.cardHeader}
                  onClick={() => setExpanded(expanded === index ? null : index)}
                >
                  <div style={styles.cardLeft}>
                    <span style={styles.roleText}>{session.role}</span>
                    <span style={styles.dateText}>
                      {formatDate(session.createdAt)}
                    </span>
                  </div>
                  <div style={styles.cardRight}>
                    <span
                      style={{
                        ...styles.scoreBadge,
                        background: getScoreColor(session.overallScore),
                      }}
                    >
                      {session.overallScore}/10
                    </span>
                    <span style={styles.arrow}>
                      {expanded === index ? "▲" : "▼"}
                    </span>
                  </div>
                </div>

                {expanded === index && (
                  <div style={styles.questionsBox}>
                    {session.questions.map((q, i) => (
                      <div key={i} style={styles.questionItem}>
                        <p style={styles.questionLabel}>
                          Q{i + 1}: {q.question}
                        </p>
                        <p style={styles.answerText}>📝 {q.answer}</p>
                        <p style={styles.feedbackText}>💬 {q.feedback}</p>
                        <span
                          style={{
                            ...styles.miniScore,
                            background: getScoreColor(q.score),
                          }}
                        >
                          Score: {q.score}/10
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "var(--gradient-bg)",
    paddingBottom: "60px",
  },
  centered: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "var(--gradient-bg)",
  },
  navbar: {
    display: "flex",
    flexDirection: "column",
    padding: "16px 20px",
    borderBottom: "1px solid var(--border-color)",
    background: "var(--bg-card)",
    gap: "10px",
  },
  navTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    padding: "8px 16px",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    color: "var(--text-primary)",
    fontSize: "14px",
  },
  title: {
    color: "var(--text-primary)",
    fontSize: "20px",
    fontWeight: "700",
  },
  content: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "0 16px",
  },
  emptyBox: {
    textAlign: "center",
    padding: "80px 20px",
  },
  emptyIcon: {
    fontSize: "60px",
    marginBottom: "16px",
  },
  emptyText: {
    color: "#888",
    fontSize: "18px",
    marginBottom: "24px",
  },
  startBtn: {
    padding: "12px 28px",
    background: "var(--gradient-main)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
  },
  chartBox: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "16px",
    marginBottom: "20px",
  },
  chartTitle: {
    color: "var(--text-primary)",
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "20px",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "12px",
    marginTop: "24px",
  },
  statBox: {
    textAlign: "center",
    background: "var(--bg-secondary)",
    borderRadius: "12px",
    padding: "16px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "800",
    background: "var(--gradient-main)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "4px",
  },
  statLabel: {
    color: "var(--text-muted)",
    fontSize: "12px",
  },
  card: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    marginBottom: "16px",
    overflow: "hidden",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 24px",
    cursor: "pointer",
  },
  cardLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  roleText: {
    color: "var(--text-primary)",
    fontWeight: "600",
    fontSize: "16px",
  },
  dateText: {
    color: "var(--text-muted)",
    fontSize: "13px",
  },
  cardRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  scoreBadge: {
    padding: "6px 14px",
    borderRadius: "20px",
    color: "#fff",
    fontWeight: "700",
    fontSize: "14px",
  },
  arrow: {
    color: "var(--text-muted)",
    fontSize: "12px",
  },
  questionsBox: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    padding: "20px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  questionItem: {
    background: "var(--bg-secondary)",
    borderLeft: "3px solid var(--accent-primary)",
    borderRadius: "12px",
    padding: "16px",
  },
  questionLabel: {
    color: "var(--text-primary)",
    fontWeight: "600",
    marginBottom: "8px",
    fontSize: "14px",
  },
  answerText: {
    color: "var(--text-secondary)",
    fontSize: "13px",
    marginBottom: "8px",
    lineHeight: "1.5",
  },
  feedbackText: {
    color: "var(--text-muted)",
    fontSize: "13px",
    marginBottom: "10px",
    lineHeight: "1.5",
  },
  miniScore: {
    padding: "4px 10px",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "12px",
    fontWeight: "600",
  },
  noGraphBox: {
    textAlign: "center",
    padding: "30px",
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    marginBottom: "20px",
  },
  noGraphIcon: {
    fontSize: "40px",
    marginBottom: "12px",
  },
  noGraphText: {
    color: "var(--text-muted)",
    fontSize: "14px",
  },
};

export default History;
