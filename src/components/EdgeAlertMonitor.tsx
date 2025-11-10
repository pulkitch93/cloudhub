import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, AlertCircle, Info, X, Bell, BellOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Alert {
  id: string;
  deviceId: string;
  deviceName: string;
  type: 'latency' | 'resource' | 'security';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

const EdgeAlertMonitor = () => {
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 'alert-1',
      deviceId: 'edge-003',
      deviceName: 'Edge Server Gamma',
      type: 'resource',
      severity: 'critical',
      message: 'CPU utilization at 92% - approaching threshold',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      acknowledged: false,
    },
    {
      id: 'alert-2',
      deviceId: 'edge-002',
      deviceName: 'IoT Gateway Beta',
      type: 'latency',
      severity: 'warning',
      message: 'Latency increased to 48ms - near SLA limit',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      acknowledged: false,
    },
  ]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate real-time alerts
    const interval = setInterval(() => {
      const alertTypes: Alert['type'][] = ['latency', 'resource', 'security'];
      const severities: Alert['severity'][] = ['critical', 'warning', 'info'];
      
      if (Math.random() > 0.7) {
        const newAlert: Alert = {
          id: `alert-${Date.now()}`,
          deviceId: `edge-${String(Math.floor(Math.random() * 4) + 1).padStart(3, '0')}`,
          deviceName: `Edge Node ${Math.floor(Math.random() * 4) + 1}`,
          type: alertTypes[Math.floor(Math.random() * alertTypes.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          message: getRandomAlertMessage(),
          timestamp: new Date(),
          acknowledged: false,
        };

        setAlerts((prev) => [newAlert, ...prev].slice(0, 20));

        if (notificationsEnabled) {
          toast({
            title: `${newAlert.severity.toUpperCase()}: ${newAlert.deviceName}`,
            description: newAlert.message,
            variant: newAlert.severity === 'critical' ? 'destructive' : 'default',
          });
        }
      }
    }, 15000);

    return () => clearInterval(interval);
  }, [notificationsEnabled, toast]);

  const getRandomAlertMessage = () => {
    const messages = [
      'High memory usage detected - 85% utilization',
      'Latency spike detected - 52ms response time',
      'Security scan identified potential vulnerability',
      'Network bandwidth approaching capacity',
      'Temperature threshold exceeded',
      'Connection timeout on primary route',
    ];
    return messages[Math.floor(Math.random() * messages.length)];
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Warning</Badge>;
      case 'info':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Info</Badge>;
      default:
        return null;
    }
  };

  const unacknowledgedCount = alerts.filter((a) => !a.acknowledged).length;

  return (
    <Card className="bg-card border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Live Alert Monitor</h3>
            <p className="text-sm text-muted-foreground">
              Real-time monitoring of critical events
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            className="gap-2"
          >
            {notificationsEnabled ? (
              <>
                <Bell className="h-4 w-4" />
                Enabled
              </>
            ) : (
              <>
                <BellOff className="h-4 w-4" />
                Disabled
              </>
            )}
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            {unacknowledgedCount} Unacknowledged
          </Badge>
          <Badge variant="outline">
            {alerts.length} Total Alerts
          </Badge>
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="p-6 space-y-3">
          {alerts.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No active alerts</p>
            </div>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${
                  alert.acknowledged
                    ? 'bg-muted/30 border-border opacity-60'
                    : 'bg-card border-border'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-foreground">
                          {alert.deviceName}
                        </span>
                        {getSeverityBadge(alert.severity)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {alert.message}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{alert.type.toUpperCase()}</span>
                        <span>•</span>
                        <span>{alert.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!alert.acknowledged && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => acknowledgeAlert(alert.id)}
                      >
                        Acknowledge
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => dismissAlert(alert.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default EdgeAlertMonitor;
