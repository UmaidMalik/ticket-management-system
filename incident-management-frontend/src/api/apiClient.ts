import { getAuthHeaders, logout } from "@/lib/auth";

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

export async function apiGet<T>(path: string): Promise<T> {
  const response = await fetch(getApiUrl(path), {
    method: "GET",
    headers: getAuthHeaders(),
  });

  return handleResponse<T>(response);
}

export async function apiPost<T, TBody = unknown>(
  path: string,
  body: TBody
): Promise<T> {
  const response = await fetch(getApiUrl(path), {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);  
}

export async function apiPatch<T, TBody = unknown>(
  path: string,
  body: TBody
): Promise<T> {
  const response = await fetch(getApiUrl(path), {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

export async function apiPut<T, TBody = unknown>(
  path: string,
  body: TBody
): Promise<T> {
  const response = await fetch(getApiUrl(path), {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });

  return handleResponse<T>(response);
}

export async function apiDelete<T>(path: string): Promise<T> {
  const response = await fetch(getApiUrl(path), {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  return handleResponse<T>(response);
}