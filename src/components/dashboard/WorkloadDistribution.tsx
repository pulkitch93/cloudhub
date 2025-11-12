import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useEffect, useState } from 'react';
import { dashboardApi } from '@/services/dashboardApi';
import { useDashboard } from '@/contexts/DashboardContext';
import { Workload } from '@/types/dashboard';
import { Cloud } from 'lucide-react';

interface DistributionData {
  name: string;
  [key: string]: number | string;
}

const WorkloadDistribution = () => {
  const { filters } = useDashboard();
  const [workloads, setWorkloads] = useState<Workload[]>([]);
  const [loading, setLoading] = useState(true);
  const [byProvider, setByProvider] = useState<DistributionData[]>([]);
  const [byRegion, setByRegion] = useState<DistributionData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await dashboardApi.getWorkloads({
        tenantId: filters.tenantId,
        provider: filters.provider,
        region: filters.region,
      });
      setWorkloads(data);
      
      // Process data for provider distribution by region
      const regionMap = new Map<string, { [provider: string]: number }>();
      data.forEach(w => {
        if (!regionMap.has(w.region)) {
          regionMap.set(w.region, { AWS: 0, Azure: 0, GCP: 0, 'IBM Cloud': 0 });
        }
        const current = regionMap.get(w.region)!;
        current[w.provider] = (current[w.provider] || 0) + 1;
      });
      
      const providerData: DistributionData[] = Array.from(regionMap.entries()).map(([region, providers]) => ({
        name: region,
        ...providers,
      }));
      setByProvider(providerData);
      
      // Process data for region distribution by provider
      const providerMap = new Map<string, { [region: string]: number }>();
      data.forEach(w => {
        if (!providerMap.has(w.provider)) {
          providerMap.set(w.provider, {});
        }
        const current = providerMap.get(w.provider)!;
        current[w.region] = (current[w.region] || 0) + 1;
      });
      
      const regionData: DistributionData[] = Array.from(providerMap.entries()).map(([provider, regions]) => ({
        name: provider,
        ...regions,
      }));
      setByRegion(regionData);
      
      setLoading(false);
    };
    fetchData();
  }, [filters]);

  const providerColors = {
    AWS: '#FF9900',
    Azure: '#0078D4',
    GCP: '#4285F4',
    'IBM Cloud': '#0F62FE',
  };

  if (loading) {
    return <div className="h-96 animate-pulse bg-muted rounded-lg" />;
  }

  const totalWorkloads = workloads.length;
  const providerCounts = workloads.reduce((acc, w) => {
    acc[w.provider] = (acc[w.provider] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Workload Distribution
          </CardTitle>
          <div className="text-sm text-muted-foreground">
            Total: <span className="font-bold text-foreground">{totalWorkloads}</span> workloads
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Provider Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {Object.entries(providerCounts).map(([provider, count]) => (
            <div key={provider} className="p-3 bg-muted/30 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: providerColors[provider as keyof typeof providerColors] }}
                />
                <p className="text-xs font-medium text-muted-foreground">{provider}</p>
              </div>
              <p className="text-xl font-bold">{count}</p>
              <p className="text-xs text-muted-foreground">
                {((count / totalWorkloads) * 100).toFixed(1)}%
              </p>
            </div>
          ))}
        </div>

        <Tabs defaultValue="by-region" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="by-region">By Region</TabsTrigger>
            <TabsTrigger value="by-provider">By Provider</TabsTrigger>
          </TabsList>
          
          <TabsContent value="by-region" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byProvider}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Legend />
                {Object.entries(providerColors).map(([provider, color]) => (
                  <Bar
                    key={provider}
                    dataKey={provider}
                    stackId="a"
                    fill={color}
                    name={provider}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Workload distribution across regions grouped by cloud provider
            </p>
          </TabsContent>
          
          <TabsContent value="by-provider" className="mt-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={byRegion}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                  }}
                />
                <Legend />
                {byRegion.length > 0 && Object.keys(byRegion[0])
                  .filter(key => key !== 'name')
                  .map((region, idx) => (
                    <Bar
                      key={region}
                      dataKey={region}
                      stackId="a"
                      fill={`hsl(var(--chart-${(idx % 5) + 1}))`}
                      name={region}
                    />
                  ))}
              </BarChart>
            </ResponsiveContainer>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Workload distribution across providers grouped by region
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WorkloadDistribution;
