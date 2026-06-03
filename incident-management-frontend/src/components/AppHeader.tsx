import { Link, NavLink, useNavigate } from "react-router-dom";

import { getStoredUser, logout } from "@/lib/auth";
import { Button } from "@/components/ui/button";

export default function AppHeader() {
  const navigate = useNavigate();
  const user = getStoredUser();

  const isAdmin = user?.role === "admin";

  function handleLogout() {
    logout();
    navigate("/login", { replace: true });
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-muted text-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground",
    ].join(" ");

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <Link to="/dashboard" className="block">
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              Incident Management Dashboard
            </h1>
          </Link>

          {user && (
            <p className="text-sm text-muted-foreground">
              Signed in as {user.name} · {user.role}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <nav className="flex flex-col gap-1 sm:flex-row sm:items-center">
            <NavLink to="/dashboard" className={linkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/incidents" className={linkClass}>
              Incidents
            </NavLink>

            <NavLink to="/account" className={linkClass}>
              Account
            </NavLink>

            {isAdmin && (
              <NavLink to="/admin/users" className={linkClass}>
                User Management
              </NavLink>
            )}
          </nav>

          <Button
            type="button"
            variant="outline"
            onClick={handleLogout}
            className="w-full sm:w-auto"
          >
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}