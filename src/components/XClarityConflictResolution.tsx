import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertTriangle, CheckCircle2, XCircle, RefreshCw, GitCompare, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface DataConflict {
  id: string;
  serverId: string;
  serverName: string;
  field: string;
  xclarityValue: string | number;
  digitalTwinValue: string | number;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  autoResolvable: boolean;
}

interface ValidationError {
  id: string;
  serverId: string;
  serverName: string;
  issue: string;
  details: string;
  suggestion: string;
}

const XClarityConflictResolution = () => {
  const [conflicts, setConflicts] = useState<DataConflict[]>([
    {
      id: '1',
      serverId: 'srv-14',
      serverName: 'DB-Worker-03',
      field: 'Memory Capacity',
      xclarityValue: '128 GB',
      digitalTwinValue: '64 GB',
      timestamp: '2 minutes ago',
      severity: 'critical',
      autoResolvable: false
    },
    {
      id: '2',
      serverId: 'srv-22',
      serverName: 'Web-05',
      field: 'CPU Count',
      xclarityValue: 16,
      digitalTwinValue: 8,
      timestamp: '5 minutes ago',
      severity: 'warning',
      autoResolvable: true
    },
    {
      id: '3',
      serverId: 'srv-08',
      serverName: 'App-Server-02',
      field: 'Network Interface',
      xclarityValue: '10Gbps',
      digitalTwinValue: '1Gbps',
      timestamp: '12 minutes ago',
      severity: 'warning',
      autoResolvable: true
    },
    {
      id: '4',
      serverId: 'srv-31',
      serverName: 'Cache-01',
      field: 'Disk Configuration',
      xclarityValue: 'RAID 10',
      digitalTwinValue: 'RAID 5',
      timestamp: '1 hour ago',
      severity: 'info',
      autoResolvable: false
    }
  ]);

  const [validationErrors] = useState<ValidationError[]>([
    {
      id: 'v1',
      serverId: 'srv-45',
      serverName: 'Load-Balancer-02',
      issue: 'Missing XClarity Mapping',
      details: 'Server exists in AIOps but not found in XClarity inventory',
      suggestion: 'Verify server ID or manually map to XClarity device'
    },
    {
      id: 'v2',
      serverId: 'srv-67',
      serverName: 'Storage-Node-04',
      issue: 'Telemetry Data Timeout',
      details: 'No telemetry updates received for 15 minutes',
      suggestion: 'Check XClarity API connection and server health'
    },
    {
      id: 'v3',
      serverId: 'srv-89',
      serverName: 'Worker-Node-12',
      issue: 'Invalid Data Format',
      details: 'Temperature value outside acceptable range (150°C)',
      suggestion: 'Verify sensor calibration or data transmission'
    }
  ]);

  const [resolutionStrategy, setResolutionStrategy] = useState<'xclarity' | 'digital-twin' | 'manual'>('xclarity');

  const getSeverityBadge = (severity: DataConflict['severity']) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Critical</Badge>;
      case 'warning':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Warning</Badge>;
      case 'info':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Info</Badge>;
    }
  };

  const handleResolveConflict = (conflictId: string, resolution: 'xclarity' | 'digital-twin') => {
    const conflict = conflicts.find(c => c.id === conflictId);
    if (!conflict) return;

    const sourceValue = resolution === 'xclarity' ? conflict.xclarityValue : conflict.digitalTwinValue;
    
    setConflicts(conflicts.filter(c => c.id !== conflictId));
    
    toast.success('Conflict resolved', {
      description: `${conflict.field} updated to: ${sourceValue}`
    });
  };

  const handleAutoResolve = () => {
    const autoResolvableConflicts = conflicts.filter(c => c.autoResolvable);
    
    if (autoResolvableConflicts.length === 0) {
      toast.info('No auto-resolvable conflicts found');
      return;
    }

    setConflicts(conflicts.filter(c => !c.autoResolvable));
    
    toast.success('Auto-resolution complete', {
      description: `Resolved ${autoResolvableConflicts.length} conflicts using ${resolutionStrategy === 'xclarity' ? 'XClarity' : 'AIOps'} as source of truth`
    });
  };

  const handleResolveValidationError = (errorId: string) => {
    toast.info('Creating remediation task...', {
      description: 'Validation error marked for manual review'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="h-5 w-5" />
          Data Validation & Conflict Resolution
        </CardTitle>
        <CardDescription>
          Manage inventory data conflicts and validation errors between XClarity and AIOps
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="conflicts" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="conflicts" className="gap-2">
              <AlertTriangle className="h-4 w-4" />
              Conflicts ({conflicts.length})
            </TabsTrigger>
            <TabsTrigger value="validation" className="gap-2">
              <Shield className="h-4 w-4" />
              Validation ({validationErrors.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conflicts" className="space-y-4">
            {/* Auto-Resolution Controls */}
            <div className="flex items-center justify-between p-4 rounded-lg bg-card/50 border border-border">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-foreground">Auto-Resolve Strategy:</span>
                <Select value={resolutionStrategy} onValueChange={(v) => setResolutionStrategy(v as any)}>
                  <SelectTrigger className="w-52">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    <SelectItem value="xclarity">Prefer XClarity Data</SelectItem>
                    <SelectItem value="digital-twin">Prefer AIOps Data</SelectItem>
                    <SelectItem value="manual">Manual Review Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleAutoResolve}
                disabled={resolutionStrategy === 'manual' || conflicts.filter(c => c.autoResolvable).length === 0}
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Auto-Resolve ({conflicts.filter(c => c.autoResolvable).length})
              </Button>
            </div>

            {/* Conflicts List */}
            <div className="space-y-3">
              {conflicts.map((conflict) => (
                <div
                  key={conflict.id}
                  className="p-4 rounded-lg border border-border bg-card/50 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{conflict.serverName}</span>
                        {getSeverityBadge(conflict.severity)}
                        {conflict.autoResolvable && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Auto-resolvable
                          </Badge>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        ID: {conflict.serverId} • {conflict.timestamp}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">
                      Field: {conflict.field}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-primary"></div>
                          <span className="text-xs font-semibold text-primary">XClarity Value</span>
                        </div>
                        <div className="text-sm font-mono text-foreground">{conflict.xclarityValue}</div>
                      </div>
                      
                      <div className="p-3 rounded-lg bg-secondary/10 border border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-2 h-2 rounded-full bg-secondary"></div>
                          <span className="text-xs font-semibold text-muted-foreground">AIOps Value</span>
                        </div>
                        <div className="text-sm font-mono text-foreground">{conflict.digitalTwinValue}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2 border-t border-border">
                    <Button 
                      size="sm" 
                      onClick={() => handleResolveConflict(conflict.id, 'xclarity')}
                      className="flex-1"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Use XClarity
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleResolveConflict(conflict.id, 'digital-twin')}
                      className="flex-1"
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Use AIOps
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        setConflicts(conflicts.filter(c => c.id !== conflict.id));
                        toast.info('Conflict dismissed');
                      }}
                    >
                      <XCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}

              {conflicts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-success" />
                  <div className="font-medium">No conflicts detected</div>
                  <div className="text-sm">All inventory data is synchronized</div>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="validation" className="space-y-3">
            {validationErrors.map((error) => (
              <div
                key={error.id}
                className="p-4 rounded-lg border border-border bg-card/50 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                      <span className="font-semibold text-foreground">{error.issue}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {error.serverName} (ID: {error.serverId})
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Details: </span>
                    <span className="text-foreground">{error.details}</span>
                  </div>
                  <div className="p-2 rounded bg-primary/5 border border-primary/20">
                    <span className="text-xs text-muted-foreground">Suggestion: </span>
                    <span className="text-xs text-foreground">{error.suggestion}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2 border-t border-border">
                  <Button 
                    size="sm" 
                    onClick={() => handleResolveValidationError(error.id)}
                  >
                    Create Task
                  </Button>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="ghost">
                    Ignore
                  </Button>
                </div>
              </div>
            ))}

            {validationErrors.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto mb-3 text-success" />
                <div className="font-medium">All validation checks passed</div>
                <div className="text-sm">No data quality issues detected</div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default XClarityConflictResolution;
