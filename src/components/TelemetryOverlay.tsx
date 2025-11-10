import { Server } from '@/types/digitalTwin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Cpu, HardDrive, Thermometer, Zap, Network } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TelemetryOverlayProps {
  server: Server | null;
}

const TelemetryOverlay = ({ server }: TelemetryOverlayProps) => {
  if (!server) {
    return (
      <Card className="bg-card/50 backdrop-blur-sm border-border">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Live Telemetry
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Click on a server to view telemetry</p>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: Server['status']) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      case 'maintenance': return 'text-gray-500';
      default: return 'text-green-500';
    }
  };

  const getProgressColor = (value: number) => {
    if (value > 85) return 'bg-red-500';
    if (value > 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <Card className="bg-card/90 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            {server.name}
          </span>
          <span className={`text-xs ${getStatusColor(server.status)} capitalize`}>
            {server.status}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Cpu className="h-3 w-3" />
              CPU Usage
            </span>
            <span className="font-mono">{server.telemetry.cpu}%</span>
          </div>
          <div className="relative">
            <Progress value={server.telemetry.cpu} className="h-2" />
            <div 
              className={`absolute inset-0 h-2 rounded-full ${getProgressColor(server.telemetry.cpu)}`}
              style={{ width: `${server.telemetry.cpu}%` }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <HardDrive className="h-3 w-3" />
              Memory
            </span>
            <span className="font-mono">{server.telemetry.memory}%</span>
          </div>
          <div className="relative">
            <Progress value={server.telemetry.memory} className="h-2" />
            <div 
              className={`absolute inset-0 h-2 rounded-full ${getProgressColor(server.telemetry.memory)}`}
              style={{ width: `${server.telemetry.memory}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Thermometer className="h-3 w-3" />
              Temperature
            </div>
            <p className="text-lg font-mono">{server.telemetry.temperature}°C</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Zap className="h-3 w-3" />
              Power Draw
            </div>
            <p className="text-lg font-mono">{server.telemetry.powerUsage}W</p>
          </div>

          <div className="space-y-1 col-span-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Network className="h-3 w-3" />
              Network Traffic
            </div>
            <p className="text-lg font-mono">{server.telemetry.networkTraffic} Mbps</p>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Active Workloads</p>
          <div className="flex flex-wrap gap-1">
            {server.workloads.map((workload) => (
              <span
                key={workload}
                className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary"
              >
                {workload}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TelemetryOverlay;
