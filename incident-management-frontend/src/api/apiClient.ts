import { logout } from "@/lib/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export function getApiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

export async function handleResponse<T>(response: Response): Promise<T> {
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