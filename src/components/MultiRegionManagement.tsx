import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Globe, 
  RefreshCw, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Database,
  GitBranch,
  Zap,
  PlayCircle,
  StopCircle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface Region {
  id: string;
  name: string;
  location: string;
  status: 'active' | 'standby' | 'offline';
  isPrimary: boolean;
  devices: number;
  latency: number;
  uptime: number;
  lastSync: Date;
  replicationLag: number; // seconds
}

interface FailoverConfig {
  enabled: boolean;
  primaryRegion: string;
  failoverRegions: string[];
  triggerThreshold: number; // percentage
  autoFailback: boolean;
}

interface DisasterRecoveryPlan {
  id: string;
  name: string;
  type: 'manual' | 'automatic';
  rto: number; // Recovery Time Objective in minutes
  rpo: number; // Recovery Point Objective in minutes
  lastTested: Date;
  status: 'ready' | 'testing' | 'failed';
}

interface ReplicationStatus {
  sourceRegion: string;
  targetRegion: string;
  dataSize: number; // GB
  progress: number;
  lag: number;
  status: 'synced' | 'syncing' | 'error';
}

const MultiRegionManagement = () => {
  const [regions, setRegions] = useState<Region[]>([
    {
      id: 'us-east',
      name: 'US East',
      location: 'Virginia, USA',
      status: 'active',
      isPrimary: true,
      devices: 34,
      latency: 12,
      uptime: 99.98,
      lastSync: new Date(),
      replicationLag: 0.5,
    },
    {
      id: 'us-west',
      name: 'US West',
      location: 'Oregon, USA',
      status: 'standby',
      isPrimary: false,
      devices: 28,
      latency: 18,
      uptime: 99.95,
      lastSync: new Date(Date.now() - 2000),
      replicationLag: 2,
    },
    {
      id: 'eu-west',
      name: 'EU West',
      location: 'Ireland',
      status: 'active',
      isPrimary: false,
      devices: 42,
      latency: 25,
      uptime: 99.97,
      lastSync: new Date(Date.now() - 1500),
      replicationLag: 1.5,
    },
    {
      id: 'apac',
      name: 'Asia Pacific',
      location: 'Tokyo, Japan',
      status: 'active',
      isPrimary: false,
      devices: 31,
      latency: 35,
      uptime: 99.94,
      lastSync: new Date(Date.now() - 3000),
      replicationLag: 3,
    },
  ]);

  const [failoverConfig, setFailoverConfig] = useState<FailoverConfig>({
    enabled: true,
    primaryRegion: 'us-east',
    failoverRegions: ['us-west', 'eu-west'],
    triggerThreshold: 80,
    autoFailback: false,
  });

  const [drPlans, setDrPlans] = useState<DisasterRecoveryPlan[]>([
    {
      id: 'dr-1',
      name: 'Regional Failover Plan',
      type: 'automatic',
      rto: 15,
      rpo: 5,
      lastTested: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      status: 'ready',
    },
    {
      id: 'dr-2',
      name: 'Complete Infrastructure Recovery',
      type: 'manual',
      rto: 60,
      rpo: 30,
      lastTested: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      status: 'ready',
    },
  ]);

  const [replicationStatus, setReplicationStatus] = useState<ReplicationStatus[]>([
    {
      sourceRegion: 'US East',
      targetRegion: 'US West',
      dataSize: 2.4,
      progress: 100,
      lag: 2,
      status: 'synced',
    },
    {
      sourceRegion: 'US East',
      targetRegion: 'EU West',
      dataSize: 2.4,
      progress: 98,
      lag: 1.5,
      status: 'syncing',
    },
    {
      sourceRegion: 'US East',
      targetRegion: 'Asia Pacific',
      dataSize: 2.4,
      progress: 100,
      lag: 3,
      status: 'synced',
    },
  ]);

  const [isFailoverTesting, setIsFailoverTesting] = useState(false);
  const [failoverProgress, setFailoverProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRegions((prev) =>
        prev.map((region) => ({
          ...region,
          lastSync: new Date(),
          replicationLag: Math.max(0.1, region.replicationLag + (Math.random() - 0.5) * 0.5),
          latency: Math.max(5, region.latency + (Math.random() - 0.5) * 3),
        }))
      );

      setReplicationStatus((prev) =>
        prev.map((rep) => ({
          ...rep,
          progress: rep.status === 'syncing' ? Math.min(100, rep.progress + 1) : 100,
          lag: Math.max(0.1, rep.lag + (Math.random() - 0.5) * 0.3),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const testFailover = (targetRegion: string) => {
    setIsFailoverTesting(true);
    setFailoverProgress(0);

    const interval = setInterval(() => {
      setFailoverProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsFailoverTesting(false);
          
          toast({
            title: 'Failover Test Complete',
            description: `Successfully failed over to ${targetRegion}`,
          });

          // Update regions
          setRegions((prev) =>
            prev.map((region) => ({
              ...region,
              isPrimary: region.id === targetRegion.toLowerCase().replace(' ', '-'),
              status: region.id === targetRegion.toLowerCase().replace(' ', '-') ? 'active' : 'standby',
            }))
          );

          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const triggerDRPlan = (planId: string) => {
    setDrPlans((prev) =>
      prev.map((plan) =>
        plan.id === planId
          ? { ...plan, status: 'testing', lastTested: new Date() }
          : plan
      )
    );

    setTimeout(() => {
      setDrPlans((prev) =>
        prev.map((plan) =>
          plan.id === planId
            ? { ...plan, status: 'ready' }
            : plan
        )
      );

      toast({
        title: 'DR Test Complete',
        description: 'Disaster recovery plan executed successfully',
      });
    }, 5000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'synced':
      case 'ready':
        return 'text-green-500';
      case 'standby':
      case 'syncing':
      case 'testing':
        return 'text-yellow-500';
      case 'offline':
      case 'error':
      case 'failed':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { bg: string; text: string; label: string }> = {
      active: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Active' },
      standby: { bg: 'bg-yellow-500/10', text: 'text-yellow-500', label: 'Standby' },
      offline: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Offline' },
      synced: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Synced' },
      syncing: { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'Syncing' },
      error: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Error' },
      ready: { bg: 'bg-green-500/10', text: 'text-green-500', label: 'Ready' },
      testing: { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'Testing' },
      failed: { bg: 'bg-red-500/10', text: 'text-red-500', label: 'Failed' },
    };

    const config = statusMap[status] || statusMap.offline;
    return (
      <Badge className={`${config.bg} ${config.text} border-${config.text}/20`}>
        {config.label}
      </Badge>
    );
  };

  const totalDevices = regions.reduce((sum, r) => sum + r.devices, 0);
  const avgUptime = regions.reduce((sum, r) => sum + r.uptime, 0) / regions.length;
  const primaryRegion = regions.find((r) => r.isPrimary);

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <Globe className="h-5 w-5 text-primary" />
            <Badge variant="outline">{regions.length} Regions</Badge>
          </div>
          <p className="text-2xl font-bold text-foreground">{totalDevices}</p>
          <p className="text-sm text-muted-foreground">Total Edge Devices</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <Activity className="h-5 w-5 text-primary" />
            <Badge variant="outline">Multi-Region</Badge>
          </div>
          <p className="text-2xl font-bold text-foreground">{avgUptime.toFixed(2)}%</p>
          <p className="text-sm text-muted-foreground">Avg Uptime</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <Shield className="h-5 w-5 text-primary" />
            <Badge variant="outline">Protected</Badge>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {regions.filter((r) => r.status === 'active').length}
          </p>
          <p className="text-sm text-muted-foreground">Active Regions</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <div className="flex items-center justify-between mb-2">
            <Database className="h-5 w-5 text-primary" />
            <Badge variant="outline">Real-time</Badge>
          </div>
          <p className="text-2xl font-bold text-foreground">
            {replicationStatus.filter((r) => r.status === 'synced').length}/
            {replicationStatus.length}
          </p>
          <p className="text-sm text-muted-foreground">Synced Replicas</p>
        </Card>
      </div>

      <Tabs defaultValue="regions" className="space-y-6">
        <TabsList className="bg-muted">
          <TabsTrigger value="regions">Regional Overview</TabsTrigger>
          <TabsTrigger value="failover">Failover Configuration</TabsTrigger>
          <TabsTrigger value="replication">Replication Status</TabsTrigger>
          <TabsTrigger value="dr">Disaster Recovery</TabsTrigger>
        </TabsList>

        {/* Regional Overview */}
        <TabsContent value="regions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {regions.map((region) => (
              <Card key={region.id} className="bg-card border-border">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <Globe className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground">{region.name}</h3>
                          {region.isPrimary && (
                            <Badge className="bg-primary/10 text-primary border-primary/20">
                              Primary
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{region.location}</p>
                      </div>
                    </div>
                    {getStatusBadge(region.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Edge Devices</p>
                      <p className="text-xl font-bold text-foreground">{region.devices}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Uptime</p>
                      <p className="text-xl font-bold text-foreground">{region.uptime}%</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Latency</span>
                        <span className="text-foreground">{region.latency.toFixed(0)}ms</span>
                      </div>
                      <Progress value={(region.latency / 100) * 100} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Replication Lag</span>
                        <span className="text-foreground">{region.replicationLag.toFixed(1)}s</span>
                      </div>
                      <Progress value={(region.replicationLag / 10) * 100} className="h-2" />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Last sync: {region.lastSync.toLocaleTimeString()}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Failover Configuration */}
        <TabsContent value="failover" className="space-y-6">
          <Card className="bg-card border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Geographic Failover Configuration
                </h3>
                <p className="text-sm text-muted-foreground">
                  Automated failover to maintain service availability
                </p>
              </div>
              <Badge className={failoverConfig.enabled ? 'bg-green-500/10 text-green-500' : 'bg-gray-500/10 text-gray-500'}>
                {failoverConfig.enabled ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Primary Region
                    </label>
                    <div className="p-4 rounded-lg border border-border bg-primary/5">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        <span className="font-medium text-foreground">
                          {primaryRegion?.name}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {primaryRegion?.location}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Failover Threshold
                    </label>
                    <div className="flex items-center gap-4">
                      <Progress value={failoverConfig.triggerThreshold} className="flex-1" />
                      <span className="text-sm font-medium text-foreground">
                        {failoverConfig.triggerThreshold}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Trigger failover when primary region health drops below threshold
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Failover Regions (Priority Order)
                  </label>
                  <div className="space-y-2">
                    {failoverConfig.failoverRegions.map((regionId, index) => {
                      const region = regions.find((r) => r.id === regionId);
                      return (
                        <div
                          key={regionId}
                          className="flex items-center gap-3 p-3 rounded-lg border border-border"
                        >
                          <Badge variant="outline">{index + 1}</Badge>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{region?.name}</p>
                            <p className="text-xs text-muted-foreground">{region?.location}</p>
                          </div>
                          {getStatusBadge(region?.status || 'offline')}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {isFailoverTesting && (
                <div className="p-4 rounded-lg border border-primary bg-primary/5">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-primary animate-spin" />
                      <span className="text-sm font-medium text-foreground">
                        Testing Failover...
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">{failoverProgress}%</span>
                  </div>
                  <Progress value={failoverProgress} className="h-2" />
                </div>
              )}

              <div className="flex gap-3">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button disabled={isFailoverTesting} className="gap-2">
                      <PlayCircle className="h-4 w-4" />
                      Test Failover
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Test Regional Failover</DialogTitle>
                      <DialogDescription>
                        Simulate a failover event to validate configuration
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Target Failover Region
                      </label>
                      <Select defaultValue={failoverConfig.failoverRegions[0]}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {failoverConfig.failoverRegions.map((regionId) => {
                            const region = regions.find((r) => r.id === regionId);
                            return (
                              <SelectItem key={regionId} value={regionId}>
                                {region?.name} - {region?.location}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          const targetRegion = regions.find(
                            (r) => r.id === failoverConfig.failoverRegions[0]
                          );
                          if (targetRegion) {
                            testFailover(targetRegion.name);
                          }
                        }}
                      >
                        Start Test
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Replication Status */}
        <TabsContent value="replication" className="space-y-6">
          <Card className="bg-card border-border">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Cross-Region Replication
              </h3>
              <p className="text-sm text-muted-foreground">
                Real-time data synchronization across regions
              </p>
            </div>
            <div className="p-6 space-y-4">
              {replicationStatus.map((rep, index) => (
                <div key={index} className="p-4 rounded-lg border border-border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="text-sm font-medium text-foreground">
                        {rep.sourceRegion}
                      </span>
                      <GitBranch className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium text-foreground">
                        {rep.targetRegion}
                      </span>
                    </div>
                    {getStatusBadge(rep.status)}
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Data Size</p>
                      <p className="text-sm font-medium text-foreground">{rep.dataSize} GB</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Lag</p>
                      <p className="text-sm font-medium text-foreground">{rep.lag.toFixed(1)}s</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Progress</p>
                      <p className="text-sm font-medium text-foreground">{rep.progress}%</p>
                    </div>
                  </div>

                  <Progress value={rep.progress} className="h-2" />
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Disaster Recovery */}
        <TabsContent value="dr" className="space-y-6">
          <Card className="bg-card border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Disaster Recovery Plans
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Automated recovery procedures and testing
                  </p>
                </div>
                <Button variant="outline" className="gap-2">
                  <Shield className="h-4 w-4" />
                  Create Plan
                </Button>
              </div>
            </div>

            <ScrollArea className="h-[500px]">
              <div className="p-6 space-y-4">
                {drPlans.map((plan) => (
                  <Card key={plan.id} className="bg-muted/30 border-border p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground">{plan.name}</h4>
                          <Badge variant="outline" className="capitalize">
                            {plan.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Last tested: {plan.lastTested.toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(plan.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-card">
                        <p className="text-xs text-muted-foreground mb-1">RTO</p>
                        <p className="text-lg font-bold text-foreground">{plan.rto} min</p>
                        <p className="text-xs text-muted-foreground">Recovery Time Objective</p>
                      </div>
                      <div className="p-3 rounded-lg bg-card">
                        <p className="text-xs text-muted-foreground mb-1">RPO</p>
                        <p className="text-lg font-bold text-foreground">{plan.rpo} min</p>
                        <p className="text-xs text-muted-foreground">Recovery Point Objective</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => triggerDRPlan(plan.id)}
                        disabled={plan.status === 'testing'}
                        className="gap-2"
                      >
                        {plan.status === 'testing' ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Testing...
                          </>
                        ) : (
                          <>
                            <PlayCircle className="h-4 w-4" />
                            Test Plan
                          </>
                        )}
                      </Button>
                      <Button size="sm" variant="outline" className="gap-2">
                        <Zap className="h-4 w-4" />
                        Execute
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MultiRegionManagement;
