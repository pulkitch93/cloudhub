import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';
import { dashboardApi } from '@/services/dashboardApi';
import { useDashboard } from '@/contexts/DashboardContext';
import { Aggregate } from '@/types/dashboard';

const TrendCharts = () => {
  const { filters } = useDashboard();
  const [data, setData] = useState<Aggregate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const days = filters.timeRange === '1d' ? 1 : filters.timeRange === '7d' ? 7 : filters.timeRange === '30d' ? 30 : 90;
      const to = new Date().toISOString();
      const from = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
      const metrics = await dashboardApi.getMetrics(from, to);
      setData(metrics);
      setLoading(false);
    };
    fetchData();
  }, [filters]);

  if (loading) {
    return <div className="h-80 animate-pulse bg-muted rounded-lg" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trends Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="usage" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="cost">Cost</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="usage" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Area type="monotone" dataKey="computeHours" stroke="hsl(var(--primary))" fill="hsl(var(--primary) / 0.2)" name="Compute Hours" />
                <Area type="monotone" dataKey="storageTB" stroke="hsl(var(--success))" fill="hsl(var(--success) / 0.2)" name="Storage (TB)" />
                <Area type="monotone" dataKey="egressGB" stroke="hsl(var(--warning))" fill="hsl(var(--warning) / 0.2)" name="Egress (GB)" />
              </AreaChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="cost" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Line type="monotone" dataKey="totalCost" stroke="hsl(var(--primary))" strokeWidth={2} name="Total Cost ($)" />
              </LineChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="alerts" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                <Legend />
                <Bar dataKey="alertsCount" fill="hsl(var(--destructive))" name="Alerts" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TrendCharts;
