import type { AuthUser } from "@/api/authApi";

const TOKEN_KEY = "token";
const USER_KEY = "user";

export function saveAuth(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): AuthUser | null {
  const rawUser = localStorage.getItem(USER_KEY);

  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string) {
  try {
    const payloadBase64 = token.split(".")[1];
    const payload = JSON.parse(atob(payloadBase64));

    if (!payload.exp) return false;

    return Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
}

export function isAuthenticated() {
  const token = getToken();

  if (!token) return false;

  if (isTokenExpired(token)) {
    logout();
    return false;
  }

  return true;
}

export function logout() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAuthHeaders() {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}