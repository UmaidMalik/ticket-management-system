import { Link } from "react-router-dom";

import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Flame,
  TicketIcon,
  UserX,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { mockTickets } from "@/data/mockTickets";
import { mockUsers } from "@/data/mockUsers";
import { getUserNameById } from "@/lib/users";
import type { Ticket, TicketLevel, TicketStatus } from "@/types";

function getStatusBadgeVariant(status: TicketStatus) {
  if (status === "Open") return "destructive";
  if (status === "In Progress") return "secondary";
  if (status === "Resolved") return "outline";
  return "default";
}

function getPriorityBadgeVariant(priority: TicketLevel) {
  if (priority === "Critical") return "destructive";
  if (priority === "High") return "secondary";
  return "outline";
}

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("en-CA", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(dateString));
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: number;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl font-semibold">{value}</CardTitle>
        <CardAction>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const tickets: Ticket[] = mockTickets;

  const totalTickets = tickets.length;
  const openTickets = tickets.filter((t) => t.status === "Open").length;
  const inProgressTickets = tickets.filter(
    (t) => t.status === "In Progress"
  ).length;
  const criticalTickets = tickets.filter(
    (t) => t.priority === "Critical"
  ).length;
  const resolvedTickets = tickets.filter(
    (t) => t.status === "Resolved" || t.status === "Closed"
  ).length;
  const unassignedTickets = tickets.filter(
    (t) => t.assigned_to_id === null
  ).length;

  const recentTickets = [...tickets]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              SRE Ticket Dashboard
            </h1>
            <p className="text-muted-foreground">
              Track incidents, priorities, assignments, and resolution progress.
            </p>
          </div>

            <div className="flex gap-2">
            <Button asChild variant="outline">
                <Link to="/incidents">View Incidents</Link>
            </Button>

            <Button asChild>
                <Link to="/incidents/new">Create Incident</Link>
            </Button>
            </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total Tickets"
            value={totalTickets}
            description="All incidents in the system"
            icon={TicketIcon}
          />
          <StatCard
            title="Open"
            value={openTickets}
            description="Tickets waiting for action"
            icon={AlertCircle}
          />
          <StatCard
            title="In Progress"
            value={inProgressTickets}
            description="Tickets currently being worked"
            icon={Clock}
          />
          <StatCard
            title="Critical"
            value={criticalTickets}
            description="Highest priority incidents"
            icon={Flame}
          />
          <StatCard
            title="Unassigned"
            value={unassignedTickets}
            description="Tickets without an owner"
            icon={UserX}
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Tickets</CardTitle>
              <CardDescription>
                Latest incidents created by users and support staff.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Assigned To</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {recentTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        <div className="font-medium">{ticket.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {ticket.category} · Impact: {ticket.impact}
                        </div>
                      </TableCell>

                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(ticket.status)}>
                          {ticket.status}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        <Badge
                          variant={getPriorityBadgeVariant(ticket.priority)}
                        >
                          {ticket.priority}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {getUserNameById(mockUsers, ticket.assigned_to_id)}
                      </TableCell>

                      <TableCell>{formatDate(ticket.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Resolution Summary</CardTitle>
              <CardDescription>
                Closed or resolved tickets compared to active incidents.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="text-sm font-medium">Resolved / Closed</p>
                  <p className="text-sm text-muted-foreground">
                    Completed incidents
                  </p>
                </div>
                <div className="flex items-center gap-2 text-2xl font-semibold">
                  <CheckCircle2 className="h-5 w-5" />
                  {resolvedTickets}
                </div>
              </div>

              <div className="rounded-lg border p-4">
                <p className="text-sm font-medium">Next focus</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Prioritize open critical tickets and assign any unowned
                  incidents before resolution work continues.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </main>
  );
}