import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  ArrowRight, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Wifi,
  Network
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface NetworkConnection {
  id: string;
  source: string;
  target: string;
  sourceName: string;
  targetName: string;
  bandwidth: number; // Mbps
  utilization: number; // percentage
  packetLoss: number; // percentage
  latency: number; // ms
  status: 'healthy' | 'warning' | 'critical';
}

interface TrafficData {
  timestamp: string;
  inbound: number;
  outbound: number;
  packetLoss: number;
}

const NetworkTrafficVisualizer = () => {
  const [connections, setConnections] = useState<NetworkConnection[]>([
    {
      id: 'conn-1',
      source: 'edge-001',
      target: 'edge-002',
      sourceName: '5G Node Alpha',
      targetName: 'IoT Gateway Beta',
      bandwidth: 1000,
      utilization: 68,
      packetLoss: 0.2,
      latency: 12,
      status: 'healthy',
    },
    {
      id: 'conn-2',
      source: 'edge-002',
      target: 'edge-003',
      sourceName: 'IoT Gateway Beta',
      targetName: 'Edge Server Gamma',
      bandwidth: 1000,
      utilization: 85,
      packetLoss: 1.8,
      latency: 28,
      status: 'warning',
    },
    {
      id: 'conn-3',
      source: 'edge-003',
      target: 'edge-004',
      sourceName: 'Edge Server Gamma',
      targetName: '5G Node Delta',
      bandwidth: 1000,
      utilization: 92,
      packetLoss: 3.2,
      latency: 45,
      status: 'critical',
    },
    {
      id: 'conn-4',
      source: 'edge-001',
      target: 'edge-004',
      sourceName: '5G Node Alpha',
      targetName: '5G Node Delta',
      bandwidth: 1000,
      utilization: 45,
      packetLoss: 0.1,
      latency: 8,
      status: 'healthy',
    },
  ]);

  const [trafficHistory, setTrafficHistory] = useState<TrafficData[]>([
    { timestamp: '00:00', inbound: 450, outbound: 380, packetLoss: 0.2 },
    { timestamp: '04:00', inbound: 520, outbound: 420, packetLoss: 0.3 },
    { timestamp: '08:00', inbound: 680, outbound: 590, packetLoss: 0.5 },
    { timestamp: '12:00', inbound: 750, outbound: 640, packetLoss: 0.8 },
    { timestamp: '16:00', inbound: 820, outbound: 710, packetLoss: 1.2 },
    { timestamp: '20:00', inbound: 780, outbound: 680, packetLoss: 1.0 },
  ]);

  const [selectedConnection, setSelectedConnection] = useState<NetworkConnection | null>(null);

  useEffect(() => {
    // Simulate real-time traffic updates
    const interval = setInterval(() => {
      setConnections((prev) =>
        prev.map((conn) => ({
          ...conn,
          utilization: Math.min(100, Math.max(20, conn.utilization + (Math.random() - 0.5) * 10)),
          packetLoss: Math.max(0, conn.packetLoss + (Math.random() - 0.5) * 0.5),
          latency: Math.max(5, conn.latency + (Math.random() - 0.5) * 5),
          status: 
            conn.utilization > 90 || conn.packetLoss > 2.5 ? 'critical' :
            conn.utilization > 75 || conn.packetLoss > 1.5 ? 'warning' : 'healthy',
        }))
      );

      setTrafficHistory((prev) => {
        const latest = prev[prev.length - 1];
        const newEntry: TrafficData = {
          timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          inbound: Math.max(200, latest.inbound + (Math.random() - 0.5) * 100),
          outbound: Math.max(200, latest.outbound + (Math.random() - 0.5) * 80),
          packetLoss: Math.max(0, latest.packetLoss + (Math.random() - 0.5) * 0.3),
        };
        return [...prev.slice(-19), newEntry];
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'critical':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Warning</Badge>;
      case 'critical':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Critical</Badge>;
      default:
        return null;
    }
  };

  const totalBandwidth = connections.reduce((sum, conn) => sum + (conn.bandwidth * conn.utilization / 100), 0);
  const avgPacketLoss = connections.reduce((sum, conn) => sum + conn.packetLoss, 0) / connections.length;
  const criticalConnections = connections.filter((c) => c.status === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-primary" />
            <Badge variant="outline">{connections.length} Links</Badge>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalBandwidth.toFixed(0)} Mbps</p>
          <p className="text-sm text-muted-foreground">Total Throughput</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <Network className="h-5 w-5 text-primary" />
            <Badge variant="outline">Real-time</Badge>
          </div>
          <p className="text-2xl font-bold text-foreground">{avgPacketLoss.toFixed(2)}%</p>
          <p className="text-sm text-muted-foreground">Avg Packet Loss</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <Wifi className="h-5 w-5 text-primary" />
            <Badge variant="outline">Active</Badge>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {connections.filter((c) => c.status === 'healthy').length}
          </p>
          <p className="text-sm text-muted-foreground">Healthy Connections</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <Badge variant="outline">{criticalConnections} Alerts</Badge>
          </div>
          <p className="text-2xl font-bold text-foreground">{criticalConnections}</p>
          <p className="text-sm text-muted-foreground">Critical Links</p>
        </Card>
      </div>

      {/* Connection Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Active Connections</h3>
            <p className="text-sm text-muted-foreground">Real-time network link status</p>
          </div>
          <div className="p-6 space-y-4 max-h-[500px] overflow-auto">
            {connections.map((conn) => (
              <div
                key={conn.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedConnection?.id === conn.id
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedConnection(conn)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-sm font-medium text-foreground truncate">
                      {conn.sourceName}
                    </span>
                    <ArrowRight className={`h-4 w-4 ${getStatusColor(conn.status)}`} />
                    <span className="text-sm font-medium text-foreground truncate">
                      {conn.targetName}
                    </span>
                  </div>
                  {getStatusBadge(conn.status)}
                </div>

                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="text-muted-foreground mb-1">Utilization</p>
                    <p className="font-medium text-foreground">{conn.utilization.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Packet Loss</p>
                    <p className="font-medium text-foreground">{conn.packetLoss.toFixed(2)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground mb-1">Latency</p>
                    <p className="font-medium text-foreground">{conn.latency.toFixed(0)}ms</p>
                  </div>
                </div>

                <div className="mt-3">
                  <Progress value={conn.utilization} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Selected Connection Details */}
        {selectedConnection ? (
          <div className="space-y-6">
            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Connection Details</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Route</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">{selectedConnection.sourceName}</span>
                    <ArrowRight className="h-4 w-4" />
                    <span className="text-sm font-medium text-foreground">{selectedConnection.targetName}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Bandwidth Utilization</span>
                      <span className="text-foreground">
                        {(selectedConnection.bandwidth * selectedConnection.utilization / 100).toFixed(0)} / {selectedConnection.bandwidth} Mbps
                      </span>
                    </div>
                    <Progress value={selectedConnection.utilization} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Packet Loss</span>
                      <span className={selectedConnection.packetLoss > 2 ? 'text-red-500' : 'text-foreground'}>
                        {selectedConnection.packetLoss.toFixed(2)}%
                      </span>
                    </div>
                    <Progress 
                      value={Math.min(100, selectedConnection.packetLoss * 20)} 
                      className="h-2"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Latency</span>
                      <span className="text-foreground">{selectedConnection.latency.toFixed(0)}ms</span>
                    </div>
                    <Progress value={(selectedConnection.latency / 100) * 100} className="h-2" />
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Status</span>
                    {getStatusBadge(selectedConnection.status)}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="bg-card border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">QoS Metrics</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">Jitter</span>
                  <span className="text-sm font-medium text-foreground">2.3ms</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">Retransmissions</span>
                  <span className="text-sm font-medium text-foreground">0.8%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">Throughput</span>
                  <span className="text-sm font-medium text-foreground">
                    {(selectedConnection.bandwidth * selectedConnection.utilization / 100).toFixed(0)} Mbps
                  </span>
                </div>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="bg-card border-border p-6 flex items-center justify-center h-full">
            <div className="text-center">
              <Network className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">Select a connection to view details</p>
            </div>
          </Card>
        )}
      </div>

      {/* Traffic History */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Network Traffic Trends</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficHistory}>
              <defs>
                <linearGradient id="inboundGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="outboundGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
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
                dataKey="inbound" 
                stroke="hsl(var(--primary))" 
                fill="url(#inboundGradient)"
                name="Inbound (Mbps)"
              />
              <Area 
                type="monotone" 
                dataKey="outbound" 
                stroke="hsl(var(--chart-2))" 
                fill="url(#outboundGradient)"
                name="Outbound (Mbps)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default NetworkTrafficVisualizer;
