import { Link, useParams } from "react-router-dom";
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
import { getUsers } from "@/api/usersApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTicketById, updateTicket, deleteTicket } from "@/api/ticketsApi";
import type { Ticket, User } from "@/types";

export default function EditIncidentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  async function loadData() {
    try {
      setIsLoading(true);

      const [ticketData, userData] = await Promise.all([
        getTicketById(Number(id)),
        getUsers(),
      ]);

      if (!ticketData) {
        setError("Ticket not found.");
        return;
      }

      setTicket(ticketData);
      setUsers(userData);
    } catch (error) {
      console.error(error);
      setError("Could not load incident.");
    } finally {
      setIsLoading(false);
    }
  }

  loadData();
}, [id]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!ticket) return;

    const formData = new FormData(event.currentTarget);

    await updateTicket(ticket.id, {
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

  async function handleDelete() {
    if (!ticket) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete incident #${ticket.id}? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await deleteTicket(ticket.id);
      navigate("/incidents");
    } catch (error) {
      console.error(error);
      alert("Could not delete incident.");
    }
  }

  if (isLoading) {
    return <main className="p-6">Loading incident...</main>;
  }

  if (error) {
    return (
      <main className="p-6">
        <p className="text-destructive">{error}</p>
      </main>
    );
  }
  
  if (!ticket) {
    return (
      <main className="min-h-screen bg-background p-6">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Incident Not Found</CardTitle>
            <CardDescription>
              The incident you are trying to edit does not exist.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Button asChild>
              <Link to="/incidents">Back to Incidents</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/dashboard" className="text-2xl font-bold text-slate-800">
            IncidentFlow
          </Link>

          <Button asChild variant="outline">
            <Link to="/incidents">Back to Incidents</Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Edit Incident #{ticket.id}</CardTitle>
            <CardDescription>
              View and update incident details, assignment, status, and priority.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input name="title" defaultValue={ticket.title} />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea name="description" defaultValue={ticket.description} rows={5} />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    name="category"
                    defaultValue={ticket.category}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    <option>Network</option>
                    <option>Hardware</option>
                    <option>Software</option>
                    <option>Security</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <select
                    name="status"
                    defaultValue={ticket.status}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  >
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
                  <select
                    name="impact"
                    defaultValue={ticket.impact}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Priority</label>
                  <select
                    name="priority"
                    defaultValue={ticket.priority}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  >
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
                  <select
                    name="incident_reporter_id"
                    defaultValue={ticket.incident_reporter_id}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Assigned To</label>
                  <select
                    name="assigned_to_id"
                    defaultValue={ticket.assigned_to_id ?? ""}
                    className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                  >
                    <option value="">Unassigned</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Created At</label>
                  <Input name="created at" value={ticket.created_at} disabled />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Resolved At</label>
                  <Input name="resolved at" value={ticket.resolved_at ?? "Not resolved"} disabled />
                </div>
              </div>

              <div className="flex justify-between gap-3 pt-4">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDelete}
                >
                  Delete Incident
                </Button>

                <div className="flex gap-3">
                  <Button asChild variant="outline">
                    <Link to="/incidents">Cancel</Link>
                  </Button>

                  <Button type="submit">Save Changes</Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}