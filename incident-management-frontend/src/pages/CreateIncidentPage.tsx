import { Link, useNavigate } from "react-router-dom";
import { createTicket } from "@/api/ticketsApi";
import type { Ticket } from "@/types";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { mockUsers } from "@/data/mockUsers";

export default function CreateIncidentPage() {
  const navigate = useNavigate();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    await createTicket({
        title: String(formData.get("title")),
        description: String(formData.get("description")),
        category: formData.get("category") as Ticket["category"],
        status: formData.get("status") as Ticket["status"],
        impact: formData.get("impact") as Ticket["impact"],
        priority: formData.get("priority") as Ticket["priority"],
        incident_reporter_id: Number(formData.get("incident_reporter_id")),
        assigned_to_id: formData.get("assigned_to_id")
        ? Number(formData.get("assigned_to_id"))
        : null,
    });

    navigate("/incidents");
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/dashboard" className="text-2xl font-bold text-slate-800">
            SRE Ticket Dashboard
          </Link>

          <Button asChild variant="outline">
            <Link to="/incidents">Back to Incidents</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Incident</CardTitle>
            <CardDescription>
              Create a new incident ticket for tracking and resolution.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input name="title" placeholder="Short summary of the incident" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea name="description" placeholder="Full incident details..." rows={5} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select name="category" className="h-10 w-full rounded-md border bg-background px-3 text-sm">
                    <option>Network</option>
                    <option>Hardware</option>
                    <option>Software</option>
                    <option>Security</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select name="status" className="h-10 w-full rounded-md border bg-background px-3 text-sm">
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Resolved</option>
                    <option>Closed</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Impact</label>
                  <select name="impact" className="h-10 w-full rounded-md border bg-background px-3 text-sm">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <select name="priority" className="h-10 w-full rounded-md border bg-background px-3 text-sm">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Incident Reporter</label>
                  <select name="incident_reporter_id" className="h-10 w-full rounded-md border bg-background px-3 text-sm">
                    {mockUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Assigned To</label>
                  <select name="assigned_to_id" className="h-10 w-full rounded-md border bg-background px-3 text-sm">
                    <option value="">Unassigned</option>
                    {mockUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button asChild variant="outline">
                  <Link to="/incidents">Cancel</Link>
                </Button>

                <Button type="submit">Create Incident</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}