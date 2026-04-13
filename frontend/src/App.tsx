import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "./pages/login";
import { Register } from "./pages/register";

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
}
