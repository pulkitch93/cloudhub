import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import GlobalServerMap from '@/components/GlobalServerMap';
import TelemetryOverlay from '@/components/TelemetryOverlay';
import ScenarioSimulator from '@/components/ScenarioSimulator';
import InfrastructureTopology from '@/components/InfrastructureTopology';
import TimeMachine from '@/components/TimeMachine';
import PredictiveFailureAnalysis from '@/components/PredictiveFailureAnalysis';
import CapacityHeatmap from '@/components/CapacityHeatmap';
import AutomatedRemediation from '@/components/AutomatedRemediation';
import WorkloadRecommendationEngine from '@/components/WorkloadRecommendationEngine';
import CollaborationCanvas from '@/components/CollaborationCanvas';
import TicketingIntegration from '@/components/TicketingIntegration';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Server, mockServers, scenarios } from '@/types/digitalTwin';
import { Badge } from '@/components/ui/badge';
import ARGuidedMaintenance from '@/components/ARGuidedMaintenance';
import { Activity, Server as ServerIcon, Database, Zap, MapPin, Network, Clock, Brain, Layers, Users, Lightbulb, Glasses } from 'lucide-react';

const AIOps = () => {
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [servers, setServers] = useState(mockServers);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Simulate real-time updates (<5 sec refresh)
  useEffect(() => {
    const interval = setInterval(() => {
      setServers(prevServers =>
        prevServers.map(server => ({
          ...server,
          telemetry: {
            cpu: Math.max(10, Math.min(95, server.telemetry.cpu + (Math.random() - 0.5) * 10)),
            memory: Math.max(20, Math.min(98, server.telemetry.memory + (Math.random() - 0.5) * 8)),
            temperature: Math.max(30, Math.min(75, server.telemetry.temperature + (Math.random() - 0.5) * 5)),
            powerUsage: Math.max(100, Math.min(600, server.telemetry.powerUsage + (Math.random() - 0.5) * 30)),
            networkTraffic: Math.max(200, Math.min(6000, server.telemetry.networkTraffic + (Math.random() - 0.5) * 500)),
          },
        }))
      );
      setLastUpdate(new Date());
    }, 4000); // Update every 4 seconds

    return () => clearInterval(interval);
  }, []);

  const healthyCount = servers.filter(s => s.status === 'healthy').length;
  const warningCount = servers.filter(s => s.status === 'warning').length;
  const criticalCount = servers.filter(s => s.status === 'critical').length;

  const avgCpu = Math.round(servers.reduce((acc, s) => acc + s.telemetry.cpu, 0) / servers.length);
  const totalPower = servers.reduce((acc, s) => acc + s.telemetry.powerUsage, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">AIOps Command Center</h2>
          <p className="text-muted-foreground">AI-powered operations with global infrastructure visibility</p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Servers</p>
                <p className="text-2xl font-bold text-foreground">{servers.length}</p>
              </div>
              <ServerIcon className="h-8 w-8 text-primary" />
            </div>
            <div className="flex gap-2 mt-2">
              <Badge variant="outline" className="text-green-500 border-green-500/50">
                {healthyCount} Healthy
              </Badge>
              {warningCount > 0 && (
                <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
                  {warningCount} Warning
                </Badge>
              )}
              {criticalCount > 0 && (
                <Badge variant="outline" className="text-red-500 border-red-500/50">
                  {criticalCount} Critical
                </Badge>
              )}
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg CPU Usage</p>
                <p className="text-2xl font-bold text-foreground">{avgCpu}%</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total Power Draw</p>
                <p className="text-2xl font-bold text-foreground">{(totalPower / 1000).toFixed(1)}kW</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Last Update</p>
                <p className="text-sm font-mono text-foreground">
                  {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
              <Database className="h-8 w-8 text-green-500 animate-pulse" />
            </div>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="location-view" className="w-full">
          <TabsList className="mb-6 flex-wrap h-auto">
            <TabsTrigger value="location-view" className="gap-2">
              <MapPin className="h-4 w-4" />
              Location View
            </TabsTrigger>
            <TabsTrigger value="topology" className="gap-2">
              <Network className="h-4 w-4" />
              Topology
            </TabsTrigger>
            <TabsTrigger value="time-machine" className="gap-2">
              <Clock className="h-4 w-4" />
              Time Machine
            </TabsTrigger>
            <TabsTrigger value="ai-prediction" className="gap-2">
              <Brain className="h-4 w-4" />
              AI Prediction
            </TabsTrigger>
            <TabsTrigger value="heatmap" className="gap-2">
              <Layers className="h-4 w-4" />
              Capacity Heatmap
            </TabsTrigger>
            <TabsTrigger value="remediation" className="gap-2">
              <Zap className="h-4 w-4" />
              Auto-Remediation
            </TabsTrigger>
            <TabsTrigger value="workload" className="gap-2">
              <Lightbulb className="h-4 w-4" />
              Workload Optimizer
            </TabsTrigger>
            <TabsTrigger value="collaboration" className="gap-2">
              <Users className="h-4 w-4" />
              Collaboration
            </TabsTrigger>
            <TabsTrigger value="ar-maintenance" className="gap-2">
              <Glasses className="h-4 w-4" />
              AR Maintenance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="location-view">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <GlobalServerMap
                  servers={servers}
                  onServerSelect={setSelectedServer}
                />
              </div>

              <div className="space-y-6">
                <TelemetryOverlay server={selectedServer} />
                <ScenarioSimulator scenarios={scenarios} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="topology">
            <InfrastructureTopology />
          </TabsContent>

          <TabsContent value="time-machine">
            <TimeMachine />
          </TabsContent>

          <TabsContent value="ai-prediction">
            <PredictiveFailureAnalysis />
          </TabsContent>

          <TabsContent value="heatmap">
            <CapacityHeatmap />
          </TabsContent>

          <TabsContent value="remediation">
            <AutomatedRemediation />
          </TabsContent>

          <TabsContent value="workload">
            <WorkloadRecommendationEngine />
          </TabsContent>

          <TabsContent value="collaboration">
            <CollaborationCanvas />
            <div className="mt-6">
              <TicketingIntegration />
            </div>
          </TabsContent>

          <TabsContent value="ar-maintenance">
            <ARGuidedMaintenance />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AIOps;
