import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Clock, UserPlus, CheckCircle } from 'lucide-react';
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

  const getSeverityColor = (severity: LenaAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
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
      // Direct resolve without runbook
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
        {/* Filters */}
        <div className="p-4 border-b border-border">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Alerts List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-3">
            {alerts.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle className="w-12 h-12 mx-auto text-success mb-2" />
                <p className="text-sm text-muted-foreground">No alerts found</p>
              </div>
            ) : (
              alerts.map(alert => (
                <div
                  key={alert.id}
                  className="p-3 border border-border rounded-lg space-y-3 hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm">{alert.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {alert.affectedResource}
                        </p>
                      </div>
                    </div>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </div>

                  {alert.suggestedFix && (
                    <div className="text-xs bg-muted/50 p-2 rounded">
                      <span className="font-medium">Suggested: </span>
                      {alert.suggestedFix}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAssign(alert.id)}
                      className="flex-1"
                    >
                      <UserPlus className="w-3 h-3 mr-1" />
                      Assign
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSnooze(alert.id)}
                      className="flex-1"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Snooze
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleResolve(alert)}
                      className="flex-1"
                    >
                      {alert.prescriptiveAction ? 'Resolve' : 'Mark Done'}
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
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
