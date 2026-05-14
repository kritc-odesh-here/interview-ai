import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Interview from "./pages/Interview";
import History from "./pages/History";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/" element={token ? <Home /> : <Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/interview"
        element={token ? <Interview /> : <Navigate to="/login" />}
      />
      <Route
        path="/history"
        element={token ? <History /> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
