import { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Download } from "lucide-react";
import { toast } from "sonner";

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  tenant: string;
  resource: string;
  status: "success" | "failed";
  reason: string;
}

const mockAuditLog: AuditEntry[] = [
  {
    id: "1",
    timestamp: "2025-01-10 14:23:15",
    actor: "admin@lenovo.com",
    action: "Create Organization",
    tenant: "Acme Corporation",
    resource: "Organization",
    status: "success",
    reason: "New customer onboarding",
  },
  {
    id: "2",
    timestamp: "2025-01-10 13:45:22",
    actor: "support@lenovo.com",
    action: "Update SLA Tier",
    tenant: "Global Tech Solutions",
    resource: "Subscription",
    status: "success",
    reason: "Customer upgrade request",
  },
  {
    id: "3",
    timestamp: "2025-01-10 12:10:08",
    actor: "admin@lenovo.com",
    action: "Suspend Tenant",
    tenant: "Healthcare Systems Inc",
    resource: "Organization",
    status: "failed",
    reason: "MFA timeout - action blocked",
  },
  {
    id: "4",
    timestamp: "2025-01-10 11:30:45",
    actor: "implementer@lenovo.com",
    action: "Deploy Infrastructure",
    tenant: "Finance Corp",
    resource: "Deployment",
    status: "success",
    reason: "Scheduled deployment",
  },
];

export default function AuditLog() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLog = mockAuditLog.filter(
    (entry) =>
      entry.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.tenant.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = (format: "csv" | "json") => {
    toast.success(`Audit log exported as ${format.toUpperCase()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Audit & Access Log</h1>
            <p className="text-muted-foreground mt-1">
              Complete audit trail of all admin actions
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleExport("csv")}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Button variant="outline" onClick={() => handleExport("json")}>
              <Download className="mr-2 h-4 w-4" />
              Export JSON
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by actor, action, or tenant..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Resource</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLog.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-mono text-sm">
                      {entry.timestamp}
                    </TableCell>
                    <TableCell>{entry.actor}</TableCell>
                    <TableCell className="font-medium">{entry.action}</TableCell>
                    <TableCell>{entry.tenant}</TableCell>
                    <TableCell>{entry.resource}</TableCell>
                    <TableCell>
                      <Badge
                        className={
                          entry.status === "success"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : "bg-red-500/10 text-red-500 border-red-500/20"
                        }
                      >
                        {entry.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {entry.reason}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
