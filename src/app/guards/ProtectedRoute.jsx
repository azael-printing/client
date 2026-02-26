// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}
