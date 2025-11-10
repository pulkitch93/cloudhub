import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Zap, Play, Pause, Plus, Trash2, Activity, Server, RefreshCw, Move } from 'lucide-react';
import { toast } from 'sonner';

interface RemediationWorkflow {
  id: string;
  name: string;
  enabled: boolean;
  trigger: {
    metric: 'failure_probability' | 'cpu' | 'memory' | 'temperature';
    threshold: number;
    condition: 'above' | 'below';
  };
  actions: RemediationAction[];
  executionCount: number;
  lastExecuted?: string;
}

interface RemediationAction {
  id: string;
  type: 'restart' | 'scale' | 'migrate' | 'alert' | 'snapshot';
  config: {
    target?: string;
    scaleAmount?: number;
    destination?: string;
    notifyChannels?: string[];
  };
}

const AutomatedRemediation = () => {
  const [workflows, setWorkflows] = useState<RemediationWorkflow[]>([
    {
      id: '1',
      name: 'High Failure Risk Auto-Migration',
      enabled: true,
      trigger: {
        metric: 'failure_probability',
        threshold: 80,
        condition: 'above'
      },
      actions: [
        {
          id: 'a1',
          type: 'snapshot',
          config: { target: 'current_state' }
        },
        {
          id: 'a2',
          type: 'migrate',
          config: { destination: 'standby_server' }
        },
        {
          id: 'a3',
          type: 'alert',
          config: { notifyChannels: ['email', 'slack'] }
        }
      ],
      executionCount: 12,
      lastExecuted: '2 days ago'
    },
    {
      id: '2',
      name: 'CPU Overload Scale-Up',
      enabled: true,
      trigger: {
        metric: 'cpu',
        threshold: 90,
        condition: 'above'
      },
      actions: [
        {
          id: 'b1',
          type: 'scale',
          config: { scaleAmount: 2 }
        },
        {
          id: 'b2',
          type: 'alert',
          config: { notifyChannels: ['slack'] }
        }
      ],
      executionCount: 8,
      lastExecuted: '5 hours ago'
    },
    {
      id: '3',
      name: 'Critical Temperature Service Restart',
      enabled: false,
      trigger: {
        metric: 'temperature',
        threshold: 75,
        condition: 'above'
      },
      actions: [
        {
          id: 'c1',
          type: 'restart',
          config: { target: 'affected_service' }
        }
      ],
      executionCount: 3,
      lastExecuted: '1 week ago'
    }
  ]);

  const getActionIcon = (type: RemediationAction['type']) => {
    switch (type) {
      case 'restart': return <RefreshCw className="h-4 w-4" />;
      case 'scale': return <Activity className="h-4 w-4" />;
      case 'migrate': return <Move className="h-4 w-4" />;
      case 'alert': return <Zap className="h-4 w-4" />;
      case 'snapshot': return <Server className="h-4 w-4" />;
    }
  };

  const getActionLabel = (action: RemediationAction) => {
    switch (action.type) {
      case 'restart': return `Restart ${action.config.target || 'service'}`;
      case 'scale': return `Scale by ${action.config.scaleAmount || 1}x`;
      case 'migrate': return `Migrate to ${action.config.destination || 'backup'}`;
      case 'alert': return `Send alerts to ${action.config.notifyChannels?.join(', ') || 'channels'}`;
      case 'snapshot': return 'Take snapshot';
    }
  };

  const handleToggleWorkflow = (id: string) => {
    setWorkflows(workflows.map(w => 
      w.id === id ? { ...w, enabled: !w.enabled } : w
    ));
    
    const workflow = workflows.find(w => w.id === id);
    toast.success(
      workflow?.enabled ? 'Workflow disabled' : 'Workflow enabled',
      { description: workflow?.name }
    );
  };

  const handleExecuteWorkflow = (id: string) => {
    const workflow = workflows.find(w => w.id === id);
    if (!workflow) return;

    toast.info('Executing workflow...', {
      description: `Running ${workflow.actions.length} automated actions`
    });

    setTimeout(() => {
      setWorkflows(workflows.map(w =>
        w.id === id
          ? { ...w, executionCount: w.executionCount + 1, lastExecuted: 'Just now' }
          : w
      ));
      
      toast.success('Workflow completed', {
        description: `All ${workflow.actions.length} actions executed successfully`
      });
    }, 2000);
  };

  const handleDeleteWorkflow = (id: string) => {
    setWorkflows(workflows.filter(w => w.id !== id));
    toast.info('Workflow deleted');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Automated Remediation Workflows
            </CardTitle>
            <CardDescription>
              Execute predefined actions automatically when AI predictions exceed thresholds
            </CardDescription>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New Workflow
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-card/50 border border-border">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Active Workflows</div>
            <div className="text-2xl font-bold text-foreground">
              {workflows.filter(w => w.enabled).length}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Total Executions</div>
            <div className="text-2xl font-bold text-foreground">
              {workflows.reduce((sum, w) => sum + w.executionCount, 0)}
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Success Rate</div>
            <div className="text-2xl font-bold text-success">98.5%</div>
          </div>
        </div>

        {/* Workflows List */}
        <div className="space-y-4">
          {workflows.map((workflow) => (
            <div
              key={workflow.id}
              className="p-4 rounded-lg border border-border bg-card/50 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <Switch
                    checked={workflow.enabled}
                    onCheckedChange={() => handleToggleWorkflow(workflow.id)}
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-foreground mb-1">{workflow.name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>Executed {workflow.executionCount} times</span>
                      {workflow.lastExecuted && (
                        <>
                          <span>•</span>
                          <span>Last: {workflow.lastExecuted}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {workflow.enabled && <Badge className="bg-success/10 text-success border-success/20">Active</Badge>}
                  {!workflow.enabled && <Badge variant="outline">Inactive</Badge>}
                </div>
              </div>

              <Separator />

              {/* Trigger Configuration */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-foreground">Trigger Condition:</div>
                <div className="flex items-center gap-2 text-sm p-3 rounded-lg bg-primary/5 border border-primary/20">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="text-foreground">
                    When <span className="font-semibold">{workflow.trigger.metric.replace('_', ' ')}</span> is{' '}
                    <span className="font-semibold">{workflow.trigger.condition}</span>{' '}
                    <span className="font-semibold">{workflow.trigger.threshold}%</span>
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-foreground">Automated Actions ({workflow.actions.length}):</div>
                <div className="space-y-2">
                  {workflow.actions.map((action, idx) => (
                    <div key={action.id} className="flex items-center gap-3 text-sm p-2 rounded bg-background/50">
                      <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center">
                        {idx + 1}
                      </Badge>
                      <div className="flex items-center gap-2 flex-1">
                        {getActionIcon(action.type)}
                        <span className="text-foreground">{getActionLabel(action)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button
                  size="sm"
                  onClick={() => handleExecuteWorkflow(workflow.id)}
                  disabled={!workflow.enabled}
                >
                  <Play className="h-3 w-3 mr-1" />
                  Execute Now
                </Button>
                <Button size="sm" variant="outline">
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteWorkflow(workflow.id)}
                >
                  <Trash2 className="h-3 w-3 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Execution History */}
        <Card className="bg-card/50">
          <CardHeader>
            <CardTitle className="text-sm">Recent Executions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-xs p-2 rounded bg-background/50">
              <div className="flex items-center gap-2">
                <Badge className="bg-success/10 text-success border-success/20">Success</Badge>
                <span className="text-foreground">High Failure Risk Auto-Migration</span>
              </div>
              <span className="text-muted-foreground">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between text-xs p-2 rounded bg-background/50">
              <div className="flex items-center gap-2">
                <Badge className="bg-success/10 text-success border-success/20">Success</Badge>
                <span className="text-foreground">CPU Overload Scale-Up</span>
              </div>
              <span className="text-muted-foreground">5 hours ago</span>
            </div>
            <div className="flex items-center justify-between text-xs p-2 rounded bg-background/50">
              <div className="flex items-center gap-2">
                <Badge className="bg-success/10 text-success border-success/20">Success</Badge>
                <span className="text-foreground">High Failure Risk Auto-Migration</span>
              </div>
              <span className="text-muted-foreground">1 day ago</span>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};

export default AutomatedRemediation;
