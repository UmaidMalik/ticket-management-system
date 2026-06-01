import { getAuthHeaders } from "@/lib/auth";
import type { User } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}

export async function updateUserRole(
  userId: number,
  role: "admin" | "editor" | "viewer"
): Promise<{ user: User }> {
  const response = await fetch(`${API_BASE_URL}/users/${userId}/role`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ role }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to update user role");
  }

  return data;
}

/*
import { mockUsers } from "@/data/mockUsers";
import type { User } from "@/types";

export async function getUsers(): Promise<User[]> {
  return mockUsers;
}
*/