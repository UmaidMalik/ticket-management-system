import { Navigate, Outlet } from "react-router-dom";
import { getStoredUser, isAuthenticated } from "@/lib/auth";

export default function EditorRoute() {
  const user = getStoredUser();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin" && user?.role !== "editor") {
    return <Navigate to="/incidents" replace />;
  }

  return <Outlet />;
}