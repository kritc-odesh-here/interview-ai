import { useState } from "react";
import { useNavigate } from "react-router-dom";

const roles = [
  { title: "Full Stack Developer", icon: "💻" },
  { title: "Frontend Developer", icon: "🎨" },
  { title: "Backend Developer", icon: "⚙️" },
  { title: "Data Scientist", icon: "📊" },
  { title: "DevOps Engineer", icon: "🚀" },
  { title: "Product Manager", icon: "📋" },
  { title: "UI/UX Designer", icon: "✏️" },
  { title: "Machine Learning Engineer", icon: "🤖" },
];

const tips = [
  "⭐ Use the STAR method (Situation, Task, Action, Result) for behavioral questions.",
  "💡 Research the company before your interview — know their product and mission.",
  "🎯 Be specific in your answers — vague answers get low scores.",
  "⏱️ Practice answering within 2 minutes — concise answers impress interviewers.",
  "🤝 Always ask questions at the end of your interview — it shows genuine interest.",
  "📚 Review data structures and algorithms even for non-coding roles.",
  "💪 Confidence matters — speak clearly and maintain eye contact.",
  "🔁 Practice the same question multiple times — repetition builds confidence.",
  "📝 Prepare 3 strong examples from past experience before any interview.",
  "🚀 Show enthusiasm — interviewers hire people who genuinely want the role.",
];

function Home({ toggleTheme, theme }) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [customRole, setCustomRole] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(5);
  const todayTip = tips[new Date().getDate() % tips.length];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const startInterview = (role) => {
    localStorage.setItem("selectedRole", role);
    localStorage.setItem("difficulty", difficulty);
    localStorage.setItem("questionCount", questionCount);
    navigate("/interview");
  };

  const handleCustomRole = () => {
    if (!customRole.trim()) return;
    startInterview(customRole.trim());
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <h2 style={styles.logo}>🎯 InterviewAI</h2>
        <div style={styles.navRight}>
          <span style={styles.navName}>Hi, {user?.name} 👋</span>
          <button style={styles.themeBtn} onClick={toggleTheme}>
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
          <button
            style={styles.historyBtn}
            onClick={() => navigate("/history")}
          >
            History
          </button>
          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Ace Your Next Interview 🔥</h1>
        <p style={styles.heroSubtitle}>
          Pick a role below or type your own to get AI-powered questions with
          instant feedback
        </p>

        {/* Custom Role Input */}
        <div style={styles.customBox}>
          <input
            style={styles.customInput}
            type="text"
            placeholder="Or type any role... e.g. Android Developer"
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomRole()}
          />
          <button style={styles.customBtn} onClick={handleCustomRole}>
            Start →
          </button>
        </div>

        {/* Difficulty Selector */}
        <div style={styles.selectorBox}>
          <p style={styles.selectorLabel}>Select Difficulty</p>
          <div style={styles.selectorBtns}>
            {["Easy", "Medium", "Hard"].map((level) => (
              <button
                key={level}
                style={{
                  ...styles.selBtn,
                  background:
                    difficulty === level
                      ? level === "Easy"
                        ? "var(--success)"
                        : level === "Medium"
                          ? "var(--gradient-main)"
                          : "var(--danger)"
                      : "var(--bg-card)",
                  border: `1px solid var(--border-color)`,
                  color: "var(--text-primary)",
                }}
                onClick={() => setDifficulty(level)}
              >
                {level === "Easy"
                  ? "😊 Easy"
                  : level === "Medium"
                    ? "😤 Medium"
                    : "🔥 Hard"}
              </button>
            ))}
          </div>
        </div>

        {/* Question Count Selector */}
        <div style={styles.selectorBox}>
          <p style={styles.selectorLabel}>Number of Questions</p>
          <div style={styles.selectorBtns}>
            {[5, 10, 15].map((count) => (
              <button
                key={count}
                style={{
                  ...styles.selBtn,
                  background:
                    questionCount === count
                      ? "var(--gradient-main)"
                      : "var(--bg-card)",
                  border: `1px solid var(--border-color)`,
                  color: "var(--text-primary)",
                }}
                onClick={() => setQuestionCount(count)}
              >
                {count} Questions
              </button>
            ))}
          </div>
        </div>

        {/* Tip of the Day */}
        <div style={styles.tipBox}>
          <p style={styles.tipTitle}>💡 Tip of the Day</p>
          <p style={styles.tipText}>{todayTip}</p>
        </div>
      </div>

      {/* Role Cards */}
      <div style={styles.grid}>
        {roles.map((role) => (
          <div
            key={role.title}
            style={styles.card}
            onClick={() => startInterview(role.title)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.borderColor = "var(--accent-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = "var(--border-color)";
            }}
          >
            <div style={styles.cardIcon}>{role.icon}</div>
            <h3 style={styles.cardTitle}>{role.title}</h3>
            <p style={styles.cardSub}>5 AI Questions + Feedback</p>
            <button style={styles.startBtn}>Start Interview →</button>
          </div>
        ))}
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
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    borderBottom: "1px solid var(--border-color)",
    background: "var(--bg-card)",
    backdropFilter: "blur(10px)",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "700",
    background: "var(--gradient-main)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  navName: {
    color: "var(--text-secondary)",
    fontSize: "14px",
  },
  themeBtn: {
    padding: "8px 16px",
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    color: "var(--text-primary)",
    fontSize: "13px",
  },
  historyBtn: {
    padding: "8px 18px",
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "8px",
    color: "var(--text-primary)",
    fontSize: "14px",
  },
  logoutBtn: {
    padding: "8px 18px",
    background: "rgba(255,100,100,0.15)",
    border: "1px solid rgba(255,100,100,0.3)",
    borderRadius: "8px",
    color: "var(--danger)",
    fontSize: "14px",
  },
  hero: {
    textAlign: "center",
    padding: "60px 20px 40px",
  },
  heroTitle: {
    fontSize: "42px",
    fontWeight: "800",
    marginBottom: "16px",
    background: "var(--gradient-main)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    color: "var(--text-secondary)",
    fontSize: "16px",
    maxWidth: "500px",
    margin: "0 auto 24px",
  },
  customBox: {
    display: "flex",
    gap: "12px",
    maxWidth: "500px",
    margin: "0 auto 20px",
  },
  customInput: {
    flex: 1,
    padding: "14px 16px",
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "10px",
    color: "var(--text-primary)",
    fontSize: "15px",
  },
  customBtn: {
    padding: "14px 24px",
    background: "var(--gradient-main)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
  },
  selectorBox: {
    maxWidth: "500px",
    margin: "0 auto 20px",
    textAlign: "center",
  },
  selectorLabel: {
    color: "var(--text-muted)",
    fontSize: "13px",
    marginBottom: "10px",
  },
  selectorBtns: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  selBtn: {
    padding: "10px 24px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
  },
  tipBox: {
    maxWidth: "700px",
    margin: "20px auto 50px",
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "14px",
    padding: "20px 24px",
    textAlign: "center",
  },
  tipTitle: {
    color: "var(--accent-primary)",
    fontWeight: "700",
    fontSize: "14px",
    marginBottom: "8px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  tipText: {
    color: "var(--text-secondary)",
    fontSize: "15px",
    lineHeight: "1.6",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 30px",
  },
  card: {
    background: "var(--bg-card)",
    border: "1px solid var(--border-color)",
    borderRadius: "16px",
    padding: "30px",
    cursor: "pointer",
    transition: "transform 0.2s, border-color 0.2s",
    textAlign: "center",
  },
  cardIcon: {
    fontSize: "40px",
    marginBottom: "16px",
  },
  cardTitle: {
    fontSize: "16px",
    fontWeight: "700",
    marginBottom: "8px",
    color: "var(--text-primary)",
  },
  cardSub: {
    color: "var(--text-muted)",
    fontSize: "13px",
    marginBottom: "20px",
  },
  startBtn: {
    padding: "10px 20px",
    background: "var(--gradient-main)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
  },
};

export default Home;
