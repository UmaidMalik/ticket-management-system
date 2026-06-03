import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";

vi.mock("@/api/ticketsApi", () => ({
  getTickets: async () => [
    {
      id: 1,
      title: "Production API returning 500 errors",
      description: "Multiple users are reporting failed requests.",
      category: "Software",
      impact: "Critical",
      priority: "Critical",
      status: "Open",
      incident_reporter_id: 1,
      assigned_to_id: 3,
      assignee_name: "Karim",
      reporter_name: "Umaid",
      created_at: "Tue, 26 May 2026 14:26:06 GMT",
      resolved_at: null,
    },
  ],
}));

describe("Dashboard", () => {
  it("renders dashboard data from the API", async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    expect(screen.getByText(/Loading dashboard/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Incident Management Dashboard")).toBeInTheDocument();
      expect(
        screen.getByText("Production API returning 500 errors")
      ).toBeInTheDocument();
      expect(screen.getByText("Karim")).toBeInTheDocument();
    });
  });
});