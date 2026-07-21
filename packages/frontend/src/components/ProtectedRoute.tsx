import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Role } from "@interdex/shared";
import { useAuthStore } from "@/store/authStore";

export function ProtectedRoute() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}

export function AdminRoute() {
  const user = useAuthStore((s) => s.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (user.role !== Role.ADMIN) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
