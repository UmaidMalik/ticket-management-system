import { apiDelete, apiGet, apiPatch, apiPost } from "@/api/apiClient";

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

export async function login(data: LoginRequest): Promise<AuthResponse> {
  return apiPost<AuthResponse, LoginRequest>("/auth/login", data);
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  return apiPost<AuthResponse, RegisterRequest>("/auth/register", data);
}

export async function getCurrentUser(): Promise<{ user: AuthUser }> {
  return apiGet<{ user: AuthUser }>("/auth/me");
}

export async function updateProfile(
  data: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  return apiPatch<UpdateProfileResponse, UpdateProfileRequest>(
    "/auth/me",
    data
  );
}

export async function changePassword(
  data: ChangePasswordRequest
): Promise<{ message: string }> {
  return apiPatch<{ message: string }, ChangePasswordRequest>(
    "/auth/me/password",
    data
  );
}

export async function deleteAccount(): Promise<{ message: string }> {
  return apiDelete<{ message: string }>("/auth/me");
}