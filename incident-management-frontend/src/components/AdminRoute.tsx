import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser, isAuthenticated } from "@/lib/auth";

export default function AdminRoute() {
  const user = getStoredUser();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}