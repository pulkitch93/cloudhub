import { useState } from "react";
import { Cloud, Database, Cpu, GitBranch, Link as LinkIcon, CheckCircle2, AlertCircle } from "lucide-react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import XClarityConfig from "@/components/XClarityConfig";
import XClarityMonitoring from "@/components/XClarityMonitoring";
import XClarityAlerts from "@/components/XClarityAlerts";
import XClarityConflictResolution from "@/components/XClarityConflictResolution";

interface Integration {
  name: string;
  category: "data-source" | "ai-model" | "external-api";
  status: "connected" | "disconnected" | "warning";
  icon: string;
  metrics?: {
    label: string;
    value: string;
  }[];
}

const integrations: Integration[] = [
  // Data Sources
  { name: "Lenovo XClarity", category: "data-source", status: "connected", icon: "🖥️", metrics: [{ label: "Nodes", value: "247" }, { label: "Uptime", value: "99.97%" }] },
  { name: "TruScale Telemetry", category: "data-source", status: "connected", icon: "📊", metrics: [{ label: "Metrics/min", value: "15.2K" }] },
  { name: "AWS CloudWatch", category: "data-source", status: "connected", icon: "☁️", metrics: [{ label: "Accounts", value: "12" }] },
  { name: "Azure Monitor", category: "data-source", status: "connected", icon: "🔷", metrics: [{ label: "Subscriptions", value: "8" }] },
  { name: "Sustainability Data", category: "data-source", status: "connected", icon: "🌱", metrics: [{ label: "CO₂ Tracked", value: "2.4T" }] },
  
  // AI Models
  { name: "Predictive Failure (LSTM)", category: "ai-model", status: "connected", icon: "🤖", metrics: [{ label: "Accuracy", value: "94.2%" }] },
  { name: "Cost Forecaster", category: "ai-model", status: "connected", icon: "💰", metrics: [{ label: "Predictions", value: "1.2K/day" }] },
  { name: "Carbon Optimizer", category: "ai-model", status: "connected", icon: "♻️", metrics: [{ label: "Savings", value: "18%" }] },
  { name: "Anomaly Detection (Transformer)", category: "ai-model", status: "connected", icon: "🔍", metrics: [{ label: "Alerts", value: "47/week" }] },
  { name: "NVIDIA NIM", category: "ai-model", status: "connected", icon: "🚀", metrics: [{ label: "Inference", value: "850ms avg" }] },
  
  // External APIs
  { name: "VMware Aria", category: "external-api", status: "connected", icon: "🔄" },
  { name: "Azure Arc", category: "external-api", status: "connected", icon: "🔗" },
  { name: "ServiceNow", category: "external-api", status: "warning", icon: "🎫" },
  { name: "Jira", category: "external-api", status: "connected", icon: "📋" },
  { name: "Terraform Cloud", category: "external-api", status: "connected", icon: "🏗️" },
];

const Integrations = () => {
  const [xclarityConfigOpen, setXclarityConfigOpen] = useState(false);

  const getStatusBadge = (status: Integration["status"]) => {
    switch (status) {
      case "connected":
        return <Badge className="bg-success/10 text-success border-success/20">Connected</Badge>;
      case "warning":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Warning</Badge>;
      case "disconnected":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Disconnected</Badge>;
    }
  };

  const getCategoryTitle = (category: Integration["category"]) => {
    switch (category) {
      case "data-source":
        return "Data Sources";
      case "ai-model":
        return "AI Models";
      case "external-api":
        return "External Integrations";
    }
  };

  const getCategoryIcon = (category: Integration["category"]) => {
    switch (category) {
      case "data-source":
        return <Database className="h-5 w-5 text-primary" />;
      case "ai-model":
        return <Cpu className="h-5 w-5 text-primary" />;
      case "external-api":
        return <LinkIcon className="h-5 w-5 text-primary" />;
    }
  };

  const categories: Integration["category"][] = ["data-source", "ai-model", "external-api"];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Integrations & Data Sources</h2>
          <p className="text-muted-foreground">Manage connections to cloud platforms, AI models, and enterprise tools</p>
        </div>

        <Tabs defaultValue="integrations" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="integrations">All Integrations</TabsTrigger>
            <TabsTrigger value="monitoring">XClarity Monitoring</TabsTrigger>
            <TabsTrigger value="alerts">Alert Management</TabsTrigger>
            <TabsTrigger value="conflicts">Data Validation</TabsTrigger>
          </TabsList>

          <TabsContent value="integrations" className="space-y-8">

        {categories.map((category) => (
          <div key={category} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {getCategoryIcon(category)}
              <h3 className="text-xl font-semibold text-foreground">{getCategoryTitle(category)}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {integrations
                .filter((integration) => integration.category === category)
                .map((integration) => (
                  <Card key={integration.name} className="bg-card border-border hover:border-primary/50 transition-all">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{integration.icon}</span>
                          <div>
                            <CardTitle className="text-base text-foreground">{integration.name}</CardTitle>
                          </div>
                        </div>
                        {getStatusBadge(integration.status)}
                      </div>
                    </CardHeader>
                    
                    {integration.metrics && (
                      <CardContent className="pt-0">
                        <div className="space-y-2">
                          {integration.metrics.map((metric) => (
                            <div key={metric.label} className="flex justify-between text-sm">
                              <span className="text-muted-foreground">{metric.label}</span>
                              <span className="font-medium text-foreground">{metric.value}</span>
                            </div>
                          ))}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full mt-4"
                          onClick={() => integration.name === "Lenovo XClarity" && setXclarityConfigOpen(true)}
                        >
                          Configure
                        </Button>
                      </CardContent>
                    )}
                    
                    {!integration.metrics && (
                      <CardContent className="pt-0">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full"
                          onClick={() => integration.name === "Lenovo XClarity" && setXclarityConfigOpen(true)}
                        >
                          Configure
                        </Button>
                      </CardContent>
                    )}
                  </Card>
                ))}
            </div>
          </div>
        ))}

        <Card className="bg-card border-border mt-8">
          <CardHeader>
            <CardTitle className="text-foreground">Add New Integration</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Connect additional data sources, AI models, or enterprise tools to expand XClarity One capabilities.
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              <LinkIcon className="h-4 w-4 mr-2" />
              Browse Integration Marketplace
            </Button>
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="monitoring">
            <XClarityMonitoring />
          </TabsContent>

          <TabsContent value="alerts">
            <XClarityAlerts />
          </TabsContent>

          <TabsContent value="conflicts">
            <XClarityConflictResolution />
          </TabsContent>
        </Tabs>
      </main>

      <XClarityConfig 
        open={xclarityConfigOpen} 
        onOpenChange={setXclarityConfigOpen}
      />
    </div>
  );
};

export default Integrations;
