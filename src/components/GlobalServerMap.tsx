import { useState, useMemo } from 'react';
import { Server } from '@/types/digitalTwin';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Server as ServerIcon, Activity, Clock, Zap, Globe } from 'lucide-react';
import MapFilters from './MapFilters';
import worldMapImage from '@/assets/world-map.jpg';

interface GlobalServerMapProps {
  servers: Server[];
  onServerSelect?: (server: Server) => void;
}

// Server locations mapped to percentage positions on the map image
const serverLocations: Record<string, { x: number; y: number; city: string; region: string }> = {
  'US-East': { x: 22, y: 38, city: 'New York', region: 'Americas' },
  'US-West': { x: 15, y: 42, city: 'San Francisco', region: 'Americas' },
  'EU-Central': { x: 52, y: 32, city: 'Frankfurt', region: 'EMEA' },
  'AP-Southeast': { x: 78, y: 52, city: 'Singapore', region: 'APAC' },
  'UK-South': { x: 50, y: 31, city: 'London', region: 'EMEA' },
  'AU-East': { x: 84, y: 70, city: 'Sydney', region: 'APAC' },
};

const GlobalServerMap = ({ servers, onServerSelect }: GlobalServerMapProps) => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [activeRegions, setActiveRegions] = useState<string[]>([]);
  const [activeStatuses, setActiveStatuses] = useState<string[]>([]);
  const [activeTypes, setActiveTypes] = useState<string[]>([]);

  const handleServerClick = (server: Server) => {
    if (onServerSelect) {
      onServerSelect(server);
    }
  };

  // Apply filters
  const filteredServers = useMemo(() => {
    return servers.filter(server => {
      const location = serverLocations[server.location || 'US-East'];
      
      if (activeRegions.length > 0 && !activeRegions.includes(location.region)) {
        return false;
      }
      
      if (activeStatuses.length > 0) {
        const statusMap: Record<string, string> = {
          'Healthy': 'healthy',
          'Warning': 'warning',
          'Critical': 'critical',
          'Maintenance': 'maintenance'
        };
        const matchedStatus = activeStatuses.some(s => statusMap[s] === server.status);
        if (!matchedStatus) return false;
      }
      
      if (activeTypes.length > 0 && server.serverType) {
        if (!activeTypes.includes(server.serverType)) {
          return false;
        }
      }
      
      return true;
    });
  }, [servers, activeRegions, activeStatuses, activeTypes]);

  // Group servers by location
  const locationGroups = filteredServers.reduce((acc, server) => {
    const location = server.location || 'US-East';
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(server);
    return acc;
  }, {} as Record<string, Server[]>);

  const activeRegionCount = Object.keys(locationGroups).length;
  const totalServers = filteredServers.length;
  const healthyCount = filteredServers.filter(s => s.status === 'healthy').length;
  const warningCount = filteredServers.filter(s => s.status === 'warning').length;
  const criticalCount = filteredServers.filter(s => s.status === 'critical').length;
  const maintenanceCount = filteredServers.filter(s => s.status === 'maintenance').length;

  // Calculate average metrics for a location
  const getLocationMetrics = (servers: Server[]) => {
    const avgLatency = servers.reduce((sum, s) => sum + (s.latency || 20), 0) / servers.length;
    const avgUptime = servers.reduce((sum, s) => sum + (s.uptime || 99.9), 0) / servers.length;
    const avgCpu = servers.reduce((sum, s) => sum + s.telemetry.cpu, 0) / servers.length;
    const avgMemory = servers.reduce((sum, s) => sum + s.telemetry.memory, 0) / servers.length;
    return { avgLatency, avgUptime, avgCpu, avgMemory };
  };

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden bg-background border border-border shadow-lg">
      {/* Filters */}
      <MapFilters
        onRegionFilter={setActiveRegions}
        onStatusFilter={setActiveStatuses}
        onTypeFilter={setActiveTypes}
        activeRegions={activeRegions}
        activeStatuses={activeStatuses}
        activeTypes={activeTypes}
      />

      {/* World Map Image */}
      <div className="absolute inset-0">
        <img 
          src={worldMapImage} 
          alt="World Map" 
          className="w-full h-full object-cover opacity-50"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-background/70 via-background/60 to-background/70" />
      </div>

      {/* Server Markers */}
      {Object.entries(locationGroups).map(([locationKey, locationServers]) => {
        const location = serverLocations[locationKey];
        
        const hasCritical = locationServers.some(s => s.status === 'critical');
        const hasWarning = locationServers.some(s => s.status === 'warning');
        const hasMaintenance = locationServers.some(s => s.status === 'maintenance');
        
        const statusColor = 
          hasCritical ? 'rgb(239, 68, 68)' :
          hasWarning ? 'rgb(251, 146, 60)' :
          hasMaintenance ? 'rgb(148, 163, 184)' :
          'rgb(34, 197, 94)';
        
        const statusBg = 
          hasCritical ? 'bg-red-500' :
          hasWarning ? 'bg-orange-500' :
          hasMaintenance ? 'bg-slate-400' :
          'bg-green-500';
        
        const isHovered = hoveredLocation === locationKey;

        return (
          <div
            key={locationKey}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 cursor-pointer hover:scale-110 z-10"
            style={{
              left: `${location.x}%`,
              top: `${location.y}%`,
            }}
            onMouseEnter={() => setHoveredLocation(locationKey)}
            onMouseLeave={() => setHoveredLocation(null)}
            onClick={() => handleServerClick(locationServers[0])}
          >
            {/* Pulse rings */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className={`absolute w-16 h-16 rounded-full animate-ping`}
                style={{ 
                  backgroundColor: statusColor,
                  opacity: 0.3,
                  animationDuration: '2s'
                }}
              />
              <div 
                className={`absolute w-12 h-12 rounded-full animate-ping`}
                style={{ 
                  backgroundColor: statusColor,
                  opacity: 0.4,
                  animationDuration: '2s',
                  animationDelay: '1s'
                }}
              />
            </div>

            {/* Main marker */}
            <div className="relative flex items-center justify-center">
              <div 
                className={`w-8 h-8 rounded-full ${statusBg} shadow-lg flex items-center justify-center`}
                style={{ 
                  boxShadow: `0 0 20px ${statusColor}` 
                }}
              >
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
              
              {/* Server count badge */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-destructive rounded-full border-2 border-white shadow-lg flex items-center justify-center">
                <span className="text-xs font-bold text-white">{locationServers.length}</span>
              </div>
            </div>

            {/* City label */}
            <div className={`absolute top-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-90'}`}>
              <div className="bg-popover/95 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-border shadow-xl">
                <span className="text-sm font-bold text-popover-foreground">{location.city}</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Header with stats */}
      <div className="absolute top-4 left-4 space-y-3 z-20">
        <Badge className="bg-card/98 backdrop-blur-md border-border text-base px-5 py-2.5 shadow-xl">
          <Globe className="w-5 h-5 mr-2 text-primary animate-pulse" />
          <span className="font-semibold">🌐 Global Server Distribution:</span>
          <span className="ml-2 text-primary font-bold">{totalServers}</span> active servers across
          <span className="ml-1 text-primary font-bold">{activeRegionCount}</span> regions
        </Badge>
        
        {/* Status pills */}
        <div className="flex gap-2 flex-wrap">
          {healthyCount > 0 && (
            <Badge variant="outline" className="bg-card/98 backdrop-blur-md border-border shadow-lg">
              <div className="w-2.5 h-2.5 rounded-full mr-2 bg-green-500 animate-pulse" style={{ boxShadow: '0 0 10px rgb(34, 197, 94)' }} />
              <span className="font-semibold">Healthy:</span>
              <span className="ml-1 font-bold text-foreground">{healthyCount}</span>
            </Badge>
          )}
          {warningCount > 0 && (
            <Badge variant="outline" className="bg-card/98 backdrop-blur-md border-border shadow-lg">
              <div className="w-2.5 h-2.5 rounded-full mr-2 bg-orange-500 animate-pulse" style={{ boxShadow: '0 0 10px rgb(251, 146, 60)' }} />
              <span className="font-semibold">Warning:</span>
              <span className="ml-1 font-bold text-foreground">{warningCount}</span>
            </Badge>
          )}
          {criticalCount > 0 && (
            <Badge variant="outline" className="bg-card/98 backdrop-blur-md border-border shadow-lg">
              <div className="w-2.5 h-2.5 rounded-full mr-2 bg-red-500 animate-pulse" style={{ boxShadow: '0 0 10px rgb(239, 68, 68)' }} />
              <span className="font-semibold">Critical:</span>
              <span className="ml-1 font-bold text-foreground">{criticalCount}</span>
            </Badge>
          )}
          {maintenanceCount > 0 && (
            <Badge variant="outline" className="bg-card/98 backdrop-blur-md border-border shadow-lg">
              <div className="w-2.5 h-2.5 rounded-full mr-2 bg-slate-400" style={{ boxShadow: '0 0 8px rgb(148, 163, 184)' }} />
              <span className="font-semibold">Maintenance:</span>
              <span className="ml-1 font-bold text-foreground">{maintenanceCount}</span>
            </Badge>
          )}
        </div>
      </div>
      
      {/* Enhanced hover tooltip */}
      {hoveredLocation && (
        <div className="absolute top-32 left-1/2 transform -translate-x-1/2 z-30 animate-fade-in">
          <Card className="p-4 min-w-[380px] bg-card/98 backdrop-blur-md border-border shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="font-bold text-lg text-foreground">
                  {serverLocations[hoveredLocation].city}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {serverLocations[hoveredLocation].region}
                </p>
              </div>
              <Badge variant="secondary" className="text-sm font-bold">
                {locationGroups[hoveredLocation].length} server{locationGroups[hoveredLocation].length > 1 ? 's' : ''}
              </Badge>
            </div>
            
            {/* Aggregate metrics */}
            <div className="grid grid-cols-2 gap-3 mb-3 p-3 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Avg Latency</p>
                  <p className="text-sm font-bold text-foreground">{getLocationMetrics(locationGroups[hoveredLocation]).avgLatency.toFixed(1)}ms</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                  <p className="text-sm font-bold text-foreground">{getLocationMetrics(locationGroups[hoveredLocation]).avgUptime.toFixed(2)}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">CPU Load</p>
                  <p className="text-sm font-bold text-foreground">{getLocationMetrics(locationGroups[hoveredLocation]).avgCpu.toFixed(0)}%</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ServerIcon className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Memory</p>
                  <p className="text-sm font-bold text-foreground">{getLocationMetrics(locationGroups[hoveredLocation]).avgMemory.toFixed(0)}%</p>
                </div>
              </div>
            </div>
            
            {/* Individual servers */}
            <div className="space-y-2 max-h-[180px] overflow-y-auto">
              {locationGroups[hoveredLocation].map(server => (
                <div key={server.id} className="p-2 rounded-md bg-muted/20 border border-border/40">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-foreground">{server.name}</span>
                    <Badge
                      variant="outline"
                      className="capitalize text-xs"
                      style={{
                        borderColor: server.status === 'critical' ? 'rgb(239, 68, 68)' :
                                   server.status === 'warning' ? 'rgb(251, 146, 60)' :
                                   server.status === 'maintenance' ? 'rgb(148, 163, 184)' :
                                   'rgb(34, 197, 94)',
                        color: server.status === 'critical' ? 'rgb(239, 68, 68)' :
                               server.status === 'warning' ? 'rgb(251, 146, 60)' :
                               server.status === 'maintenance' ? 'rgb(148, 163, 184)' :
                               'rgb(34, 197, 94)'
                      }}
                    >
                      {server.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground">
                    <span>CPU: {server.telemetry.cpu}%</span>
                    <span>Mem: {server.telemetry.memory}%</span>
                  </div>
                  
                  {server.lastIncident && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Last incident: {server.lastIncident}
                    </p>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground text-center italic">
                Click node to view Live Telemetry dashboard →
              </p>
            </div>
          </Card>
        </div>
      )}
      
      {/* Status Legend */}
      <div className="absolute bottom-4 right-4 z-20">
        <Card className="p-3 bg-card/98 backdrop-blur-md border-border shadow-xl">
          <div className="text-xs font-semibold text-foreground mb-2.5 flex items-center gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            Status Legend
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-green-500" style={{ boxShadow: '0 0 12px rgb(34, 197, 94)' }} />
              <span className="text-muted-foreground font-medium">🟢 Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-orange-500" style={{ boxShadow: '0 0 12px rgb(251, 146, 60)' }} />
              <span className="text-muted-foreground font-medium">🟡 Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-red-500" style={{ boxShadow: '0 0 12px rgb(239, 68, 68)' }} />
              <span className="text-muted-foreground font-medium">🔴 Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-slate-400" style={{ boxShadow: '0 0 10px rgb(148, 163, 184)' }} />
              <span className="text-muted-foreground font-medium">⚪ Maintenance</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GlobalServerMap;
