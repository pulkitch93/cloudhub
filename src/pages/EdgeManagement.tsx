import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Wifi, 
  Radio, 
  Shield, 
  Activity, 
  Zap, 
  Server, 
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Network
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import Header from '@/components/Header';

interface EdgeDevice {
  id: string;
  name: string;
  type: '5G' | 'IoT' | 'Edge';
  status: 'online' | 'warning' | 'offline';
  latency: number;
  cpu: number;
  memory: number;
  security: number;
  location: string;
  uptime: number;
}

interface LatencyData {
  timestamp: string;
  latency: number;
  threshold: number;
}

const EdgeManagement = () => {
  const [devices, setDevices] = useState<EdgeDevice[]>([
    {
      id: 'edge-001',
      name: '5G Node Alpha',
      type: '5G',
      status: 'online',
      latency: 12,
      cpu: 45,
      memory: 62,
      security: 98,
      location: 'US-East',
      uptime: 99.8
    },
    {
      id: 'edge-002',
      name: 'IoT Gateway Beta',
      type: 'IoT',
      status: 'online',
      latency: 28,
      cpu: 72,
      memory: 54,
      security: 95,
      location: 'EU-West',
      uptime: 99.5
    },
    {
      id: 'edge-003',
      name: 'Edge Server Gamma',
      type: 'Edge',
      status: 'warning',
      latency: 45,
      cpu: 85,
      memory: 78,
      security: 92,
      location: 'APAC',
      uptime: 98.2
    },
    {
      id: 'edge-004',
      name: '5G Node Delta',
      type: '5G',
      status: 'online',
      latency: 18,
      cpu: 38,
      memory: 41,
      security: 99,
      location: 'US-West',
      uptime: 99.9
    }
  ]);

  const [latencyData, setLatencyData] = useState<LatencyData[]>([
    { timestamp: '00:00', latency: 15, threshold: 50 },
    { timestamp: '04:00', latency: 22, threshold: 50 },
    { timestamp: '08:00', latency: 35, threshold: 50 },
    { timestamp: '12:00', latency: 28, threshold: 50 },
    { timestamp: '16:00', latency: 42, threshold: 50 },
    { timestamp: '20:00', latency: 31, threshold: 50 }
  ]);

  const [scalingData, setScalingData] = useState([
    { time: '00:00', usage: 45, predicted: 48, capacity: 100 },
    { time: '04:00', usage: 52, predicted: 58, capacity: 100 },
    { time: '08:00', usage: 68, predicted: 75, capacity: 100 },
    { time: '12:00', usage: 75, predicted: 82, capacity: 100 },
    { time: '16:00', usage: 71, predicted: 76, capacity: 100 },
    { time: '20:00', usage: 62, predicted: 65, capacity: 100 }
  ]);

  const [provisioningStatus, setProvisioningStatus] = useState({
    inProgress: false,
    progress: 0,
    currentStep: '',
    timeRemaining: 0
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'offline':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Online</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Warning</Badge>;
      case 'offline':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Offline</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const startZeroTouchProvisioning = () => {
    setProvisioningStatus({
      inProgress: true,
      progress: 0,
      currentStep: 'Initializing provisioning...',
      timeRemaining: 8
    });

    const steps = [
      'Device discovery...',
      'Security validation...',
      'Network configuration...',
      'Firmware deployment...',
      'Service activation...',
      'Health check...',
      'Registration complete'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      const progress = (currentStep / steps.length) * 100;
      
      if (currentStep >= steps.length) {
        setProvisioningStatus({
          inProgress: false,
          progress: 100,
          currentStep: 'Provisioning complete!',
          timeRemaining: 0
        });
        clearInterval(interval);
      } else {
        setProvisioningStatus({
          inProgress: true,
          progress,
          currentStep: steps[currentStep],
          timeRemaining: 8 - currentStep
        });
      }
    }, 1000);
  };

  const avgLatency = devices.reduce((sum, d) => sum + d.latency, 0) / devices.length;
  const criticalDevices = devices.filter(d => d.status === 'warning' || d.status === 'offline').length;
  const avgSecurity = devices.reduce((sum, d) => sum + d.security, 0) / devices.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Edge & 5G Management</h1>
            <p className="text-muted-foreground">Zero-touch provisioning, AI-based optimization, and predictive scaling for edge infrastructure</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-5 w-5 text-primary" />
                <Badge variant="outline">{devices.filter(d => d.status === 'online').length} Active</Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{avgLatency.toFixed(1)}ms</p>
              <p className="text-sm text-muted-foreground">Avg Latency</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-green-500">
                <CheckCircle className="h-3 w-3" />
                <span>Within SLA</span>
              </div>
            </Card>

            <Card className="bg-card border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <Server className="h-5 w-5 text-primary" />
                <Badge variant="outline">{devices.length} Total</Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{devices.filter(d => d.status === 'online').length}</p>
              <p className="text-sm text-muted-foreground">Online Nodes</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span>99.6% uptime</span>
              </div>
            </Card>

            <Card className="bg-card border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <Shield className="h-5 w-5 text-primary" />
                <Badge variant="outline">Secure</Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{avgSecurity.toFixed(1)}%</p>
              <p className="text-sm text-muted-foreground">Security Score</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-green-500">
                <CheckCircle className="h-3 w-3" />
                <span>All compliant</span>
              </div>
            </Card>

            <Card className="bg-card border-border p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <Badge variant="outline">{criticalDevices} Alerts</Badge>
              </div>
              <p className="text-2xl font-bold text-foreground">{criticalDevices}</p>
              <p className="text-sm text-muted-foreground">Devices Need Attention</p>
              <div className="mt-2 flex items-center gap-1 text-xs text-yellow-500">
                <Activity className="h-3 w-3" />
                <span>Monitoring active</span>
              </div>
            </Card>
          </div>

          <Tabs defaultValue="devices" className="space-y-6">
            <TabsList className="bg-muted">
              <TabsTrigger value="devices">Device Health</TabsTrigger>
              <TabsTrigger value="provisioning">Zero-Touch Provisioning</TabsTrigger>
              <TabsTrigger value="latency">AI Latency Routing</TabsTrigger>
              <TabsTrigger value="scaling">Predictive Scaling</TabsTrigger>
            </TabsList>

            {/* Device Health Dashboard */}
            <TabsContent value="devices" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {devices.map((device) => (
                  <Card key={device.id} className="bg-card border-border p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {device.type === '5G' && <Radio className="h-5 w-5 text-primary" />}
                        {device.type === 'IoT' && <Wifi className="h-5 w-5 text-primary" />}
                        {device.type === 'Edge' && <Server className="h-5 w-5 text-primary" />}
                        <div>
                          <h3 className="font-semibold text-foreground">{device.name}</h3>
                          <p className="text-sm text-muted-foreground">{device.location}</p>
                        </div>
                      </div>
                      {getStatusBadge(device.status)}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Latency</span>
                          <span className={device.latency < 50 ? 'text-green-500' : 'text-yellow-500'}>
                            {device.latency}ms
                          </span>
                        </div>
                        <Progress value={(device.latency / 50) * 100} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">CPU Usage</span>
                          <span className={device.cpu < 80 ? 'text-foreground' : 'text-yellow-500'}>
                            {device.cpu}%
                          </span>
                        </div>
                        <Progress value={device.cpu} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Memory Usage</span>
                          <span className="text-foreground">{device.memory}%</span>
                        </div>
                        <Progress value={device.memory} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">Security Score</span>
                          <span className="text-green-500">{device.security}%</span>
                        </div>
                        <Progress value={device.security} className="h-2" />
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-sm text-muted-foreground">Uptime</span>
                        <span className="text-sm font-medium text-foreground">{device.uptime}%</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Zero-Touch Provisioning */}
            <TabsContent value="provisioning" className="space-y-6">
              <Card className="bg-card border-border p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Zero-Touch Provisioning</h3>
                    <p className="text-muted-foreground">Automatically provision new edge devices in under 10 minutes with zero manual configuration</p>
                  </div>

                  {!provisioningStatus.inProgress && provisioningStatus.progress === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <Zap className="h-12 w-12 text-primary" />
                      <Button onClick={startZeroTouchProvisioning} size="lg" className="gap-2">
                        <Network className="h-4 w-4" />
                        Start Provisioning
                      </Button>
                    </div>
                  )}

                  {(provisioningStatus.inProgress || provisioningStatus.progress > 0) && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-foreground">{provisioningStatus.currentStep}</span>
                        <span className="text-sm text-muted-foreground">{Math.round(provisioningStatus.progress)}%</span>
                      </div>
                      <Progress value={provisioningStatus.progress} className="h-3" />
                      
                      {provisioningStatus.inProgress && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>Estimated time remaining: {provisioningStatus.timeRemaining} minutes</span>
                        </div>
                      )}

                      {provisioningStatus.progress === 100 && (
                        <div className="flex items-center gap-2 text-sm text-green-500">
                          <CheckCircle className="h-4 w-4" />
                          <span>Device provisioned successfully in 7 minutes</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">7.2 min</p>
                      <p className="text-sm text-muted-foreground">Avg Provisioning Time</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">127</p>
                      <p className="text-sm text-muted-foreground">Devices Provisioned</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">99.2%</p>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* AI Latency Routing */}
            <TabsContent value="latency" className="space-y-6">
              <Card className="bg-card border-border p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">AI-Based Latency Routing</h3>
                    <p className="text-muted-foreground">Real-time network optimization maintaining latency under 50ms for critical workloads</p>
                  </div>

                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={latencyData}>
                        <defs>
                          <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="latency" 
                          stroke="hsl(var(--primary))" 
                          fill="url(#latencyGradient)"
                          name="Actual Latency (ms)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="threshold" 
                          stroke="hsl(var(--destructive))" 
                          strokeDasharray="5 5"
                          name="Threshold (50ms)"
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">SLA Compliance</p>
                        <p className="text-xs text-muted-foreground">100% within threshold</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Network className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">AI Routing</p>
                        <p className="text-xs text-muted-foreground">Active optimization</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                        <Activity className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">Network Health</p>
                        <p className="text-xs text-muted-foreground">Excellent</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            {/* Predictive Scaling */}
            <TabsContent value="scaling" className="space-y-6">
              <Card className="bg-card border-border p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">Predictive Edge Resource Scaling</h3>
                    <p className="text-muted-foreground">AI-powered predictions trigger scaling before reaching 80% resource utilization</p>
                  </div>

                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={scalingData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px'
                          }}
                        />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="usage" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                          name="Current Usage (%)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey="predicted" 
                          stroke="hsl(var(--chart-2))" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Predicted Usage (%)"
                        />
                        <Line 
                          type="monotone" 
                          dataKey={80} 
                          stroke="hsl(var(--destructive))" 
                          strokeDasharray="3 3"
                          name="Scale Threshold (80%)"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Scaling Event Predicted</p>
                      <p className="text-xs text-muted-foreground">System will auto-scale at 12:00 based on predicted 82% utilization</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">15</p>
                      <p className="text-sm text-muted-foreground">Auto-Scale Events</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">94%</p>
                      <p className="text-sm text-muted-foreground">Prediction Accuracy</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-foreground">0</p>
                      <p className="text-sm text-muted-foreground">Capacity Incidents</p>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default EdgeManagement;
