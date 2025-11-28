import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bell, Plus, Trash2, Mail, MessageSquare, Webhook, AlertTriangle, Clock, Database, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface AlertRule {
  id: string;
  name: string;
  metric: 'sync' | 'connection' | 'response_time' | 'error_rate' | 'bandwidth';
  condition: 'above' | 'below' | 'equals';
  threshold: number;
  enabled: boolean;
  notificationChannels: ('email' | 'slack' | 'webhook')[];
}

interface AlertHistory {
  id: string;
  ruleName: string;
  message: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

const XClarityAlerts = () => {
  const [alertRules, setAlertRules] = useState<AlertRule[]>([
    {
      id: '1',
      name: 'Inventory Sync Failure',
      metric: 'sync',
      condition: 'equals',
      threshold: 0,
      enabled: true,
      notificationChannels: ['email', 'slack']
    },
    {
      id: '2',
      name: 'High API Response Time',
      metric: 'response_time',
      condition: 'above',
      threshold: 200,
      enabled: true,
      notificationChannels: ['email']
    },
    {
      id: '3',
      name: 'Connection Dropped',
      metric: 'connection',
      condition: 'equals',
      threshold: 0,
      enabled: true,
      notificationChannels: ['email', 'slack', 'webhook']
    }
  ]);

  const [alertHistory, setAlertHistory] = useState<AlertHistory[]>([
    {
      id: '1',
      ruleName: 'High API Response Time',
      message: 'API response time exceeded 200ms threshold (245ms)',
      timestamp: '2 minutes ago',
      severity: 'warning'
    },
    {
      id: '2',
      ruleName: 'Inventory Sync Failure',
      message: 'Failed to sync server inventory - Connection timeout',
      timestamp: '1 hour ago',
      severity: 'critical'
    }
  ]);

  const getMetricIcon = (metric: AlertRule['metric']) => {
    switch (metric) {
      case 'sync': return <Database className="h-4 w-4" />;
      case 'connection': return <Zap className="h-4 w-4" />;
      case 'response_time': return <Clock className="h-4 w-4" />;
      case 'error_rate': return <AlertTriangle className="h-4 w-4" />;
      case 'bandwidth': return <Zap className="h-4 w-4" />;
    }
  };

  const getMetricLabel = (metric: AlertRule['metric']) => {
    switch (metric) {
      case 'sync': return 'Inventory Sync';
      case 'connection': return 'API Connection';
      case 'response_time': return 'Response Time';
      case 'error_rate': return 'Error Rate';
      case 'bandwidth': return 'Bandwidth Usage';
    }
  };

  const getSeverityBadge = (severity: AlertHistory['severity']) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Warning</Badge>;
      case 'info':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Info</Badge>;
    }
  };

  const handleToggleRule = (id: string) => {
    setAlertRules(alertRules.map(rule =>
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
    toast.success('Alert rule updated');
  };

  const handleAddRule = () => {
    const newRule: AlertRule = {
      id: Date.now().toString(),
      name: 'New Alert Rule',
      metric: 'response_time',
      condition: 'above',
      threshold: 0,
      enabled: true,
      notificationChannels: ['email']
    };
    setAlertRules([...alertRules, newRule]);
    toast.success('Alert rule added');
  };

  const handleDeleteRule = (id: string) => {
    setAlertRules(alertRules.filter(rule => rule.id !== id));
    toast.info('Alert rule deleted');
  };

  const handleTestAlert = (ruleName: string) => {
    toast.info('Sending test alert...', {
      description: `Testing alert rule: ${ruleName}`
    });
    
    setTimeout(() => {
      toast.success('Test alert sent', {
        description: 'Check your configured notification channels'
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Alert Rules Configuration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Alert Rules
              </CardTitle>
              <CardDescription>Configure automated alerts for InfraMonitor integration issues</CardDescription>
            </div>
            <Button onClick={handleAddRule} size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Rule
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {alertRules.map((rule) => (
            <div key={rule.id} className="p-4 rounded-lg border border-border bg-card/50 space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => handleToggleRule(rule.id)}
                  />
                  <div className="flex-1">
                    <Input
                      value={rule.name}
                      onChange={(e) => {
                        setAlertRules(alertRules.map(r =>
                          r.id === rule.id ? { ...r, name: e.target.value } : r
                        ));
                      }}
                      className="font-medium mb-2"
                    />
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {getMetricIcon(rule.metric)}
                      <span>{getMetricLabel(rule.metric)}</span>
                      <span>{rule.condition}</span>
                      <Input
                        type="number"
                        value={rule.threshold}
                        onChange={(e) => {
                          setAlertRules(alertRules.map(r =>
                            r.id === rule.id ? { ...r, threshold: Number(e.target.value) } : r
                          ));
                        }}
                        className="w-24 h-7"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleTestAlert(rule.name)}
                  >
                    Test
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Notification Channels</Label>
                <div className="flex gap-2">
                  {(['email', 'slack', 'webhook'] as const).map((channel) => (
                    <Button
                      key={channel}
                      variant={rule.notificationChannels.includes(channel) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setAlertRules(alertRules.map(r => {
                          if (r.id === rule.id) {
                            const channels = r.notificationChannels.includes(channel)
                              ? r.notificationChannels.filter(c => c !== channel)
                              : [...r.notificationChannels, channel];
                            return { ...r, notificationChannels: channels };
                          }
                          return r;
                        }));
                      }}
                      className="gap-1"
                    >
                      {channel === 'email' && <Mail className="h-3 w-3" />}
                      {channel === 'slack' && <MessageSquare className="h-3 w-3" />}
                      {channel === 'webhook' && <Webhook className="h-3 w-3" />}
                      {channel.charAt(0).toUpperCase() + channel.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {alertRules.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No alert rules configured. Click "Add Rule" to create one.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alert History
          </CardTitle>
          <CardDescription>Recent alerts triggered by InfraMonitor monitoring</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {alertHistory.map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card/50">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground">{alert.ruleName}</span>
                  {getSeverityBadge(alert.severity)}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{alert.message}</p>
                <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
              </div>
            </div>
          ))}

          {alertHistory.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No alerts triggered yet. Your monitoring is active.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Channels</CardTitle>
          <CardDescription>Configure how you receive alert notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">admin@company.com</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <div>
                  <Label>Slack Notifications</Label>
                  <p className="text-sm text-muted-foreground">#infrastructure-alerts</p>
                </div>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border border-border">
              <div className="flex items-center gap-3">
                <Webhook className="h-5 w-5 text-primary" />
                <div>
                  <Label>Webhook</Label>
                  <p className="text-sm text-muted-foreground">https://api.company.com/alerts</p>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default XClarityAlerts;
