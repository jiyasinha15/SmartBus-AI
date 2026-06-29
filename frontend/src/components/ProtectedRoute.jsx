import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const userRole = localStorage.getItem("userRole");

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}