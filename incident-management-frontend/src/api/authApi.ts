import { logout } from "@/lib/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
};

export type AuthResponse = {
  token: string;
  user: AuthUser;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type UpdateProfileRequest = {
  name: string;
  email: string;
};

export type UpdateProfileResponse = {
  token: string;
  user: AuthUser;
};

export type ChangePasswordRequest = {
  current_password: string;
  new_password: string;
};

async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type") ?? "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Expected JSON but received ${contentType || "unknown content type"}`
    );
  }

  const data = await response.json();

  if (response.status === 401) {
    logout();

    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }

    throw new Error(data.error || "Session expired. Please log in again.");
  }

  if (!response.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<AuthResponse>(response);
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return handleResponse<AuthResponse>(response);
}

export async function getCurrentUser(): Promise<{ user: AuthUser }> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<{ user: AuthUser }>(response);
}

export async function updateProfile(
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<UpdateProfileResponse>(response);
}

export async function changePassword(
  data: ChangePasswordRequest
): Promise<{ message: string }> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/auth/me/password`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return handleResponse<{ message: string }>(response);
}

export async function deleteAccount(): Promise<{ message: string }> {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return handleResponse<{ message: string }>(response);
}