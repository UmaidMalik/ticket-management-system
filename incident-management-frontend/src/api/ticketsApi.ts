import type { Ticket } from "@/types";
import { getAuthHeaders } from "@/lib/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export type CreateTicketRequest = Omit<
  Ticket,
  "id" | "created_at" | "resolved_at"
>;

export type UpdateTicketRequest = Partial<
  Omit<Ticket, "id" | "created_at" | "resolved_at">
>;

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = "Request failed";

    try {
      const errorBody = await response.json();
      message = errorBody.error || errorBody.message || message;
    } catch {
      
    }

    throw new Error(message);
  }

  return response.json();
}

export async function getTickets(): Promise<Ticket[]> {
  const response = await fetch(`${API_BASE_URL}/tickets`, {
    headers: getAuthHeaders(),
  });

  return handleResponse<Ticket[]>(response);
}

export async function getTicketById(id: number): Promise<Ticket> {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    headers: getAuthHeaders(),
  });
  return handleResponse<Ticket>(response);
}

export async function createTicket(data: CreateTicketRequest): Promise<Ticket> {
  const response = await fetch(`${API_BASE_URL}/tickets`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<Ticket>(response);
}

export async function updateTicket(
  id: number,
  data: UpdateTicketRequest
): Promise<Ticket> {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return handleResponse<Ticket>(response);
}

export async function deleteTicket(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    let message = "Failed to delete ticket";

    try {
      const errorBody = await response.json();
      message = errorBody.error || errorBody.message || message;
    } catch {

    }

    throw new Error(message);
  }
}