import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Clock, UserPlus, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { LenaAlert } from '@/types/lenaAI';
import { lenaAiService } from '@/services/lenaAiService';
import { useToast } from '@/hooks/use-toast';
import LenaRunbookDrawer from './LenaRunbookDrawer';

const LenaAlertsTab = () => {
  const [alerts, setAlerts] = useState<LenaAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [selectedAlert, setSelectedAlert] = useState<LenaAlert | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchAlerts();
  }, [severityFilter]);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const filters = severityFilter !== 'all' ? { severity: severityFilter } : undefined;
      const data = await lenaAiService.getAlerts(filters);
      setAlerts(data);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityIcon = (severity: LenaAlert['severity']) => {
    switch (severity) {
      case 'critical': return <AlertCircle className="w-4 h-4" />;
      case 'high': return <AlertTriangle className="w-4 h-4" />;
      case 'medium': return <AlertCircle className="w-4 h-4" />;
      case 'low': return <Info className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity: LenaAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'high': return 'bg-warning/10 text-warning border-warning/20';
      case 'medium': return 'bg-primary/10 text-primary border-primary/20';
      case 'low': return 'bg-muted text-muted-foreground border-border';
    }
  };

  const handleAssign = async (alertId: string) => {
    try {
      await lenaAiService.assignAlert(alertId, 'current-user');
      toast({ title: 'Alert assigned', description: 'Alert has been assigned to you' });
      fetchAlerts();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to assign alert', variant: 'destructive' });
    }
  };

  const handleSnooze = async (alertId: string) => {
    try {
      await lenaAiService.snoozeAlert(alertId, 60);
      toast({ title: 'Alert snoozed', description: 'Alert snoozed for 1 hour' });
      fetchAlerts();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to snooze alert', variant: 'destructive' });
    }
  };

  const handleResolve = (alert: LenaAlert) => {
    if (alert.prescriptiveAction) {
      setSelectedAlert(alert);
    } else {
      resolveAlert(alert.id);
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      await lenaAiService.resolveAlert(alertId);
      toast({ title: 'Alert resolved', description: 'Alert has been marked as resolved' });
      fetchAlerts();
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to resolve alert', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-sm text-muted-foreground">Loading alerts...</div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Filter Section */}
        <div className="px-4 py-3 border-b border-border bg-card/50">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical Only</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="low">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Alerts List */}
        <ScrollArea className="flex-1">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <CheckCircle2 className="w-16 h-16 text-success mb-3 opacity-50" />
              <h3 className="font-medium text-foreground mb-1">All clear!</h3>
              <p className="text-sm text-muted-foreground text-center">
                No alerts found for the selected filter
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {alerts.map(alert => (
                <div
                  key={alert.id}
                  className="bg-card border border-border rounded-lg p-4 space-y-3 hover:border-primary/40 transition-all hover:shadow-sm"
                >
                  {/* Alert Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`p-2 rounded-md ${getSeverityColor(alert.severity)}`}>
                        {getSeverityIcon(alert.severity)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm text-foreground mb-1 leading-tight">
                          {alert.title}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {alert.description}
                        </p>
                      </div>
                    </div>
                    <Badge className={`${getSeverityColor(alert.severity)} shrink-0 capitalize`}>
                      {alert.severity}
                    </Badge>
                  </div>

                  {/* Resource Info */}
                  <div className="text-xs text-muted-foreground bg-muted/30 px-3 py-2 rounded border border-border/50">
                    <span className="font-medium">Resource:</span> {alert.affectedResource}
                  </div>

                  {/* Suggested Fix */}
                  {alert.suggestedFix && (
                    <div className="text-xs bg-primary/5 border border-primary/10 px-3 py-2 rounded">
                      <span className="font-semibold text-primary">Suggested Fix:</span>
                      <span className="text-muted-foreground ml-1">{alert.suggestedFix}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAssign(alert.id)}
                      className="flex-1 text-xs"
                    >
                      <UserPlus className="w-3 h-3 mr-1.5" />
                      Assign
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleSnooze(alert.id)}
                      className="flex-1 text-xs"
                    >
                      <Clock className="w-3 h-3 mr-1.5" />
                      Snooze
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleResolve(alert)}
                      className="flex-1 text-xs"
                    >
                      {alert.prescriptiveAction ? 'Resolve' : 'Mark Done'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Runbook Drawer */}
      {selectedAlert && selectedAlert.prescriptiveAction && (
        <LenaRunbookDrawer
          action={selectedAlert.prescriptiveAction}
          onClose={() => setSelectedAlert(null)}
          onComplete={() => {
            resolveAlert(selectedAlert.id);
            setSelectedAlert(null);
          }}
        />
      )}
    </>
  );
};

export default LenaAlertsTab;
