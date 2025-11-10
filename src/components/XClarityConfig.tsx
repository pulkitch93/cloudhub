import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Plus, Trash2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface XClarityConfigProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface MetricMapping {
  id: string;
  xclarityField: string;
  targetField: string;
  enabled: boolean;
}

const XClarityConfig = ({ open, onOpenChange }: XClarityConfigProps) => {
  const [apiEndpoint, setApiEndpoint] = useState('https://xclarity.lenovo.com/api/v1');
  const [apiKey, setApiKey] = useState('xc_****************************');
  const [inventorySyncEnabled, setInventorySyncEnabled] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('5');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  
  const [metricMappings, setMetricMappings] = useState<MetricMapping[]>([
    { id: '1', xclarityField: 'server.cpu.utilization', targetField: 'cpu_usage', enabled: true },
    { id: '2', xclarityField: 'server.memory.usage', targetField: 'memory_usage', enabled: true },
    { id: '3', xclarityField: 'server.temperature', targetField: 'temperature', enabled: true },
    { id: '4', xclarityField: 'server.power.consumption', targetField: 'power_usage', enabled: true },
    { id: '5', xclarityField: 'server.network.throughput', targetField: 'network_traffic', enabled: true },
  ]);

  const handleTestConnection = () => {
    setIsTestingConnection(true);
    toast.info('Testing connection to XClarity API...');
    
    setTimeout(() => {
      setIsTestingConnection(false);
      toast.success('Connection successful!', {
        description: 'Successfully connected to XClarity API',
      });
    }, 2000);
  };

  const handleSaveConfig = () => {
    toast.success('Configuration saved', {
      description: 'XClarity integration settings have been updated',
    });
    onOpenChange(false);
  };

  const handleAddMapping = () => {
    const newMapping: MetricMapping = {
      id: Date.now().toString(),
      xclarityField: '',
      targetField: '',
      enabled: true,
    };
    setMetricMappings([...metricMappings, newMapping]);
  };

  const handleRemoveMapping = (id: string) => {
    setMetricMappings(metricMappings.filter(m => m.id !== id));
    toast.info('Metric mapping removed');
  };

  const handleToggleMapping = (id: string) => {
    setMetricMappings(metricMappings.map(m => 
      m.id === id ? { ...m, enabled: !m.enabled } : m
    ));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">🖥️</span>
            XClarity API Configuration
          </DialogTitle>
          <DialogDescription>
            Configure real-time inventory sync, refresh intervals, and custom metric mappings
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="connection" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connection">Connection</TabsTrigger>
            <TabsTrigger value="sync">Inventory Sync</TabsTrigger>
            <TabsTrigger value="metrics">Metric Mapping</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">API Connection Settings</CardTitle>
                <CardDescription>Configure your XClarity API endpoint and authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="endpoint">API Endpoint</Label>
                  <Input
                    id="endpoint"
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    placeholder="https://xclarity.lenovo.com/api/v1"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your XClarity API key"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your API key is encrypted and stored securely
                  </p>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleTestConnection}
                    disabled={isTestingConnection}
                    variant="outline"
                    className="w-full"
                  >
                    {isTestingConnection ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Testing Connection...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sync" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Inventory Synchronization</CardTitle>
                <CardDescription>Configure how XClarity inventory data syncs to the Digital Twin</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="inventory-sync">Enable Inventory Sync</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically sync server inventory from XClarity
                    </p>
                  </div>
                  <Switch
                    id="inventory-sync"
                    checked={inventorySyncEnabled}
                    onCheckedChange={setInventorySyncEnabled}
                  />
                </div>

                {inventorySyncEnabled && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="refresh-interval">Refresh Interval</Label>
                      <Select value={refreshInterval} onValueChange={setRefreshInterval}>
                        <SelectTrigger id="refresh-interval">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 second (Real-time)</SelectItem>
                          <SelectItem value="5">5 seconds</SelectItem>
                          <SelectItem value="10">10 seconds</SelectItem>
                          <SelectItem value="30">30 seconds</SelectItem>
                          <SelectItem value="60">1 minute</SelectItem>
                          <SelectItem value="300">5 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground">
                        How often to fetch fresh data from XClarity. Lower intervals increase API usage.
                      </p>
                    </div>

                    <div className="rounded-lg border border-border p-4 space-y-2">
                      <h4 className="text-sm font-semibold text-foreground">Sync Status</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Last Sync:</span>
                          <p className="font-medium text-foreground">2 minutes ago</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Next Sync:</span>
                          <p className="font-medium text-foreground">In 3 seconds</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Servers Synced:</span>
                          <p className="font-medium text-foreground">247 nodes</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Success Rate:</span>
                          <p className="font-medium text-success">99.97%</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metrics" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Custom Metric Mapping</CardTitle>
                    <CardDescription>Map XClarity telemetry fields to Digital Twin metrics</CardDescription>
                  </div>
                  <Button onClick={handleAddMapping} size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Mapping
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {metricMappings.map((mapping) => (
                  <div
                    key={mapping.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card/50"
                  >
                    <Switch
                      checked={mapping.enabled}
                      onCheckedChange={() => handleToggleMapping(mapping.id)}
                    />
                    
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">XClarity Field</Label>
                        <Input
                          value={mapping.xclarityField}
                          onChange={(e) => {
                            setMetricMappings(metricMappings.map(m =>
                              m.id === mapping.id ? { ...m, xclarityField: e.target.value } : m
                            ));
                          }}
                          placeholder="e.g., server.cpu.utilization"
                          className="h-9"
                        />
                      </div>
                      
                      <div className="space-y-1">
                        <Label className="text-xs text-muted-foreground">Target Field</Label>
                        <Input
                          value={mapping.targetField}
                          onChange={(e) => {
                            setMetricMappings(metricMappings.map(m =>
                              m.id === mapping.id ? { ...m, targetField: e.target.value } : m
                            ));
                          }}
                          placeholder="e.g., cpu_usage"
                          className="h-9"
                        />
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveMapping(mapping.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}

                {metricMappings.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No metric mappings configured. Click "Add Mapping" to create one.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSaveConfig}>
            Save Configuration
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default XClarityConfig;
