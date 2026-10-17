import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../store/session";

export function ProtectedRoute() {
  const token = useSession((s) => s.token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}