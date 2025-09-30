import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminUserCreate from "./pages/AdminUserCreate";
import Upload from "./pages/Upload";
import Search from "./pages/Search";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/admin" element={<AdminUserCreate />} />
      <Route path="/upload" element={<Upload />} />
      <Route path="/search" element={<Search />} />
    </Routes>
  );
}

export default App;
