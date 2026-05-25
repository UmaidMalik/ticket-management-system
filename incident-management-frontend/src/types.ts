export type TicketCategory = "Network" | "Hardware" | "Software" | "Security"
export type TicketLevel = "Low" | "Medium" | "High" | "Critical";
export type TicketStatus = "Open" | "In Progress" | "Resolved" | "Closed";

export interface User {
    id: number;
    name: string;
}

export interface Ticket {
    id: number;
    title: string;
    description: string;
    category: TicketCategory;
    impact: TicketLevel;
    priority: TicketLevel;
    status: TicketStatus;
    incident_reporter_id: number;
    assigned_to_id: number | null;
    created_at: string;
    resolved_at: string | null;
}