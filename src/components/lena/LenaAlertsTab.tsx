import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, Clock, CheckCircle2, Zap, ChevronDown } from 'lucide-react';
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
          container: 'bg-gradient-to-br from-red-500/10 via-red-500/5 to-transparent',
          border: 'border-red-500/30',
          badge: 'bg-red-500 text-white',
          dot: 'bg-red-500',
        };
      case 'high':
        return {
          container: 'bg-gradient-to-br from-orange-500/10 via-orange-500/5 to-transparent',
          border: 'border-orange-500/30',
          badge: 'bg-orange-500 text-white',
          dot: 'bg-orange-500',
        };
      case 'medium':
        return {
          container: 'bg-gradient-to-br from-yellow-500/10 via-yellow-500/5 to-transparent',
          border: 'border-yellow-500/30',
          badge: 'bg-yellow-500 text-white',
          dot: 'bg-yellow-500',
        };
      case 'low':
        return {
          container: 'bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent',
          border: 'border-blue-500/30',
          badge: 'bg-blue-500 text-white',
          dot: 'bg-blue-500',
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
        title: 'Resolved', 
        description: 'Alert marked as resolved',
      });
      fetchAlerts();
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to resolve', 
        variant: 'destructive' 
      });
    }
  };

  const handleSnooze = async (alertId: string) => {
    try {
      await lenaAiService.snoozeAlert(alertId, 60);
      toast({ 
        title: 'Snoozed', 
        description: 'Remind in 1 hour' 
      });
      fetchAlerts();
    } catch (error) {
      toast({ 
        title: 'Error', 
        description: 'Failed to snooze', 
        variant: 'destructive' 
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-3 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-xs text-muted-foreground">Loading...</p>
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
        {/* Alerts List - Information First */}
        <ScrollArea className="flex-1">
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
              <p className="text-sm font-medium text-foreground">No Active Alerts</p>
              <p className="text-xs text-muted-foreground">System is running smoothly</p>
            </div>
          ) : (
            <div className="p-2.5 space-y-2.5">
              {alerts.map((alert, index) => {
                const styles = getSeverityStyles(alert.severity);
                return (
                  <div
                    key={alert.id}
                    className={`${styles.container} ${styles.border} border-2 rounded-xl p-3.5 space-y-2.5 hover:shadow-lg transition-all duration-300`}
                    style={{ 
                      animationDelay: `${index * 80}ms`,
                      animation: 'slideInFromRight 0.4s ease-out forwards'
                    }}
                  >
                    {/* Title Row */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        <div className={`w-2 h-2 rounded-full ${styles.dot} mt-1.5 shrink-0 animate-pulse`} />
                        <h3 className="font-bold text-sm text-foreground leading-snug">
                          {alert.title}
                        </h3>
                      </div>
                      <Badge className={`${styles.badge} text-xs px-2.5 py-0.5 font-semibold uppercase tracking-wide shrink-0`}>
                        {alert.severity}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed pl-4">
                      {alert.description}
                    </p>

                    {/* Tenant/Resource Info */}
                    <div className="bg-black/5 dark:bg-white/5 rounded-lg px-3 py-2 space-y-1">
                      <div className="text-xs">
                        <span className="text-muted-foreground/70 font-medium">Tenant:</span>{' '}
                        <span className="text-foreground font-semibold">
                          {alert.affectedResource.split(':')[1] || 'FinanceCorp'}
                        </span>
                      </div>
                      <div className="text-xs font-mono text-muted-foreground/60">
                        {alert.affectedResource}
                      </div>
                    </div>

                    {/* Suggested Fix Box */}
                    {alert.suggestedFix && (
                      <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <Zap className="w-4 h-4 text-cyan-500 shrink-0 mt-0.5" />
                          <div className="flex-1 space-y-1">
                            <p className="text-xs font-bold text-cyan-600 dark:text-cyan-400">
                              Suggested Fix
                            </p>
                            <p className="text-xs text-foreground/90 leading-relaxed">
                              {alert.suggestedFix}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        onClick={() => handleResolve(alert)}
                        className="flex-1 h-8 text-xs font-semibold shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        {alert.prescriptiveAction ? 'Resolve' : 'Done'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSnooze(alert.id)}
                        className="h-8 px-4 text-xs font-medium"
                      >
                        <Clock className="w-3.5 h-3.5 mr-1.5" />
                        Snooze
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Filters & Stats Footer - At Bottom */}
        <div className="border-t border-border bg-gradient-to-b from-muted/30 to-muted/60">
          {/* Quick Stats */}
          <div className="px-3 py-2.5 flex items-center justify-between">
            <div className="flex gap-1.5">
              {alertCounts.critical > 0 && (
                <div className="flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-xs font-bold text-red-600 dark:text-red-400">
                    {alertCounts.critical}
                  </span>
                </div>
              )}
              {alertCounts.high > 0 && (
                <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-1 rounded-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                    {alertCounts.high}
                  </span>
                </div>
              )}
              {alertCounts.medium > 0 && (
                <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-1 rounded-md">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  <span className="text-xs font-bold text-yellow-600 dark:text-yellow-400">
                    {alertCounts.medium}
                  </span>
                </div>
              )}
            </div>
            <span className="text-xs font-medium text-muted-foreground">
              {alerts.length} alert{alerts.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Filter Dropdown */}
          <div className="px-3 pb-2.5">
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="h-9 text-xs bg-background/80 backdrop-blur-sm border-border/50 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span className="font-medium">
                    {severityFilter === 'all' ? 'All Alerts' : `${severityFilter.charAt(0).toUpperCase() + severityFilter.slice(1)} Only`}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent className="bg-background z-50">
                <SelectItem value="all" className="text-xs">All Severities</SelectItem>
                <SelectItem value="critical" className="text-xs">Critical</SelectItem>
                <SelectItem value="high" className="text-xs">High</SelectItem>
                <SelectItem value="medium" className="text-xs">Medium</SelectItem>
                <SelectItem value="low" className="text-xs">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
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

      <style>{`
        @keyframes slideInFromRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
};

export default LenaAlertsTab;
