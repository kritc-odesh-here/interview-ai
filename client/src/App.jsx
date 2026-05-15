import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Interview from "./pages/Interview";
import History from "./pages/History";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

  useEffect(() => {
    document.body.className = theme === "light" ? "light" : "";
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
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
    </Routes>
  );
}

export default App;
