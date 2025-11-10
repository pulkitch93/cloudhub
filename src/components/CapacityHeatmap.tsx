import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Layers, Move, Server, Cpu, HardDrive, Thermometer } from 'lucide-react';
import { toast } from 'sonner';

interface RackServer {
  id: string;
  name: string;
  position: number;
  cpu: number;
  memory: number;
  disk: number;
  temperature: number;
  workload?: string;
}

interface Rack {
  id: string;
  name: string;
  location: string;
  servers: RackServer[];
}

const CapacityHeatmap = () => {
  const [selectedMetric, setSelectedMetric] = useState<'cpu' | 'memory' | 'disk' | 'temperature'>('cpu');
  const [draggedServer, setDraggedServer] = useState<RackServer | null>(null);
  
  const [racks, setRacks] = useState<Rack[]>([
    {
      id: 'rack-1',
      name: 'Rack A-01',
      location: 'DC-East Row 1',
      servers: Array.from({ length: 10 }, (_, i) => ({
        id: `srv-a${i + 1}`,
        name: `Server-A${i + 1}`,
        position: i,
        cpu: Math.floor(30 + Math.random() * 60),
        memory: Math.floor(40 + Math.random() * 50),
        disk: Math.floor(50 + Math.random() * 40),
        temperature: Math.floor(45 + Math.random() * 30),
        workload: i < 7 ? `workload-${i + 1}` : undefined
      }))
    },
    {
      id: 'rack-2',
      name: 'Rack A-02',
      location: 'DC-East Row 1',
      servers: Array.from({ length: 10 }, (_, i) => ({
        id: `srv-b${i + 1}`,
        name: `Server-B${i + 1}`,
        position: i,
        cpu: Math.floor(25 + Math.random() * 65),
        memory: Math.floor(35 + Math.random() * 55),
        disk: Math.floor(45 + Math.random() * 45),
        temperature: Math.floor(42 + Math.random() * 33),
        workload: i < 8 ? `workload-${i + 8}` : undefined
      }))
    },
    {
      id: 'rack-3',
      name: 'Rack B-01',
      location: 'DC-West Row 2',
      servers: Array.from({ length: 10 }, (_, i) => ({
        id: `srv-c${i + 1}`,
        name: `Server-C${i + 1}`,
        position: i,
        cpu: Math.floor(20 + Math.random() * 70),
        memory: Math.floor(30 + Math.random() * 60),
        disk: Math.floor(40 + Math.random() * 50),
        temperature: Math.floor(40 + Math.random() * 35),
        workload: i < 6 ? `workload-${i + 15}` : undefined
      }))
    }
  ]);

  const getHeatmapColor = (value: number) => {
    if (value >= 80) return 'bg-destructive';
    if (value >= 60) return 'bg-warning';
    if (value >= 40) return 'bg-primary';
    return 'bg-success';
  };

  const getHeatmapIntensity = (value: number) => {
    const intensity = Math.min(100, value);
    return `${intensity}%`;
  };

  const handleDragStart = (server: RackServer) => {
    setDraggedServer(server);
    toast.info(`Dragging ${server.name}`, {
      description: server.workload ? `Workload: ${server.workload}` : 'No active workload'
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetRackId: string, targetPosition: number) => {
    if (!draggedServer) return;

    setRacks(prevRacks => {
      const newRacks = prevRacks.map(rack => ({
        ...rack,
        servers: rack.servers.filter(s => s.id !== draggedServer.id)
      }));

      const targetRack = newRacks.find(r => r.id === targetRackId);
      if (targetRack) {
        const updatedServer = { ...draggedServer, position: targetPosition };
        targetRack.servers = [...targetRack.servers, updatedServer].sort((a, b) => a.position - b.position);
      }

      return newRacks;
    });

    toast.success('Workload migrated', {
      description: `${draggedServer.name} moved to new position`
    });

    setDraggedServer(null);
  };

  const getMetricValue = (server: RackServer) => {
    switch (selectedMetric) {
      case 'cpu': return server.cpu;
      case 'memory': return server.memory;
      case 'disk': return server.disk;
      case 'temperature': return server.temperature;
    }
  };

  const getMetricLabel = () => {
    switch (selectedMetric) {
      case 'cpu': return 'CPU Usage';
      case 'memory': return 'Memory Usage';
      case 'disk': return 'Disk Usage';
      case 'temperature': return 'Temperature';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Capacity Heatmap & Workload Migration
        </CardTitle>
        <CardDescription>
          Visualize resource utilization density and drag-and-drop servers to plan workload migration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metric Selector */}
        <Tabs value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as any)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="cpu" className="gap-1">
              <Cpu className="h-3 w-3" />
              CPU
            </TabsTrigger>
            <TabsTrigger value="memory" className="gap-1">
              <HardDrive className="h-3 w-3" />
              Memory
            </TabsTrigger>
            <TabsTrigger value="disk" className="gap-1">
              <Server className="h-3 w-3" />
              Disk
            </TabsTrigger>
            <TabsTrigger value="temperature" className="gap-1">
              <Thermometer className="h-3 w-3" />
              Temp
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Instructions */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
          <Move className="h-4 w-4 text-primary flex-shrink-0" />
          <span className="text-muted-foreground">
            Drag and drop servers between racks to simulate workload migration and optimize capacity
          </span>
        </div>

        {/* Heatmap Grid */}
        <div className="space-y-6">
          {racks.map((rack) => (
            <div key={rack.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-foreground">{rack.name}</h4>
                  <p className="text-xs text-muted-foreground">{rack.location}</p>
                </div>
                <Badge variant="outline">
                  {rack.servers.filter(s => s.workload).length}/{rack.servers.length} slots used
                </Badge>
              </div>

              <div className="grid grid-cols-10 gap-2">
                {rack.servers.map((server) => {
                  const metricValue = getMetricValue(server);
                  const colorClass = getHeatmapColor(metricValue);
                  
                  return (
                    <div
                      key={server.id}
                      draggable={!!server.workload}
                      onDragStart={() => handleDragStart(server)}
                      onDragOver={handleDragOver}
                      onDrop={() => handleDrop(rack.id, server.position)}
                      className={`
                        relative aspect-square rounded-lg border border-border
                        ${colorClass} cursor-move transition-all hover:scale-105
                        ${server.workload ? 'opacity-90' : 'opacity-30'}
                        ${draggedServer?.id === server.id ? 'ring-2 ring-primary' : ''}
                      `}
                      style={{
                        opacity: server.workload ? getHeatmapIntensity(metricValue) : '0.3'
                      }}
                      title={`${server.name}\n${getMetricLabel()}: ${metricValue}%${server.workload ? `\nWorkload: ${server.workload}` : '\nEmpty slot'}`}
                    >
                      {server.workload && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Server className="h-4 w-4 text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[8px] text-center py-0.5 rounded-b">
                        {metricValue}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success"></div>
            <span className="text-muted-foreground">Low (&lt;40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary"></div>
            <span className="text-muted-foreground">Moderate (40-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-warning"></div>
            <span className="text-muted-foreground">High (60-80%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-destructive"></div>
            <span className="text-muted-foreground">Critical (&gt;80%)</span>
          </div>
        </div>

        {/* Migration Summary */}
        <div className="p-4 rounded-lg border border-border bg-card/50">
          <h4 className="text-sm font-semibold text-foreground mb-3">Migration Recommendations</h4>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-muted-foreground">
                Consider migrating workloads from Server-A3 (CPU: 89%) to Server-C8 (CPU: 23%)
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-muted-foreground">
                Rack A-02 showing high memory utilization - redistribute to Rack B-01
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-primary">•</span>
              <span className="text-muted-foreground">
                Temperature hotspot detected in Rack A-01 - cooling optimization needed
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CapacityHeatmap;
