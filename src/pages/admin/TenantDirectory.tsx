import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MoreVertical, Eye, Settings, Pause, Trash2, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Tenant {
  id: string;
  name: string;
  status: "active" | "suspended" | "provisioning" | "trial";
  tier: string;
  regions: string[];
  uptime: string;
  incidents: number;
  monthlyUsage: string;
  vertical: string;
  renewalDate: string;
}

const mockTenants: Tenant[] = [
  {
    id: "1",
    name: "Acme Corporation",
    status: "active",
    tier: "Enterprise",
    regions: ["US-East", "EU-West"],
    uptime: "99.98%",
    incidents: 2,
    monthlyUsage: "$45,200",
    vertical: "Manufacturing",
    renewalDate: "2025-06-15",
  },
  {
    id: "2",
    name: "Global Tech Solutions",
    status: "active",
    tier: "Premium",
    regions: ["US-West", "APAC"],
    uptime: "99.95%",
    incidents: 5,
    monthlyUsage: "$32,100",
    vertical: "Technology",
    renewalDate: "2025-08-22",
  },
  {
    id: "3",
    name: "Healthcare Systems Inc",
    status: "trial",
    tier: "Trial",
    regions: ["US-East"],
    uptime: "99.92%",
    incidents: 1,
    monthlyUsage: "$8,500",
    vertical: "Healthcare",
    renewalDate: "2025-12-30",
  },
  {
    id: "4",
    name: "Finance Corp",
    status: "active",
    tier: "Enterprise",
    regions: ["US-East", "EU-Central", "APAC"],
    uptime: "99.99%",
    incidents: 0,
    monthlyUsage: "$78,900",
    vertical: "Finance",
    renewalDate: "2025-04-10",
  },
  {
    id: "5",
    name: "Retail Solutions Ltd",
    status: "provisioning",
    tier: "Standard",
    regions: ["EU-West"],
    uptime: "N/A",
    incidents: 0,
    monthlyUsage: "$0",
    vertical: "Retail",
    renewalDate: "2026-01-15",
  },
];

export default function TenantDirectory() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [verticalFilter, setVerticalFilter] = useState("all");

  const filteredTenants = mockTenants.filter((tenant) => {
    const matchesSearch = tenant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || tenant.status === statusFilter;
    const matchesVertical = verticalFilter === "all" || tenant.vertical === verticalFilter;
    return matchesSearch && matchesStatus && matchesVertical;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "trial":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "provisioning":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "suspended":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleViewClient = (tenantId: string, tenantName: string) => {
    navigate(`/admin/client-view/${tenantId}`, { state: { tenantName } });
  };

  const handleProvisioning = (tenantId: string) => {
    navigate(`/admin/provisioning/${tenantId}`);
  };

  const handleExport = () => {
    toast.success("Tenant summary exported successfully");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tenant Directory</h1>
            <p className="text-muted-foreground mt-1">
              Manage all customer organizations and deployments
            </p>
          </div>
          <Button onClick={() => navigate("/admin/create-organization")}>
            Create Organization
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Tenants
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTenants.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {mockTenants.filter((t) => t.status === "active").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Trial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-500">
                {mockTenants.filter((t) => t.status === "trial").length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$164.7K</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search organizations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="provisioning">Provisioning</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Select value={verticalFilter} onValueChange={setVerticalFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Vertical" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Verticals</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Organization</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Regions</TableHead>
                  <TableHead>Uptime</TableHead>
                  <TableHead>Incidents</TableHead>
                  <TableHead>Monthly Usage</TableHead>
                  <TableHead>Renewal</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell className="font-medium">{tenant.name}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(tenant.status)}>
                        {tenant.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{tenant.tier}</TableCell>
                    <TableCell>{tenant.regions.join(", ")}</TableCell>
                    <TableCell>{tenant.uptime}</TableCell>
                    <TableCell>
                      {tenant.incidents === 0 ? (
                        <span className="text-green-500">{tenant.incidents}</span>
                      ) : (
                        <span className="text-yellow-500">{tenant.incidents}</span>
                      )}
                    </TableCell>
                    <TableCell>{tenant.monthlyUsage}</TableCell>
                    <TableCell>{tenant.renewalDate}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleViewClient(tenant.id, tenant.name)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Open Client View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleProvisioning(tenant.id)}
                          >
                            <Settings className="mr-2 h-4 w-4" />
                            Provisioning
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={handleExport}>
                            <Download className="mr-2 h-4 w-4" />
                            Export Summary
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pause className="mr-2 h-4 w-4" />
                            Suspend
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
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
