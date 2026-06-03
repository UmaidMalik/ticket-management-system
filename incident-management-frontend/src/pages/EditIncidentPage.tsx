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
import { getStoredUser } from "@/lib/auth";
import AppHeader from "@/components/AppHeader";

export default function EditIncidentPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentUser = getStoredUser();
  const isClosedOrResolved = ticket?.status === "Closed";
  const canEditTicket = (currentUser?.role === "admin" || currentUser?.role === "editor") && !isClosedOrResolved;
  const canReopenTicket = (currentUser?.role === "admin" || currentUser?.role === "editor") && isClosedOrResolved;
  const canDeleteTicket = currentUser?.role === "admin";


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

    if (!canEditTicket) {
      setError("You do not have permission to edit tickets.");
      return;
    }

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

  async function handleReopen() {
    if (!ticket) return;

    setError(null);

    try {
      const updatedTicket = await updateTicket(ticket.id, {
        title: ticket.title,
        description: ticket.description,
        category: ticket.category,
        status: "Open",
        impact: ticket.impact,
        priority: ticket.priority,
        incident_reporter_id: ticket.incident_reporter_id,
        assigned_to_id: ticket.assigned_to_id,
      });

      setTicket(updatedTicket);
    } catch (error) {
      console.error(error);
      setError(
        error instanceof Error ? error.message : "Could not reopen incident."
      );
    }
  }

  async function handleDelete() {
    if (!ticket) return;

    if (!canDeleteTicket) {
      setError("Only admins can delete tickets.");
      return;
    }

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
      <div className="min-h-screen bg-muted/40">
        <AppHeader/>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <AppHeader/>
      <main className="min-h-screen bg-background">
        <section className="mx-auto max-w-3xl px-6 py-8">
          <Card>
            <CardHeader>
              <CardTitle>
                {canEditTicket 
                  ? `Edit Incident #${ticket.id}` 
                  : `Incident #${ticket.id}` 
                }
              </CardTitle>
              <CardDescription>
                {canEditTicket 
                  ? `View and update incident details, assignment, status, and priority.`
                  : `View incident details, assignment, status, and priority.`
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Title</label>
                  <Input name="title" defaultValue={ticket.title} disabled={!canEditTicket} />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Description</label>
                  <Textarea name="description" defaultValue={ticket.description} disabled={!canEditTicket} rows={5} />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <select
                      name="category"
                      defaultValue={ticket.category}
                      className="h-10 w-full rounded-md border bg-background px-3 text-sm"
                      disabled={!canEditTicket}
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
                      disabled={!canEditTicket}
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
                      disabled={!canEditTicket}
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
                      disabled={!canEditTicket}
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
                      disabled={!canEditTicket}
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
                      disabled={!canEditTicket}
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


                <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                  {canDeleteTicket && (
                      <Button
                        type="button"
                        variant="destructive"
                        onClick={handleDelete}
                        className="w-full sm:w-auto"
                      >
                        Delete Incident
                      </Button>
                  )}
                {canEditTicket ? (
                  <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button asChild variant="outline" className="w-full sm:w-auto">
                        <Link to="/incidents">Cancel</Link>
                      </Button>

                      <Button type="submit" className="w-full sm:w-auto">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 rounded-md border bg-muted/50 p-4 text-sm text-muted-foreground">
                    {isClosedOrResolved ? (
                      <>
                        <p>
                          This incident is {ticket.status.toLowerCase()} and is read-only.
                          Reopen it before making changes.
                        </p>

                        {canReopenTicket && (
                          <Button type="button" variant="outline" onClick={handleReopen}>
                            Reopen Incident
                          </Button>
                        )}
                      </>
                    ) : (
                      <p>
                        You have viewer access. You can view incident details, but you cannot
                        edit this ticket.
                      </p>
                    )}
                  </div>
                )}
                </div>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}