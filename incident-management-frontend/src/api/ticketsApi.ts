import { mockTickets } from "@/data/mockTickets";
import type { Ticket } from "@/types";

export type CreateTicketRequest = Omit<
  Ticket,
  "id" | "created_at" | "resolved_at"
>;

export type UpdateTicketRequest = Partial<
  Omit<Ticket, "id" | "created_at" | "resolved_at">
>;

let tickets = [...mockTickets];

export async function getTickets(): Promise<Ticket[]> {
  return tickets;
}

export async function getTicketById(id: number): Promise<Ticket | undefined> {
  return tickets.find((ticket) => ticket.id === id);
}

export async function createTicket(data: CreateTicketRequest): Promise<Ticket> {
  const newTicket: Ticket = {
    id: Math.max(...tickets.map((ticket) => ticket.id), 0) + 1,
    ...data,
    created_at: new Date().toISOString(),
    resolved_at:
      data.status === "Resolved" || data.status === "Closed"
        ? new Date().toISOString()
        : null,
  };

  tickets = [newTicket, ...tickets];

  return newTicket;
}

export async function updateTicket(
  id: number,
  data: UpdateTicketRequest
): Promise<Ticket | undefined> {
  const existingTicket = tickets.find((ticket) => ticket.id === id);

  if (!existingTicket) {
    return undefined;
  }

  const updatedTicket: Ticket = {
    ...existingTicket,
    ...data,
    resolved_at:
      data.status === "Resolved" || data.status === "Closed"
        ? existingTicket.resolved_at ?? new Date().toISOString()
        : data.status === "Open" || data.status === "In Progress"
          ? null
          : existingTicket.resolved_at,
  };

  tickets = tickets.map((ticket) =>
    ticket.id === id ? updatedTicket : ticket
  );

  return updatedTicket;
}