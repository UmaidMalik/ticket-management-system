import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getUsers, updateUserRole } from "@/api/usersApi";
import { getStoredUser } from "@/lib/auth";
import type { User } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Role = "admin" | "editor" | "viewer";

export default function UserManagementPage() {
  const currentUser = getStoredUser();

  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUsers() {
      try {
        const userData = await getUsers();
        setUsers(userData);
      } catch (error) {
        console.error(error);
        setError(error instanceof Error ? error.message : "Could not load users.");
      } finally {
        setIsLoading(false);
      }
    }

    loadUsers();
  }, []);

  async function handleRoleChange(userId: number, role: Role) {
    setError(null);
    setMessage(null);

    try {
      const response = await updateUserRole(userId, role);

      setUsers((previousUsers) =>
        previousUsers.map((user) =>
          user.id === userId ? { ...user, role: response.user.role } : user
        )
      );

      setMessage("User role updated successfully.");
    } catch (error) {
      console.error(error);
      setError(error instanceof Error ? error.message : "Could not update role.");
    }
  }

  if (currentUser?.role !== "admin") {
    return (
      <main className="min-h-screen bg-muted/40 p-6">
        <div className="mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Access denied</CardTitle>
              <CardDescription>
                You need admin access to manage users.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/dashboard">Back to dashboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/40 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Manage user roles for the ticket management system.
            </p>
          </div>

          <Button variant="outline" asChild>
            <Link to="/account">Back to account</Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              Promote or demote users between viewer, editor, and admin roles.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {message && (
              <div className="rounded-md border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-700">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </div>
            )}

            {isLoading ? (
              <p className="text-sm text-muted-foreground">Loading users...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Current Role</TableHead>
                    <TableHead>Change Role</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>
                        <select
                          value={user.role}
                          onChange={(event) =>
                            handleRoleChange(user.id, event.target.value as Role)
                          }
                          disabled={user.id === currentUser.id}
                          className="h-10 rounded-md border bg-background px-3 text-sm"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>

                        {user.id === currentUser.id && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            You cannot change your own role.
                          </p>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}