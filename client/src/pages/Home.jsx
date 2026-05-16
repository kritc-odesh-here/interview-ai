import { useState, useEffect } from "react";
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

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const styles = {
    container: {
      minHeight: "100vh",
      background: "var(--gradient-bg)",
      paddingBottom: "60px",
    },
    navbar: {
      display: "flex",
      flexDirection: "column",
      padding: "16px 20px",
      borderBottom: "1px solid var(--border-color)",
      background: "var(--bg-card)",
      backdropFilter: "blur(10px)",
      gap: "10px",
    },
    navTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    navBottom: {
      display: "flex",
      justifyContent: "space-between",
    },
    logo: {
      fontSize: "20px",
      fontWeight: "700",
      background: "var(--gradient-main)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    navName: {
      color: "var(--text-secondary)",
      fontSize: "13px",
    },
    themeBtn: {
      padding: "6px 12px",
      background: "var(--bg-card)",
      border: "1px solid var(--border-color)",
      borderRadius: "8px",
      color: "var(--text-primary)",
      fontSize: "12px",
    },
    historyBtn: {
      padding: "6px 12px",
      background: "var(--bg-card)",
      border: "1px solid var(--border-color)",
      borderRadius: "8px",
      color: "var(--text-primary)",
      fontSize: "12px",
    },
    logoutBtn: {
      padding: "6px 12px",
      background: "rgba(255,100,100,0.15)",
      border: "1px solid rgba(255,100,100,0.3)",
      borderRadius: "8px",
      color: "var(--danger)",
      fontSize: "12px",
    },
    tipStrip: {
      textAlign: "center",
      padding: "12px 20px",
      color: "var(--text-muted)",
      fontSize: "13px",
      borderBottom: "1px solid var(--border-color)",
      fontStyle: "italic",
    },
    hero: {
      textAlign: "center",
      padding: isMobile ? "20px 16px 16px" : "40px 20px 30px",
    },
    heroTitle: {
      fontSize: isMobile ? "28px" : "42px",
      fontWeight: "800",
      marginBottom: "10px",
      background: "var(--gradient-main)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
    },
    heroSubtitle: {
      color: "var(--text-secondary)",
      fontSize: "14px",
      maxWidth: "500px",
      margin: "0 auto 20px",
    },
    customBox: {
      display: "flex",
      gap: "8px",
      maxWidth: "500px",
      margin: "0 auto 100px",
      padding: "0 4px",
    },
    customInput: {
      flex: 1,
      padding: "12px 14px",
      background: "var(--bg-card)",
      border: "1px solid var(--border-color)",
      borderRadius: "10px",
      color: "var(--text-primary)",
      fontSize: "14px",
    },
    customBtn: {
      padding: "12px 20px",
      background: "var(--gradient-main)",
      border: "none",
      borderRadius: "10px",
      color: "#fff",
      fontSize: "14px",
      fontWeight: "600",
    },
    optionsRow: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "16px",
      maxWidth: "600px",
      margin: isMobile ? "0 auto 20px" : "0 auto 24px",
      padding: "0 16px",
    },
    optionGroup: {
      textAlign: "center",
    },
    selectorLabel: {
      color: "var(--text-muted)",
      fontSize: "11px",
      marginBottom: "8px",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    selectorBtns: {
      display: "flex",
      gap: "6px",
    },
    selBtn: {
      padding: isMobile ? "10px 20px" : "8px 16px",
      borderRadius: "8px",
      fontSize: isMobile ? "14px" : "12px",
      fontWeight: "600",
      minWidth: isMobile ? "80px" : "auto",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)",
      gap: isMobile ? "12px" : "20px",
      maxWidth: "1100px",
      margin: "0 auto",
      padding: isMobile ? "0 16px" : "0 30px",
    },
    card: {
      background: "var(--bg-card)",
      border: "1px solid var(--border-color)",
      borderRadius: "14px",
      padding: isMobile ? "20px 12px" : "24px",
      cursor: "pointer",
      transition: "transform 0.2s, border-color 0.2s",
      textAlign: "center",
      minHeight: isMobile ? "160px" : "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    cardIcon: {
      fontSize: isMobile ? "28px" : "36px",
      marginBottom: "10px",
    },
    cardTitle: {
      fontSize: isMobile ? "13px" : "15px",
      fontWeight: "700",
      marginBottom: "6px",
      color: "var(--text-primary)",
    },
    cardSub: {
      color: "var(--text-muted)",
      fontSize: "11px",
      marginBottom: "12px",
    },
    startBtn: {
      padding: "7px 14px",
      background: "var(--gradient-main)",
      border: "none",
      borderRadius: "8px",
      color: "#fff",
      fontSize: "12px",
      fontWeight: "600",
    },
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navTop}>
          <h2 style={styles.logo}>🎯 InterviewAI</h2>
          <span style={styles.navName}>Hi, {user?.name} 👋</span>
        </div>
        <div style={styles.navBottom}>
          <button style={styles.themeBtn} onClick={toggleTheme}>
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>
          <div style={{ display: "flex", gap: "8px" }}>
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
      </div>

      {/* Tip of the day - clean, no box */}
      <div style={styles.tipStrip}>
        💡 <em>{todayTip}</em>
      </div>

      {/* Hero */}
      <div style={styles.hero}>
        <h1 style={styles.heroTitle}>Ace Your Next Interview 🔥</h1>
        <p style={styles.heroSubtitle}>
          Pick a role or type your own to get AI-powered questions with instant
          feedback
        </p>

        {/* Custom Role Input */}
        <div style={styles.customBox}>
          <input
            style={styles.customInput}
            type="text"
            placeholder={
              isMobile
                ? "Enter role..."
                : "Or type any role... e.g. Android Developer"
            }
            value={customRole}
            onChange={(e) => setCustomRole(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomRole()}
          />
          <button style={styles.customBtn} onClick={handleCustomRole}>
            Start →
          </button>
        </div>
      </div>

      {/* Difficulty + Question Count in one row */}
      <div style={styles.optionsRow}>
        <div style={styles.optionGroup}>
          <p style={styles.selectorLabel}>Difficulty</p>
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
                {level === "Easy" ? "😊" : level === "Medium" ? "😤" : "🔥"}{" "}
                {level}
              </button>
            ))}
          </div>
        </div>

        <div style={styles.optionGroup}>
          <p style={styles.selectorLabel}>Questions</p>
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
                {count}
              </button>
            ))}
          </div>
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
            <p style={styles.cardSub}>AI Questions + Feedback</p>
            <button style={styles.startBtn}>Start →</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
