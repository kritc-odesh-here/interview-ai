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

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [customRole, setCustomRole] = useState("");
  const [difficulty, setDifficulty] = useState("Medium");
  const [questionCount, setQuestionCount] = useState(5);

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
      </div>

      {/* Difficulty Selector */}
      <div style={styles.difficultyBox}>
        <p style={styles.difficultyLabel}>Select Difficulty</p>
        <div style={styles.difficultyBtns}>
          {["Easy", "Medium", "Hard"].map((level) => (
            <button
              key={level}
              style={{
                ...styles.diffBtn,
                background:
                  difficulty === level
                    ? level === "Easy"
                      ? "#00c48c"
                      : level === "Medium"
                        ? "#667eea"
                        : "#ff6b6b"
                    : "rgba(255,255,255,0.08)",
                border:
                  difficulty === level
                    ? "none"
                    : "1px solid rgba(255,255,255,0.15)",
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
      <div style={styles.difficultyBox}>
        <p style={styles.difficultyLabel}>Number of Questions</p>
        <div style={styles.difficultyBtns}>
          {[5, 10, 15].map((count) => (
            <button
              key={count}
              style={{
                ...styles.diffBtn,
                background:
                  questionCount === count
                    ? "linear-gradient(90deg, #667eea, #764ba2)"
                    : "rgba(255,255,255,0.08)",
                border:
                  questionCount === count
                    ? "none"
                    : "1px solid rgba(255,255,255,0.15)",
              }}
              onClick={() => setQuestionCount(count)}
            >
              {count} Questions
            </button>
          ))}
        </div>
      </div>

      {/* Role Cards */}
      <div style={styles.grid}>
        {roles.map((role) => (
          <div
            key={role.title}
            style={styles.card}
            onClick={() => startInterview(role.title)}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
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
    background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)",
    paddingBottom: "60px",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    borderBottom: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "700",
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  navRight: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  navName: {
    color: "#aaa",
    fontSize: "14px",
  },
  historyBtn: {
    padding: "8px 18px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
  },
  logoutBtn: {
    padding: "8px 18px",
    background: "rgba(255,100,100,0.15)",
    border: "1px solid rgba(255,100,100,0.3)",
    borderRadius: "8px",
    color: "#ff6b6b",
    fontSize: "14px",
  },
  hero: {
    textAlign: "center",
    padding: "60px 20px 60px",
  },
  heroTitle: {
    fontSize: "42px",
    fontWeight: "800",
    marginBottom: "16px",
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  heroSubtitle: {
    color: "#888",
    fontSize: "16px",
    maxWidth: "500px",
    margin: "0 auto 24px",
  },
  customBox: {
    display: "flex",
    gap: "12px",
    maxWidth: "500px",
    margin: "0 auto",
  },
  customInput: {
    flex: 1,
    padding: "14px 16px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
  },
  customBtn: {
    padding: "14px 24px",
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
    fontWeight: "600",
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
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "30px",
    cursor: "pointer",
    transition: "transform 0.2s",
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
    color: "#fff",
  },
  cardSub: {
    color: "#666",
    fontSize: "13px",
    marginBottom: "20px",
  },
  startBtn: {
    padding: "10px 20px",
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
  },

  difficultyBox: {
    maxWidth: "500px",
    margin: "20px auto 0",
    textAlign: "center",
    marginBottom: "20px",
  },
  difficultyLabel: {
    color: "#888",
    fontSize: "13px",
    marginBottom: "10px",
  },
  difficultyBtns: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
  },
  diffBtn: {
    padding: "10px 24px",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "14px",
    fontWeight: "600",
  },
};

export default Home;
