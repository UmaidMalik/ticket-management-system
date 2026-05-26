import { beforeEach, describe, expect, it, vi } from "vitest";
import { getTickets } from "@/api/ticketsApi";

describe("ticketsApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("fetches tickets from the backend", async () => {
    const mockTickets = [
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
    ];

    const fetchMock = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockTickets,
    } as Response);

    vi.stubGlobal("fetch", fetchMock);

    const result = await getTickets();

    expect(fetchMock).toHaveBeenCalledWith("http://localhost:5000/tickets");
    expect(result).toEqual(mockTickets);
  });
});