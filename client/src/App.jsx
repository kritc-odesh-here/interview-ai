import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Interview from "./pages/Interview";
import History from "./pages/History";
import Profile from "./pages/Profile";

import API from "./utils/api";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.className = theme === "light" ? "light" : "";
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Sync profile details (including theme preference) on mount / token changes
  useEffect(() => {
    const fetchProfile = async () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const res = await API.get("/api/auth/me");
          if (res.data.theme) {
            setTheme(res.data.theme);
            localStorage.setItem("theme", res.data.theme);
          }
          localStorage.setItem("user", JSON.stringify(res.data));
        } catch (err) {
          console.error("Failed to sync fresh user profile:", err);
          if (err.response && err.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken(null);
          }
        }
      }
    };
    fetchProfile();
  }, [token]);

  const toggleTheme = async () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);

    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        await API.put("/api/auth/update-theme", { theme: nextTheme });
      } catch (err) {
        console.error("Failed to sync theme preference on server:", err);
      }
    }
  };

  const handleAuth = (newToken) => {
    setToken(newToken);
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          token ? (
            <Home toggleTheme={toggleTheme} theme={theme} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/login"
        element={
          <Login toggleTheme={toggleTheme} theme={theme} onAuth={handleAuth} />
        }
      />
      <Route
        path="/register"
        element={
          <Register
            toggleTheme={toggleTheme}
            theme={theme}
            onAuth={handleAuth}
          />
        }
      />
      <Route
        path="/interview"
        element={
          token ? (
            <Interview toggleTheme={toggleTheme} theme={theme} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/history"
        element={
          token ? (
            <History toggleTheme={toggleTheme} theme={theme} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/profile"
        element={
          token ? (
            <Profile toggleTheme={toggleTheme} theme={theme} />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  );
}

export default App;
