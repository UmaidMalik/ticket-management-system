import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  changePassword,
  deleteAccount,
  getCurrentUser,
  updateProfile,
  type AuthUser,
} from "@/api/authApi";
import { getStoredUser, logout, saveAuth } from "@/lib/auth";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AccountPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(getStoredUser());

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const response = await getCurrentUser();

        setUser(response.user);
        setName(response.user.name);
        setEmail(response.user.email);
      } catch (error) {
        console.error(error);
        logout();
        navigate("/login", { replace: true });
      }
    }

    loadCurrentUser();
  }, [navigate]);

  async function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setProfileMessage(null);
    setProfileError(null);
    setIsProfileSubmitting(true);

    try {
      const response = await updateProfile({ name, email });

      saveAuth(response.token, response.user);
      setUser(response.user);
      setProfileMessage("Profile updated successfully.");
    } catch (error) {
      console.error(error);
      setProfileError(
        error instanceof Error ? error.message : "Could not update profile."
      );
    } finally {
      setIsProfileSubmitting(false);
    }
  }

  async function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPasswordMessage(null);
    setPasswordError(null);
    setIsPasswordSubmitting(true);

    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setPasswordMessage("Password changed successfully.");
    } catch (error) {
      console.error(error);
      setPasswordError(
        error instanceof Error ? error.message : "Could not change password."
      );
    } finally {
      setIsPasswordSubmitting(false);
    }
  }

  async function handleDeleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This cannot be undone."
    );

    if (!confirmed) return;

    setDeleteError(null);
    setIsDeleting(true);

    try {
      await deleteAccount();
      logout();
      navigate("/register", { replace: true });
    } catch (error) {
      console.error(error);
      setDeleteError(
        error instanceof Error ? error.message : "Could not delete account."
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <main className="min-h-screen bg-muted/40 p-6">
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account</h1>
            <p className="text-muted-foreground">
              Manage your profile, password, and account settings.
            </p>
          </div>

        <div className="flex items-center gap-3">
          {user?.role === "admin" && (
            <Button variant="outline" asChild>
              <Link to="/admin/users">User Management</Link>
            </Button>
          )}

          <Button variant="outline" asChild>
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Update your name and email address.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              {profileMessage && (
                <div className="rounded-md border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-700">
                  {profileMessage}
                </div>
              )}

              {profileError && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {profileError}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Current role:{" "}
                  <span className="font-medium">{user?.role ?? "Unknown"}</span>
                </p>

                <Button type="submit" disabled={isProfileSubmitting}>
                  {isProfileSubmitting ? "Saving..." : "Save profile"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              Change your password using your current password.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              {passwordMessage && (
                <div className="rounded-md border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-700">
                  {passwordMessage}
                </div>
              )}

              {passwordError && (
                <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                  {passwordError}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">New password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  minLength={8}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 8 characters.
                </p>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isPasswordSubmitting}>
                  {isPasswordSubmitting
                    ? "Changing password..."
                    : "Change password"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-destructive/40">
          <CardHeader>
            <CardTitle>Delete account</CardTitle>
            <CardDescription>
              Delete your account if it is not linked to existing tickets.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {deleteError && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {deleteError}
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              Accounts linked to existing tickets cannot be deleted because the
              system preserves incident history.
            </p>

            <Button
              type="button"
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete account"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}