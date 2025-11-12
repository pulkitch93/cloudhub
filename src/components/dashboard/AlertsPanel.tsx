import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { dashboardApi } from '@/services/dashboardApi';
import { Alert } from '@/types/dashboard';
import { AlertCircle, Clock, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDashboard } from '@/contexts/DashboardContext';

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { filters } = useDashboard();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await dashboardApi.getAlerts({ tenantId: filters.tenantId });
      setAlerts(data.filter(a => a.status === 'open').slice(0, 5));
      setLoading(false);
    };
    fetchData();
  }, [filters]);

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-destructive text-destructive-foreground';
      case 'high': return 'bg-warning text-warning-foreground';
      case 'medium': return 'bg-primary text-primary-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
    }
  };

  const handleAssign = async (id: string) => {
    try {
      await dashboardApi.assignAlert(id, 'current-user');
      toast({ title: 'Alert assigned', description: 'Alert has been assigned to you' });
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'assigned' as const, owner: 'current-user' } : a));
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to assign alert', variant: 'destructive' });
    }
  };

  const handleSnooze = async (id: string) => {
    try {
      await dashboardApi.snoozeAlert(id, 60);
      toast({ title: 'Alert snoozed', description: 'Alert snoozed for 1 hour' });
      setAlerts(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to snooze alert', variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="h-96 animate-pulse bg-muted rounded-lg" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">No open alerts</p>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className="p-4 border border-border rounded-lg">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
                  <div>
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge className={getSeverityColor(alert.severity)}>
                  {alert.severity}
                </Badge>
              </div>
              
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleAssign(alert.id)}>
                  <UserPlus className="w-3 h-3 mr-1" />
                  Assign
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleSnooze(alert.id)}>
                  <Clock className="w-3 h-3 mr-1" />
                  Snooze
                </Button>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
