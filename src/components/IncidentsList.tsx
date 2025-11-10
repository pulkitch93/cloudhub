import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Incident {
  id: string;
  title: string;
  severity: "critical" | "warning" | "info";
  time: string;
  status: "active" | "resolved";
}

const incidents: Incident[] = [
  {
    id: "INC-001",
    title: "High CPU usage detected on web-server-03",
    severity: "critical",
    time: "2 min ago",
    status: "active",
  },
  {
    id: "INC-002",
    title: "Network latency increase in US-East region",
    severity: "warning",
    time: "15 min ago",
    status: "active",
  },
  {
    id: "INC-003",
    title: "Database backup completed successfully",
    severity: "info",
    time: "1 hour ago",
    status: "resolved",
  },
];

const IncidentsList = () => {
  const getSeverityIcon = (severity: Incident["severity"]) => {
    switch (severity) {
      case "critical":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case "info":
        return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getSeverityColor = (severity: Incident["severity"]) => {
    switch (severity) {
      case "critical":
        return "bg-destructive/10 text-destructive border-destructive/20";
      case "warning":
        return "bg-warning/10 text-warning border-warning/20";
      case "info":
        return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Recent Incidents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {incidents.map((incident) => (
            <div
              key={incident.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
            >
              <div className="mt-0.5">{getSeverityIcon(incident.severity)}</div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{incident.title}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{incident.id}</span>
                  <span>•</span>
                  <span>{incident.time}</span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={getSeverityColor(incident.severity)}
              >
                {incident.severity}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IncidentsList;
