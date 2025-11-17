import { useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientView() {
  const { tenantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const tenantName = location.state?.tenantName || "Customer Organization";
  const [viewMode, setViewMode] = useState<"admin" | "customer">("customer");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Admin Banner */}
      <Alert className="rounded-none border-x-0 border-t-0 bg-red-500/10 border-red-500/20">
        <ShieldAlert className="h-4 w-4 text-red-500" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-red-500 font-medium">
            You are viewing as Customer: {tenantName} (ID: {tenantId})
          </span>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Label htmlFor="view-mode" className="text-red-500">
                View Mode:
              </Label>
              <div className="flex items-center gap-2">
                <span className={viewMode === "customer" ? "text-red-500 font-medium" : "text-muted-foreground"}>
                  Customer (Read-Only)
                </span>
                <Switch
                  id="view-mode"
                  checked={viewMode === "admin"}
                  onCheckedChange={(checked) => setViewMode(checked ? "admin" : "customer")}
                />
                <span className={viewMode === "admin" ? "text-red-500 font-medium" : "text-muted-foreground"}>
                  Admin
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/admin/tenant-directory")}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Directory
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      <main className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{tenantName}</h1>
            <p className="text-muted-foreground mt-1">
              Client environment overview and management
            </p>
          </div>
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
            Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Nodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">99.98%</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-500">12</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Compliance Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">94%</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>TruScale AIOps Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center border-2 border-dashed border-border rounded-lg">
              <div className="text-center space-y-2">
                <p className="text-muted-foreground">
                  Customer's live TruScale AIOps view would be embedded here
                </p>
                <p className="text-sm text-muted-foreground">
                  Current Mode: <span className="font-semibold text-red-500">
                    {viewMode === "admin" ? "Admin (Full Access)" : "Customer View (Read-Only)"}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {viewMode === "admin" && (
          <Alert>
            <ShieldAlert className="h-4 w-4" />
            <AlertDescription>
              Admin mode enabled. Write actions will require MFA re-check. All actions are audited.
            </AlertDescription>
          </Alert>
        )}
      </main>
    </div>
  );
}
