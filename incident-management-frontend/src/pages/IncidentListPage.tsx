import { Eye, Filter, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useEffect, useState } from "react";
import { getTickets } from "@/api/ticketsApi";
import { getUsers } from "@/api/usersApi";
import { getUserNameById } from "@/lib/users";
import type { Ticket, TicketLevel, TicketStatus, User } from "@/types";

function getStatusBadgeVariant(status: TicketStatus) {
  if (status === "Open") return "default";
  if (status === "In Progress") return "secondary";
  if (status === "Resolved") return "outline";
  return "outline";
}

function getPriorityClass(priority: TicketLevel) {
  if (priority === "Critical") return "bg-red-500 text-white hover:bg-red-500";
  if (priority === "High") return "bg-orange-500 text-white hover:bg-orange-500";
  if (priority === "Medium") return "bg-yellow-500 text-black hover:bg-yellow-500";
  return "bg-blue-500 text-white hover:bg-blue-500";
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(dateString));
}

export default function IncidentListPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [priorityFilter, setPriorityFilter] = useState("All Priorities");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  useEffect(() => {
    async function loadData() {
      try {
        const [ticketData, userData] = await Promise.all([
          getTickets(),
          getUsers(),
        ]);

        const sortedTickets = [...ticketData].sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );

        setTickets(sortedTickets);
        setUsers(userData);
      } catch {
        setError("Could not load incidents.");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
  }, []);

  if (isLoading) {
    return <main className="p-6">Loading incidents...</main>;
  }

  if (error) {
    return <main className="p-6 text-red-500">{error}</main>;
  }

  const filteredTickets = tickets.filter((ticket) => {
    const assigneeName = getUserNameById(users, ticket.assigned_to_id);
    
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(ticket.id).includes(searchTerm) ||
      assigneeName.toLowerCase().includes(searchTerm);

    const matchesStatus =
      statusFilter === "All Statuses" || ticket.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All Priorities" || ticket.priority === priorityFilter;

    const matchesCategory =
      categoryFilter === "All Categories" || ticket.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <Link to="/dashboard" className="text-2xl font-bold text-slate-800">
            SRE Ticket Dashboard
          </Link>

        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Incident Management Dashboard
          </h1>

          <Button asChild>
            <Link to="/incidents/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Incident
            </Link>
          </Button>
        </div>

        <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-9"
              placeholder="Search by title, description, or ID..."
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            Filters:
          </div>

          <select 
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm">
            <option>All Statuses</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
            <option>Closed</option>
          </select>

          <select 
            value={priorityFilter}
            onChange={(event) => setPriorityFilter(event.target.value)}
            className="h-10 rounded-md border bg-background px-3 text-sm">
            <option>All Priorities</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)} 
            className="h-10 rounded-md border bg-background px-3 text-sm">
            <option>All Categories</option>
            <option>Network</option>
            <option>Hardware</option>
            <option>Software</option>
            <option>Security</option>
          </select>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Assignee</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium text-blue-600">
                      #{ticket.id}
                    </TableCell>

                    <TableCell className="font-medium">
                      {ticket.title}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {ticket.category}
                    </TableCell>

                    <TableCell>
                      <Badge className={getPriorityClass(ticket.priority)}>
                        {ticket.priority.toUpperCase()}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge className={getPriorityClass(ticket.impact)}>
                        {ticket.impact.toUpperCase()}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(ticket.status)}>
                        {ticket.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {formatDate(ticket.created_at)}
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      {getUserNameById(users, ticket.assigned_to_id)}
                    </TableCell>

                    <TableCell>
                      <Button asChild variant="ghost" size="sm">
                          <Link to={`/incidents/${ticket.id}/edit`}>
                            <Eye className="mr-1 h-4 w-4" />
                              View
                           </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}