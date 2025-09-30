import { useState, useEffect } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import Upload from "./pages/Upload";
import Search from "./pages/Search";
import Login from "./pages/Login";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // Update localStorage whenever token changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // Protected Route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <div>
      {token && (
        <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
          <Link className="navbar-brand" to="/upload">
            Document Management
          </Link>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/upload">
                  Upload
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/search">
                  Search
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-link nav-link"
                  onClick={() => setToken("")}
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </nav>
      )}

      <Routes>
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={<Navigate to={token ? "/upload" : "/login"} replace />}
        />
      </Routes>
    </div>
  );
}
