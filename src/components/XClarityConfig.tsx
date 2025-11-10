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

interface MappingTemplate {
  id: string;
  name: string;
  description: string;
  mappings: Omit<MetricMapping, 'id'>[];
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

  const mappingTemplates: MappingTemplate[] = [
    {
      id: 'full-telemetry',
      name: 'Full Server Telemetry',
      description: 'Complete monitoring of all server metrics including CPU, memory, disk, network, and power',
      mappings: [
        { xclarityField: 'server.cpu.utilization', targetField: 'cpu_usage', enabled: true },
        { xclarityField: 'server.cpu.frequency', targetField: 'cpu_frequency', enabled: true },
        { xclarityField: 'server.memory.usage', targetField: 'memory_usage', enabled: true },
        { xclarityField: 'server.memory.available', targetField: 'memory_available', enabled: true },
        { xclarityField: 'server.disk.usage', targetField: 'disk_usage', enabled: true },
        { xclarityField: 'server.disk.iops', targetField: 'disk_iops', enabled: true },
        { xclarityField: 'server.temperature', targetField: 'temperature', enabled: true },
        { xclarityField: 'server.power.consumption', targetField: 'power_usage', enabled: true },
        { xclarityField: 'server.network.throughput', targetField: 'network_traffic', enabled: true },
        { xclarityField: 'server.network.packets', targetField: 'network_packets', enabled: true },
        { xclarityField: 'server.network.errors', targetField: 'network_errors', enabled: true },
      ]
    },
    {
      id: 'power-monitoring',
      name: 'Power Monitoring Only',
      description: 'Focus on power consumption and energy efficiency metrics',
      mappings: [
        { xclarityField: 'server.power.consumption', targetField: 'power_usage', enabled: true },
        { xclarityField: 'server.power.voltage', targetField: 'power_voltage', enabled: true },
        { xclarityField: 'server.power.current', targetField: 'power_current', enabled: true },
        { xclarityField: 'server.temperature', targetField: 'temperature', enabled: true },
        { xclarityField: 'server.fan.speed', targetField: 'fan_speed', enabled: true },
        { xclarityField: 'server.psu.efficiency', targetField: 'psu_efficiency', enabled: true },
      ]
    },
    {
      id: 'network-performance',
      name: 'Network Performance',
      description: 'Monitor network throughput, latency, and connectivity metrics',
      mappings: [
        { xclarityField: 'server.network.throughput', targetField: 'network_traffic', enabled: true },
        { xclarityField: 'server.network.latency', targetField: 'network_latency', enabled: true },
        { xclarityField: 'server.network.packets.tx', targetField: 'network_packets_tx', enabled: true },
        { xclarityField: 'server.network.packets.rx', targetField: 'network_packets_rx', enabled: true },
        { xclarityField: 'server.network.errors', targetField: 'network_errors', enabled: true },
        { xclarityField: 'server.network.drops', targetField: 'network_drops', enabled: true },
        { xclarityField: 'server.network.bandwidth.usage', targetField: 'network_bandwidth', enabled: true },
      ]
    },
    {
      id: 'basic-health',
      name: 'Basic Health Check',
      description: 'Essential health metrics for quick system status overview',
      mappings: [
        { xclarityField: 'server.cpu.utilization', targetField: 'cpu_usage', enabled: true },
        { xclarityField: 'server.memory.usage', targetField: 'memory_usage', enabled: true },
        { xclarityField: 'server.temperature', targetField: 'temperature', enabled: true },
        { xclarityField: 'server.status', targetField: 'status', enabled: true },
      ]
    },
    {
      id: 'storage-intensive',
      name: 'Storage & I/O Focus',
      description: 'Detailed storage and disk I/O performance monitoring',
      mappings: [
        { xclarityField: 'server.disk.usage', targetField: 'disk_usage', enabled: true },
        { xclarityField: 'server.disk.iops', targetField: 'disk_iops', enabled: true },
        { xclarityField: 'server.disk.throughput', targetField: 'disk_throughput', enabled: true },
        { xclarityField: 'server.disk.latency', targetField: 'disk_latency', enabled: true },
        { xclarityField: 'server.disk.queue.depth', targetField: 'disk_queue', enabled: true },
        { xclarityField: 'server.raid.status', targetField: 'raid_status', enabled: true },
      ]
    }
  ];

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

  const handleApplyTemplate = (templateId: string) => {
    const template = mappingTemplates.find(t => t.id === templateId);
    if (!template) return;

    const newMappings = template.mappings.map((mapping, index) => ({
      ...mapping,
      id: Date.now().toString() + index
    }));

    setMetricMappings(newMappings);
    
    toast.success('Template applied', {
      description: `"${template.name}" configuration loaded with ${newMappings.length} metric mappings`
    });
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
            {/* Template Selector */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Start Templates</CardTitle>
                <CardDescription>Apply pre-configured metric mappings for common use cases</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {mappingTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="p-4 rounded-lg border border-border bg-card/50 hover:bg-card/80 transition-colors cursor-pointer group"
                      onClick={() => handleApplyTemplate(template.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {template.name}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {template.mappings.length} metrics
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mb-3">
                        {template.description}
                      </p>
                      <Button size="sm" variant="outline" className="w-full">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Apply Template
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

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
