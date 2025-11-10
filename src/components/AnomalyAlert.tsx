import { AlertCircle, AlertTriangle, Info, X, CheckCircle2, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Anomaly } from "@/types/anomaly";
import { useState } from "react";

interface AnomalyAlertProps {
  anomaly: Anomaly;
  onDismiss?: () => void;
  onResolve?: () => void;
  compact?: boolean;
}

const AnomalyAlert = ({ anomaly, onDismiss, onResolve, compact = false }: AnomalyAlertProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSeverityIcon = () => {
    switch (anomaly.severity) {
      case "critical":
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-warning" />;
      case "info":
        return <Info className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getSeverityBadge = () => {
    switch (anomaly.severity) {
      case "critical":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Critical</Badge>;
      case "warning":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Warning</Badge>;
      case "info":
        return <Badge className="bg-muted text-muted-foreground border-border">Info</Badge>;
    }
  };

  const getTypeBadge = () => {
    return anomaly.type === "cost" 
      ? <Badge variant="outline" className="text-xs">💰 Cost</Badge>
      : <Badge variant="outline" className="text-xs">🌱 Carbon</Badge>;
  };

  if (compact) {
    return (
      <div 
        className="p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-3">
          {getSeverityIcon()}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm font-medium text-foreground truncate">{anomaly.title}</p>
              {getSeverityBadge()}
            </div>
            <p className="text-xs text-muted-foreground">
              {new Date(anomaly.detectedAt).toLocaleTimeString()} • {anomaly.metric.deviation}% deviation
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Card className="bg-card border-border">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            {getSeverityIcon()}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-foreground">{anomaly.title}</h4>
                {getSeverityBadge()}
                {getTypeBadge()}
              </div>
              <p className="text-sm text-muted-foreground">{anomaly.description}</p>
              <p className="text-xs text-muted-foreground">
                Detected {new Date(anomaly.detectedAt).toLocaleString()}
              </p>
            </div>
          </div>
          {onDismiss && (
            <Button variant="ghost" size="icon" onClick={onDismiss}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-4 p-3 rounded-lg bg-secondary/50">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Current</p>
            <p className="text-sm font-bold text-foreground">
              {anomaly.type === "cost" 
                ? `$${(anomaly.metric.current / 1000).toFixed(0)}K`
                : `${anomaly.metric.current.toFixed(1)}T CO₂`}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Expected</p>
            <p className="text-sm font-bold text-foreground">
              {anomaly.type === "cost" 
                ? `$${(anomaly.metric.expected / 1000).toFixed(0)}K`
                : `${anomaly.metric.expected.toFixed(1)}T CO₂`}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Deviation</p>
            <p className="text-sm font-bold text-destructive">+{anomaly.metric.deviation}%</p>
          </div>
        </div>

        {/* Root Cause Analysis */}
        <div>
          <h5 className="text-sm font-semibold text-foreground mb-2">🔍 Root Cause Analysis</h5>
          <div className="space-y-2">
            <p className="text-sm text-foreground font-medium">{anomaly.rootCause.summary}</p>
            <ul className="space-y-1">
              {anomaly.rootCause.details.map((detail, idx) => (
                <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-2 mt-2">
              {anomaly.rootCause.affectedResources.map((resource) => (
                <Badge key={resource} variant="outline" className="text-xs font-mono">
                  {resource}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Remediation */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h5 className="text-sm font-semibold text-foreground">💡 Recommended Actions</h5>
            {anomaly.remediation.automated && (
              <Badge className="bg-success/10 text-success border-success/20 text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Auto-fixable
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            <ol className="space-y-1">
              {anomaly.remediation.steps.map((step, idx) => (
                <li key={idx} className="text-xs text-foreground flex items-start gap-2">
                  <span className="text-primary font-bold mt-0.5">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
            <div className="p-3 rounded-lg bg-success/10 border border-success/20">
              <p className="text-xs font-medium text-success">
                📈 {anomaly.remediation.estimatedImpact}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 pt-2 border-t border-border">
          {anomaly.remediation.automated && onResolve && (
            <Button 
              className="bg-primary hover:bg-primary/90 flex-1"
              onClick={onResolve}
            >
              <Zap className="h-4 w-4 mr-2" />
              Auto-Resolve
            </Button>
          )}
          <Button variant="outline" className="flex-1">
            View Details
          </Button>
          {anomaly.status === "active" && (
            <Button variant="outline">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Acknowledge
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default AnomalyAlert;
