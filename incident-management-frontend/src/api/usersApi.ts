import { mockUsers } from "@/data/mockUsers";
import type { User } from "@/types";

export async function getUsers(): Promise<User[]> {
  return mockUsers;
}

/*
import type { User } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function getUsers(): Promise<User[]> {
  const response = await fetch(`${API_BASE_URL}/users`);

  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }

  return response.json();
}
*/