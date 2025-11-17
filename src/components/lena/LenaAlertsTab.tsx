import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Clock, CheckCircle2, Zap, Filter } from 'lucide-react';
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

  const getSeverityStyles = (severity: LenaAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return {
          bg: 'bg-destructive/5',
          border: 'border-l-destructive',
          badge: 'bg-destructive text-destructive-foreground',
          icon: 'text-destructive',
        };
      case 'high':
        return {
          bg: 'bg-orange-500/5',
          border: 'border-l-orange-500',
          badge: 'bg-orange-500 text-white',
          icon: 'text-orange-500',
        };
      case 'medium':
        return {
          bg: 'bg-yellow-500/5',
          border: 'border-l-yellow-500',
          badge: 'bg-yellow-500 text-white',
          icon: 'text-yellow-500',
        };
      case 'low':
        return {
          bg: 'bg-blue-500/5',
          border: 'border-l-blue-500',
          badge: 'bg-blue-500 text-white',
          icon: 'text-blue-500',
        };
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
      toast({ 
        title: '✓ Alert resolved', 
        description: 'Successfully marked as resolved',
        className: 'bg-success/10 border-success/20'
      });
      fetchAlerts();
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to resolve alert', 
        variant: 'destructive' 
      });
    }
  };

  const handleSnooze = async (alertId: string) => {
    try {
      await lenaAiService.snoozeAlert(alertId, 60);
      toast({ 
        title: 'Alert snoozed', 
        description: 'Will remind you in 1 hour' 
      });
      fetchAlerts();
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to snooze alert', 
        variant: 'destructive' 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Loading alerts...</p>
        </div>
      </div>
    );
  }

  const alertCounts = {
    critical: alerts.filter(a => a.severity === 'critical').length,
    high: alerts.filter(a => a.severity === 'high').length,
    medium: alerts.filter(a => a.severity === 'medium').length,
    low: alerts.filter(a => a.severity === 'low').length,
  };

  return (
    <>
      <div className="flex flex-col h-full">
        {/* Stats Header */}
        <div className="px-4 py-3 bg-gradient-to-r from-muted/50 to-muted/20 border-b border-border">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Active Alerts
            </h3>
            <span className="text-xs text-muted-foreground">
              {alerts.length} total
            </span>
          </div>
          <div className="flex gap-2">
            {alertCounts.critical > 0 && (
              <Badge variant="destructive" className="text-xs px-2 py-0.5">
                {alertCounts.critical} Critical
              </Badge>
            )}
            {alertCounts.high > 0 && (
              <Badge className="text-xs px-2 py-0.5 bg-orange-500 text-white">
                {alertCounts.high} High
              </Badge>
            )}
            {alertCounts.medium > 0 && (
              <Badge className="text-xs px-2 py-0.5 bg-yellow-500 text-white">
                {alertCounts.medium} Medium
              </Badge>
            )}
          </div>
        </div>

        {/* Filter */}
        <div className="px-4 py-2 border-b border-border/50">
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="h-8 text-xs bg-background border-border/50">
              <Filter className="w-3 h-3 mr-1" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="bg-background z-50">
              <SelectItem value="all" className="text-xs">All Severities</SelectItem>
              <SelectItem value="critical" className="text-xs">Critical Only</SelectItem>
              <SelectItem value="high" className="text-xs">High Priority</SelectItem>
              <SelectItem value="medium" className="text-xs">Medium Priority</SelectItem>
              <SelectItem value="low" className="text-xs">Low Priority</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Alerts List */}
        <ScrollArea className="flex-1">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4">
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-8 h-8 text-success" />
              </div>
              <h3 className="font-semibold text-sm text-foreground mb-1">All Clear!</h3>
              <p className="text-xs text-muted-foreground text-center">
                No active alerts at this time
              </p>
            </div>
          ) : (
            <div className="p-3 space-y-2">
              {alerts.map((alert, index) => {
                const styles = getSeverityStyles(alert.severity);
                return (
                  <div
                    key={alert.id}
                    className={`${styles.bg} ${styles.border} border-l-4 border border-border/50 rounded-lg overflow-hidden hover:shadow-md transition-all duration-200 animate-in slide-in-from-top-2`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Alert Header */}
                    <div className="p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <AlertCircle className={`w-3.5 h-3.5 ${styles.icon} shrink-0`} />
                            <h4 className="font-semibold text-xs text-foreground leading-tight">
                              {alert.title}
                            </h4>
                          </div>
                          <p className="text-xs text-muted-foreground/80 leading-relaxed">
                            {alert.description}
                          </p>
                        </div>
                        <Badge className={`${styles.badge} text-xs px-2 py-0.5 shrink-0 capitalize font-medium`}>
                          {alert.severity}
                        </Badge>
                      </div>

                      {/* Resource */}
                      <div className="flex items-start gap-1.5 text-xs">
                        <span className="text-muted-foreground/60 shrink-0">Resource:</span>
                        <span className="text-foreground/80 font-mono text-xs">
                          {alert.affectedResource}
                        </span>
                      </div>

                      {/* Suggested Fix */}
                      {alert.suggestedFix && (
                        <div className="flex items-start gap-2 bg-primary/5 border border-primary/10 rounded px-2.5 py-2">
                          <Zap className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-primary mb-0.5">Suggested Fix</p>
                            <p className="text-xs text-muted-foreground/80 leading-relaxed">
                              {alert.suggestedFix}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-1.5 pt-1">
                        <Button
                          size="sm"
                          onClick={() => handleResolve(alert)}
                          className="flex-1 h-7 text-xs font-medium"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          {alert.prescriptiveAction ? 'Resolve' : 'Mark Done'}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSnooze(alert.id)}
                          className="h-7 text-xs px-3"
                        >
                          <Clock className="w-3 h-3 mr-1" />
                          Snooze
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
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
