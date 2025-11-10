import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Activity, Clock, AlertTriangle, TrendingUp, Database, Zap } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface MonitoringMetrics {
  responseTime: number;
  syncLatency: number;
  errorRate: number;
  bandwidth: number;
  timestamp: string;
}

const XClarityMonitoring = () => {
  const [metrics, setMetrics] = useState<MonitoringMetrics[]>([]);
  const [currentMetrics, setCurrentMetrics] = useState({
    responseTime: 145,
    syncLatency: 89,
    errorRate: 0.2,
    bandwidth: 2.4,
    status: 'healthy' as 'healthy' | 'warning' | 'error'
  });

  // Simulate real-time metrics updates
  useEffect(() => {
    const generateMetric = (): MonitoringMetrics => ({
      responseTime: Math.floor(100 + Math.random() * 100),
      syncLatency: Math.floor(50 + Math.random() * 100),
      errorRate: Math.random() * 2,
      bandwidth: 1.5 + Math.random() * 2,
      timestamp: new Date().toLocaleTimeString()
    });

    // Initialize with historical data
    const initialData = Array.from({ length: 20 }, (_, i) => ({
      ...generateMetric(),
      timestamp: new Date(Date.now() - (20 - i) * 30000).toLocaleTimeString()
    }));
    setMetrics(initialData);

    // Update every 5 seconds
    const interval = setInterval(() => {
      const newMetric = generateMetric();
      
      setMetrics(prev => {
        const updated = [...prev.slice(-19), newMetric];
        return updated;
      });

      setCurrentMetrics({
        responseTime: newMetric.responseTime,
        syncLatency: newMetric.syncLatency,
        errorRate: newMetric.errorRate,
        bandwidth: newMetric.bandwidth,
        status: newMetric.errorRate > 1 ? 'warning' : 
                newMetric.responseTime > 200 ? 'warning' : 'healthy'
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-success';
      case 'warning': return 'text-warning';
      case 'error': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-success/10 text-success border-success/20">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Warning</Badge>;
      case 'error':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Response Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{currentMetrics.responseTime}ms</div>
            <p className="text-xs text-muted-foreground mt-1">Avg API latency</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4 text-primary" />
              Sync Latency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{currentMetrics.syncLatency}ms</div>
            <p className="text-xs text-muted-foreground mt-1">Data sync delay</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-primary" />
              Error Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{currentMetrics.errorRate.toFixed(2)}%</div>
            <p className="text-xs text-muted-foreground mt-1">Failed requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Bandwidth
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{currentMetrics.bandwidth.toFixed(1)} MB/s</div>
            <p className="text-xs text-muted-foreground mt-1">Network usage</p>
          </CardContent>
        </Card>
      </div>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Connection Status
              </CardTitle>
              <CardDescription>Real-time XClarity API connection health</CardDescription>
            </div>
            {getStatusBadge(currentMetrics.status)}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Uptime</span>
              <p className="font-medium text-foreground">99.97%</p>
            </div>
            <div>
              <span className="text-muted-foreground">Requests/min</span>
              <p className="font-medium text-foreground">247</p>
            </div>
            <div>
              <span className="text-muted-foreground">Success Rate</span>
              <p className="font-medium text-success">99.8%</p>
            </div>
            <div>
              <span className="text-muted-foreground">Avg Response</span>
              <p className="font-medium text-foreground">{currentMetrics.responseTime}ms</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Historical Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Historical Trends
          </CardTitle>
          <CardDescription>Last 10 minutes of XClarity API performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="response-time" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="response-time">Response Time</TabsTrigger>
              <TabsTrigger value="sync-latency">Sync Latency</TabsTrigger>
              <TabsTrigger value="error-rate">Error Rate</TabsTrigger>
              <TabsTrigger value="bandwidth">Bandwidth</TabsTrigger>
            </TabsList>

            <TabsContent value="response-time" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={metrics}>
                  <defs>
                    <linearGradient id="colorResponseTime" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    label={{ value: 'ms', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="responseTime" 
                    stroke="hsl(var(--primary))" 
                    fill="url(#colorResponseTime)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="sync-latency" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={metrics}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    label={{ value: 'ms', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="syncLatency" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="error-rate" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={metrics}>
                  <defs>
                    <linearGradient id="colorErrorRate" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    label={{ value: '%', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="errorRate" 
                    stroke="hsl(var(--destructive))" 
                    fill="url(#colorErrorRate)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="bandwidth" className="pt-4">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={metrics}>
                  <defs>
                    <linearGradient id="colorBandwidth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="timestamp" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    label={{ value: 'MB/s', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bandwidth" 
                    stroke="hsl(var(--primary))" 
                    fill="url(#colorBandwidth)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default XClarityMonitoring;
