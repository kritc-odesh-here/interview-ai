import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../utils/api";
import toast from "react-hot-toast";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      toast.success("Welcome back! 👋");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back 👋</h1>
        <p style={styles.subtitle}>Login to continue your interview prep</p>

        {error && <p style={styles.error}>{error}</p>}

        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <p style={styles.link}>
          Don't have an account?{" "}
          <Link to="/register" style={styles.linkText}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)",
  },
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "20px",
    padding: "40px",
    width: "100%",
    maxWidth: "420px",
    backdropFilter: "blur(10px)",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    marginBottom: "8px",
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    color: "#888",
    marginBottom: "30px",
    fontSize: "14px",
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    marginBottom: "16px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "15px",
  },
  button: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    border: "none",
    borderRadius: "10px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "20px",
    transition: "opacity 0.2s",
  },
  error: {
    color: "#ff6b6b",
    marginBottom: "16px",
    fontSize: "14px",
    background: "rgba(255,107,107,0.1)",
    padding: "10px",
    borderRadius: "8px",
  },
  link: {
    textAlign: "center",
    color: "#888",
    fontSize: "14px",
  },
  linkText: {
    color: "#667eea",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default Login;
