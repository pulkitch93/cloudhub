import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  RotateCcw, 
  Trash2, 
  Network,
  Activity 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RemediationAction {
  id: string;
  deviceId: string;
  deviceName: string;
  issue: string;
  action: 'restart' | 'cleanup' | 'reroute';
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startTime?: Date;
  endTime?: Date;
}

const EdgeIncidentResponse = () => {
  const [actions, setActions] = useState<RemediationAction[]>([
    {
      id: 'action-1',
      deviceId: 'edge-003',
      deviceName: 'Edge Server Gamma',
      issue: 'High CPU utilization (92%)',
      action: 'cleanup',
      status: 'pending',
      progress: 0,
    },
  ]);
  const { toast } = useToast();

  const triggerRemediation = (deviceId: string, issue: string, actionType: RemediationAction['action']) => {
    const newAction: RemediationAction = {
      id: `action-${Date.now()}`,
      deviceId,
      deviceName: `Edge Node ${deviceId}`,
      issue,
      action: actionType,
      status: 'pending',
      progress: 0,
    };

    setActions((prev) => [newAction, ...prev]);
    executeRemediation(newAction.id);
  };

  const executeRemediation = (actionId: string) => {
    setActions((prev) =>
      prev.map((action) =>
        action.id === actionId
          ? { ...action, status: 'running', startTime: new Date() }
          : action
      )
    );

    // Simulate remediation progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      
      if (progress >= 100) {
        clearInterval(interval);
        setActions((prev) =>
          prev.map((action) =>
            action.id === actionId
              ? { 
                  ...action, 
                  status: Math.random() > 0.1 ? 'completed' : 'failed', 
                  progress: 100,
                  endTime: new Date() 
                }
              : action
          )
        );

        const action = actions.find((a) => a.id === actionId);
        if (action) {
          toast({
            title: 'Remediation Complete',
            description: `${action.action} action completed for ${action.deviceName}`,
          });
        }
      } else {
        setActions((prev) =>
          prev.map((action) =>
            action.id === actionId
              ? { ...action, progress }
              : action
          )
        );
      }
    }, 1000);
  };

  const retryAction = (actionId: string) => {
    setActions((prev) =>
      prev.map((action) =>
        action.id === actionId
          ? { ...action, status: 'pending', progress: 0, startTime: undefined, endTime: undefined }
          : action
      )
    );
    executeRemediation(actionId);
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'restart':
        return <RotateCcw className="h-4 w-4" />;
      case 'cleanup':
        return <Trash2 className="h-4 w-4" />;
      case 'reroute':
        return <Network className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Completed</Badge>;
      case 'running':
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">Running</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Failed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="bg-card border-border">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Automated Incident Response</h3>
            <p className="text-sm text-muted-foreground">
              Automated remediation workflows for common issues
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => triggerRemediation('edge-004', 'Service unresponsive', 'restart')}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Test Restart
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => triggerRemediation('edge-002', 'Disk space low', 'cleanup')}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Test Cleanup
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => triggerRemediation('edge-001', 'Network congestion', 'reroute')}
            className="gap-2"
          >
            <Network className="h-4 w-4" />
            Test Reroute
          </Button>
        </div>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="p-6 space-y-4">
          {actions.map((action) => (
            <div key={action.id} className="p-4 rounded-lg border border-border bg-card">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getActionIcon(action.action)}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{action.deviceName}</span>
                      {getStatusBadge(action.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{action.issue}</p>
                    <p className="text-xs text-muted-foreground capitalize">
                      Action: {action.action}
                    </p>
                  </div>
                </div>
                {action.status === 'failed' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => retryAction(action.id)}
                  >
                    Retry
                  </Button>
                )}
              </div>

              {(action.status === 'running' || action.status === 'pending') && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="text-foreground">{action.progress}%</span>
                  </div>
                  <Progress value={action.progress} className="h-2" />
                </div>
              )}

              {action.status === 'completed' && (
                <div className="flex items-center gap-2 text-sm text-green-500">
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    Completed in {action.startTime && action.endTime 
                      ? Math.round((action.endTime.getTime() - action.startTime.getTime()) / 1000) 
                      : 0}s
                  </span>
                </div>
              )}

              {action.startTime && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <Clock className="h-3 w-3" />
                  <span>{action.startTime.toLocaleTimeString()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-6 border-t border-border">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-foreground">
              {actions.filter((a) => a.status === 'completed').length}
            </p>
            <p className="text-sm text-muted-foreground">Successful</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {actions.filter((a) => a.status === 'running').length}
            </p>
            <p className="text-sm text-muted-foreground">In Progress</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {actions.filter((a) => a.status === 'failed').length}
            </p>
            <p className="text-sm text-muted-foreground">Failed</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default EdgeIncidentResponse;
