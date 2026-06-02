import { describe, expect, it, vi, beforeEach } from "vitest";
import { getTickets } from "@/api/ticketsApi";

const mockTickets = [
  {
    id: 1,
    title: "Test ticket",
    description: "Test description",
    category: "Software",
    impact: "High",
    priority: "High",
    status: "Open",
    incident_reporter_id: 1,
    assigned_to_id: 2,
    created_at: "2026-05-26T10:00:00Z",
    resolved_at: null,
  },
];

describe("ticketsApi", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("fetches tickets from the backend", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({
        "content-type": "application/json",
      }),
      json: async () => mockTickets,
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await getTickets();

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:5000/tickets",
      expect.objectContaining({
        method: "GET",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      })
    );

    expect(result).toEqual(mockTickets);
  });
});