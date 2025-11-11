import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, CheckCircle, Circle, Clock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  name: string;
  status: "completed" | "in-progress" | "pending" | "failed";
  owner: string;
  dueDate: string;
}

const mockTasks: Task[] = [
  { id: "1", name: "Infrastructure Planning", status: "completed", owner: "John Smith", dueDate: "2025-01-05" },
  { id: "2", name: "Network Configuration", status: "completed", owner: "Sarah Chen", dueDate: "2025-01-10" },
  { id: "3", name: "Security Hardening", status: "in-progress", owner: "Mike Johnson", dueDate: "2025-01-15" },
  { id: "4", name: "Integration Setup", status: "pending", owner: "Emma Wilson", dueDate: "2025-01-20" },
  { id: "5", name: "Final Validation", status: "pending", owner: "David Lee", dueDate: "2025-01-25" },
];

export default function Provisioning() {
  const { tenantId } = useParams();
  const navigate = useNavigate();
  const [deploymentStatus] = useState("building");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "in-progress":
        return <Clock className="h-5 w-5 text-yellow-500 animate-pulse" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      planned: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      building: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      validating: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      live: "bg-green-500/10 text-green-500 border-green-500/20",
    };
    return colors[status] || "";
  };

  const handleValidate = () => {
    toast.success("Pre-flight validation passed. Ready to go live.");
  };

  const handleGoLive = () => {
    toast.success("Deployment initiated. Customer will be notified.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate("/admin/tenant-directory")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Implementation & Provisioning
              </h1>
              <p className="text-muted-foreground mt-1">
                Tenant ID: {tenantId}
              </p>
            </div>
          </div>
          <Badge className={getStatusBadge(deploymentStatus)}>
            {deploymentStatus}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">40%</div>
              <Progress value={40} className="h-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tasks Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2 / 5</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Days to Live
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pre-flight Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                Pending
              </Badge>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="settings">Provisioning Settings</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="runbooks">Runbooks</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Implementation Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        {getStatusIcon(task.status)}
                        <div>
                          <p className="font-medium">{task.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Owner: {task.owner} • Due: {task.dueDate}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline">{task.status}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Deployment Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Region</Label>
                    <Select defaultValue="us-east">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east">US East</SelectItem>
                        <SelectItem value="us-west">US West</SelectItem>
                        <SelectItem value="eu-west">EU West</SelectItem>
                        <SelectItem value="apac">APAC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Stack Type</Label>
                    <Select defaultValue="vmware">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vmware">VMware</SelectItem>
                        <SelectItem value="azure">Azure Stack HCI</SelectItem>
                        <SelectItem value="nutanix">Nutanix</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>SLA Tier</Label>
                    <Select defaultValue="enterprise">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Capacity Target (Nodes)</Label>
                    <Input type="number" defaultValue="250" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Integrations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { name: "SSO / Identity", status: "configured" },
                  { name: "ServiceNow", status: "pending" },
                  { name: "Azure Monitor", status: "configured" },
                  { name: "Billing Meters", status: "pending" },
                ].map((integration) => (
                  <div
                    key={integration.name}
                    className="flex items-center justify-between p-4 border border-border rounded-lg"
                  >
                    <span className="font-medium">{integration.name}</span>
                    <Badge
                      className={
                        integration.status === "configured"
                          ? "bg-green-500/10 text-green-500 border-green-500/20"
                          : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      }
                    >
                      {integration.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="runbooks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Deployment Runbooks</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  Standard Deployment Checklist
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Edge-Focused Blueprint
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  AI-Heavy Workload Setup
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Regulated Industry Compliance
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex gap-4">
          <Button onClick={handleValidate}>Run Pre-flight Validation</Button>
          <Button variant="destructive" onClick={handleGoLive}>
            Go Live
          </Button>
        </div>
      </main>
    </div>
  );
}
