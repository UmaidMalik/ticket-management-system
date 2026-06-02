import { apiGet, apiPatch } from "@/api/apiClient";
import type { User } from "@/types";

export type UserRole = "admin" | "editor" | "viewer";

export function getUsers(): Promise<User[]> {
  return apiGet<User[]>("/users");
}

export function updateUserRole(
  userId: number,
  role: UserRole
): Promise<{ user: User }> {
  return apiPatch<{ user: User }, { role: UserRole }>(
    `/users/${userId}/role`,
    { role }
  );
}