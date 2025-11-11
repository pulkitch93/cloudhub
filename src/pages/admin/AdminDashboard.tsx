import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, BarChart3, Settings2, Users, TrendingUp, FileStack } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Tenant Directory",
      description: "Manage customer organizations, view client details, and monitor tenant health",
      icon: Building2,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      actions: [
        { label: "View All Tenants", path: "/admin/tenant-directory", icon: Users },
        { label: "Create Organization", path: "/admin/create-organization", icon: Building2 },
      ]
    },
    {
      title: "Analytics & Insights",
      description: "Track revenue, deployments, and partner performance metrics",
      icon: BarChart3,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      actions: [
        { label: "Partner Analytics", path: "/admin/partner-insights", icon: TrendingUp },
        { label: "Audit Log", path: "/admin/audit-log", icon: FileStack },
      ]
    },
    {
      title: "Provisioning & Implementation",
      description: "Monitor deployment progress, manage tasks, and track implementation status",
      icon: Settings2,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      actions: [
        { label: "View Tenants", path: "/admin/tenant-directory", icon: Building2 },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Admin Console</h1>
          <p className="text-muted-foreground">
            Manage tenants, monitor analytics, and oversee implementation projects
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <Card key={section.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg ${section.bgColor} flex items-center justify-center mb-4`}>
                  <section.icon className={`h-6 w-6 ${section.color}`} />
                </div>
                <CardTitle>{section.title}</CardTitle>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {section.actions.map((action) => (
                  <Button
                    key={action.path}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => navigate(action.path)}
                  >
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.label}
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Tenants</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Deployments</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">$1.2M</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Avg Satisfaction</p>
                <p className="text-2xl font-bold">4.8</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
