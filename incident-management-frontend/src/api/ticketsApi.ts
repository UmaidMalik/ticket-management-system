import type { Ticket } from "@/types";
import { apiGet, apiPost, apiPut, apiDelete } from "@/api/apiClient";

export type CreateTicketRequest = Omit<
  Ticket,
  "id" | "created_at" | "resolved_at"
>;

export type UpdateTicketRequest = Partial<
  Omit<Ticket, "id" | "created_at" | "resolved_at">
>;

export async function getTickets(): Promise<Ticket[]> {
  return apiGet<Ticket[]>("/tickets");
}

export async function getTicketById(id: number): Promise<Ticket> {
  return apiGet<Ticket>(`/tickets/${id}`);
}

export async function createTicket(data: CreateTicketRequest): Promise<Ticket> {
  return apiPost<Ticket, CreateTicketRequest>("/tickets", data);
}

export async function updateTicket(
  id: number,
  data: UpdateTicketRequest
): Promise<Ticket> {
  return apiPut<Ticket, UpdateTicketRequest>(`/tickets/${id}`, data);
}

export async function deleteTicket(id: number): Promise<{message: string}> {
  return apiDelete<{ message: string }>(`/tickets/${id}`);
}