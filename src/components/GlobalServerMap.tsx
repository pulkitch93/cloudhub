import { useState, useMemo } from 'react';
import { Server } from '@/types/digitalTwin';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Server as ServerIcon, Activity, Clock, AlertTriangle, Zap } from 'lucide-react';
import MapFilters from './MapFilters';

interface GlobalServerMapProps {
  servers: Server[];
  onServerSelect?: (server: Server) => void;
}

// Server locations mapped to real coordinates
const serverLocations: Record<string, { lat: number; lng: number; city: string; region: string }> = {
  'US-East': { lat: 40.7128, lng: -74.0060, city: 'New York', region: 'Americas' },
  'US-West': { lat: 37.7749, lng: -122.4194, city: 'San Francisco', region: 'Americas' },
  'EU-Central': { lat: 50.1109, lng: 8.6821, city: 'Frankfurt', region: 'EMEA' },
  'AP-Southeast': { lat: 1.3521, lng: 103.8198, city: 'Singapore', region: 'APAC' },
  'UK-South': { lat: 51.5074, lng: -0.1278, city: 'London', region: 'EMEA' },
  'AU-East': { lat: -33.8688, lng: 151.2093, city: 'Sydney', region: 'APAC' },
};

const GlobalServerMap = ({ servers, onServerSelect }: GlobalServerMapProps) => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);
  const [activeRegions, setActiveRegions] = useState<string[]>([]);
  const [activeStatuses, setActiveStatuses] = useState<string[]>([]);
  const [activeTypes, setActiveTypes] = useState<string[]>([]);

  // Convert lat/lng to SVG coordinates (Mercator-like projection)
  const coordToPosition = (lat: number, lng: number) => {
    const x = ((lng + 180) / 360) * 900 + 50;
    const latRad = (lat * Math.PI) / 180;
    const mercatorY = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = 250 - (mercatorY * 250) / 3;
    return { x: Math.max(50, Math.min(950, x)), y: Math.max(50, Math.min(450, y)) };
  };

  const handleServerClick = (server: Server) => {
    if (onServerSelect) {
      onServerSelect(server);
    }
  };

  // Apply filters
  const filteredServers = useMemo(() => {
    return servers.filter(server => {
      const location = serverLocations[server.location || 'US-East'];
      
      // Region filter
      if (activeRegions.length > 0 && !activeRegions.includes(location.region)) {
        return false;
      }
      
      // Status filter
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
      
      // Type filter
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

  // Count active regions
  const activeRegionCount = Object.keys(locationGroups).length;

  // Calculate totals
  const totalServers = filteredServers.length;
  const healthyCount = filteredServers.filter(s => s.status === 'healthy').length;
  const warningCount = filteredServers.filter(s => s.status === 'warning').length;
  const criticalCount = filteredServers.filter(s => s.status === 'critical').length;

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden bg-gradient-to-br from-background via-background/95 to-muted/20 border border-border">
      {/* Filters */}
      <MapFilters
        onRegionFilter={setActiveRegions}
        onStatusFilter={setActiveStatuses}
        onTypeFilter={setActiveTypes}
        activeRegions={activeRegions}
        activeStatuses={activeStatuses}
        activeTypes={activeTypes}
      />

      {/* SVG World Map */}
      <svg
        viewBox="0 0 1000 500"
        className="absolute inset-0 w-full h-full transition-all duration-300"
        style={{ filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.1))' }}
      >
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.1" />
          </pattern>
          
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <linearGradient id="landGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.08" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.03" />
          </linearGradient>

          {/* Animated gradient for connections */}
          <linearGradient id="connectionGradient">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
            <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8">
              <animate attributeName="offset" values="0;1" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
          </linearGradient>
        </defs>
        
        <rect width="1000" height="500" fill="url(#grid)" />
        
        {/* Geographic lines with labels */}
        <g opacity="0.25" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" strokeDasharray="5,5">
          {/* Equator */}
          <line x1="50" y1="250" x2="950" y2="250" />
          <text x="960" y="250" fill="hsl(var(--muted-foreground))" fontSize="10" dominantBaseline="middle">Equator</text>
          
          {/* Tropic of Cancer */}
          <line x1="50" y1="180" x2="950" y2="180" opacity="0.5" />
          
          {/* Tropic of Capricorn */}
          <line x1="50" y1="320" x2="950" y2="320" opacity="0.5" />
        </g>

        {/* World map continents */}
        <g stroke="hsl(var(--primary))" strokeWidth="1.5" fill="url(#landGradient)">
          <path d="M 120,120 L 140,100 L 170,90 L 200,95 L 230,105 L 260,120 L 280,140 L 295,165 L 305,195 L 310,225 L 308,255 L 300,285 L 285,310 L 265,330 L 240,340 L 215,342 L 190,337 L 170,325 L 155,305 L 145,280 L 138,250 L 133,220 L 128,190 L 123,160 L 120,130 Z" />
          <path d="M 215,342 L 225,355 L 232,365 L 237,375 L 235,385 L 228,392 L 220,390 L 215,380 L 212,370 L 210,360 L 212,350 Z" />
          <path d="M 228,392 L 238,410 L 248,440 L 252,470 L 248,490 L 238,505 L 222,510 L 205,508 L 192,495 L 185,470 L 183,440 L 188,410 L 198,385 L 210,375 L 220,385 Z" />
          <path d="M 330,50 L 360,45 L 385,52 L 400,70 L 398,95 L 385,115 L 365,125 L 340,128 L 320,118 L 310,95 L 315,70 Z" />
          <path d="M 480,125 L 505,115 L 530,118 L 555,128 L 575,145 L 585,165 L 590,185 L 588,205 L 580,220 L 565,230 L 545,235 L 520,233 L 495,225 L 478,210 L 472,190 L 475,170 L 478,150 Z" />
          <path d="M 505,85 L 520,75 L 535,80 L 545,95 L 548,115 L 542,132 L 530,140 L 515,138 L 505,125 L 503,110 L 505,95 Z" />
          <path d="M 505,225 L 525,235 L 545,250 L 560,275 L 570,305 L 575,340 L 578,375 L 575,405 L 565,430 L 548,448 L 525,458 L 500,460 L 475,453 L 455,438 L 445,415 L 442,385 L 445,355 L 453,325 L 465,295 L 480,265 L 495,240 L 505,230 Z" />
          <path d="M 590,115 L 625,105 L 665,108 L 710,120 L 755,140 L 795,165 L 825,195 L 845,225 L 855,255 L 853,285 L 840,310 L 815,328 L 785,338 L 750,342 L 715,338 L 680,328 L 650,312 L 625,290 L 605,265 L 595,235 L 590,205 L 590,175 L 592,145 Z" />
          <path d="M 588,205 L 605,215 L 622,230 L 630,248 L 628,268 L 618,283 L 605,290 L 592,288 L 585,275 L 583,258 L 586,240 L 588,225 Z" />
          <path d="M 650,235 L 668,240 L 682,255 L 690,275 L 692,298 L 685,318 L 672,330 L 655,335 L 642,330 L 635,315 L 633,295 L 638,275 L 646,255 Z" />
          <path d="M 692,298 L 710,305 L 728,320 L 738,338 L 735,355 L 722,368 L 705,372 L 692,365 L 688,350 L 690,335 L 692,320 Z" />
          <path d="M 865,210 L 878,205 L 890,210 L 895,228 L 892,248 L 882,258 L 870,260 L 860,252 L 858,235 L 862,220 Z" />
          <path d="M 800,355 L 835,348 L 870,355 L 895,372 L 908,395 L 910,420 L 900,442 L 880,458 L 850,468 L 820,470 L 792,462 L 770,445 L 760,420 L 762,395 L 775,375 Z" />
          <path d="M 920,445 L 932,442 L 940,450 L 938,465 L 928,472 L 918,470 L 915,460 L 918,450 Z" />
        </g>

        {/* Animated connection lines between servers */}
        {Object.entries(locationGroups).flatMap(([locationKey, locationServers], i) => {
          const serverLoc = serverLocations[locationKey];
          const pos = coordToPosition(serverLoc.lat, serverLoc.lng);
          
          return Object.entries(locationGroups)
            .slice(i + 1)
            .map(([targetKey]) => {
              const targetLoc = serverLocations[targetKey];
              const targetPos = coordToPosition(targetLoc.lat, targetLoc.lng);
              
              // Calculate latency based on distance
              const distance = Math.sqrt(Math.pow(targetPos.x - pos.x, 2) + Math.pow(targetPos.y - pos.y, 2));
              const latency = Math.round(distance / 10);
              
              return (
                <g key={`${locationKey}-${targetKey}`}>
                  <line
                    x1={pos.x}
                    y1={pos.y}
                    x2={targetPos.x}
                    y2={targetPos.y}
                    stroke="url(#connectionGradient)"
                    strokeWidth="2"
                    opacity="0.6"
                    className="transition-all duration-300"
                  />
                  
                  {/* Latency label */}
                  <text
                    x={(pos.x + targetPos.x) / 2}
                    y={(pos.y + targetPos.y) / 2}
                    fill="hsl(var(--primary))"
                    fontSize="8"
                    opacity="0.5"
                    textAnchor="middle"
                  >
                    {latency}ms
                  </text>
                </g>
              );
            });
        })}

        {/* Server location markers */}
        {Object.entries(locationGroups).map(([locationKey, locationServers]) => {
          const location = serverLocations[locationKey];
          const pos = coordToPosition(location.lat, location.lng);
          
          const hasCritical = locationServers.some(s => s.status === 'critical');
          const hasWarning = locationServers.some(s => s.status === 'warning');
          const hasMaintenance = locationServers.some(s => s.status === 'maintenance');
          
          const statusColor = 
            hasCritical ? 'hsl(0, 84%, 60%)' :
            hasWarning ? 'hsl(38, 92%, 50%)' :
            hasMaintenance ? 'hsl(215, 16%, 47%)' :
            'hsl(142, 70%, 45%)';
          
          const isHovered = hoveredLocation === locationKey;

          return (
            <g
              key={locationKey}
              transform={`translate(${pos.x}, ${pos.y})`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredLocation(locationKey)}
              onMouseLeave={() => setHoveredLocation(null)}
              onClick={() => handleServerClick(locationServers[0])}
              className="transition-transform duration-200 hover:scale-110"
            >
              {/* Animated pulse rings */}
              {isHovered && (
                <>
                  <circle r="20" fill="none" stroke={statusColor} strokeWidth="2" opacity="0.6">
                    <animate attributeName="r" from="15" to="30" dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                  <circle r="20" fill="none" stroke={statusColor} strokeWidth="2" opacity="0.4">
                    <animate attributeName="r" from="15" to="30" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.4" to="0" dur="1.5s" begin="0.5s" repeatCount="indefinite" />
                  </circle>
                </>
              )}
              
              {/* Location marker */}
              <circle r="10" fill={statusColor} filter="url(#glow)" />
              <circle r="4" fill="white" />

              {/* Server count badge */}
              <g transform="translate(10, -10)">
                <circle r="8" fill="hsl(var(--accent))" stroke="white" strokeWidth="1" />
                <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="9" fontWeight="bold">
                  {locationServers.length}
                </text>
              </g>

              {/* City label */}
              <g transform="translate(0, 25)">
                <rect x="-40" y="-12" width="80" height="20" rx="4" fill="hsl(var(--popover))" stroke="hsl(var(--border))" strokeWidth="1" opacity={isHovered ? "1" : "0.95"} filter="url(#glow)" />
                <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fill="hsl(var(--popover-foreground))" fontSize="11" fontWeight="700">
                  {location.city}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
      
      {/* Dynamic totals header */}
      <div className="absolute top-4 left-4 space-y-2 pointer-events-none z-10">
        <Badge className="bg-card/90 backdrop-blur-sm border-border pointer-events-auto text-base px-4 py-2">
          <ServerIcon className="w-4 h-4 mr-2" />
          Global Server Distribution: {totalServers} active servers across {activeRegionCount} regions
        </Badge>
        
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-card/90 backdrop-blur-sm border-border">
            <div className="w-2 h-2 rounded-full mr-1" style={{ background: 'hsl(142, 70%, 45%)' }} />
            {healthyCount} Healthy
          </Badge>
          {warningCount > 0 && (
            <Badge variant="outline" className="bg-card/90 backdrop-blur-sm border-border">
              <div className="w-2 h-2 rounded-full mr-1" style={{ background: 'hsl(38, 92%, 50%)' }} />
              {warningCount} Warning
            </Badge>
          )}
          {criticalCount > 0 && (
            <Badge variant="outline" className="bg-card/90 backdrop-blur-sm border-border">
              <div className="w-2 h-2 rounded-full mr-1" style={{ background: 'hsl(0, 84%, 60%)' }} />
              {criticalCount} Critical
            </Badge>
          )}
        </div>
      </div>
      
      {/* Enhanced hover tooltip */}
      {hoveredLocation && (
        <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none animate-fade-in">
          <Card className="p-4 min-w-[320px] bg-card/95 backdrop-blur-sm border-border shadow-primary">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-base text-foreground">
                {serverLocations[hoveredLocation].city}, {serverLocations[hoveredLocation].region}
              </h3>
              <Badge variant="secondary">
                {locationGroups[hoveredLocation].length} server{locationGroups[hoveredLocation].length > 1 ? 's' : ''}
              </Badge>
            </div>
            
            <div className="space-y-3">
              {locationGroups[hoveredLocation].map(server => (
                <div key={server.id} className="p-2 rounded bg-muted/30 border border-border/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">{server.name}</span>
                    <Badge
                      variant="outline"
                      className="capitalize"
                      style={{
                        borderColor: server.status === 'critical' ? 'hsl(0, 84%, 60%)' :
                                   server.status === 'warning' ? 'hsl(38, 92%, 50%)' :
                                   server.status === 'maintenance' ? 'hsl(215, 16%, 47%)' :
                                   'hsl(142, 70%, 45%)',
                        color: server.status === 'critical' ? 'hsl(0, 84%, 60%)' :
                               server.status === 'warning' ? 'hsl(38, 92%, 50%)' :
                               server.status === 'maintenance' ? 'hsl(215, 16%, 47%)' :
                               'hsl(142, 70%, 45%)'
                      }}
                    >
                      {server.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Activity className="w-3 h-3" />
                      <span>Uptime: {server.uptime || 99.9}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Zap className="w-3 h-3" />
                      <span>CPU: {server.telemetry.cpu}%</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      <span>Latency: {server.latency || Math.floor(Math.random() * 50) + 10}ms</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <AlertTriangle className="w-3 h-3" />
                      <span>Loss: {server.packetLoss || '0.01'}%</span>
                    </div>
                  </div>
                  
                  {server.lastIncident && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      Last incident: {server.lastIncident}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">Click for detailed regional dashboard</p>
            </div>
          </Card>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="p-3 bg-card/90 backdrop-blur-sm border-border shadow-primary">
          <div className="text-xs font-semibold text-foreground mb-2">Status Legend</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(142, 70%, 45%)', boxShadow: '0 0 8px hsl(142, 70%, 45%)' }} />
              <span className="text-muted-foreground">Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(38, 92%, 50%)', boxShadow: '0 0 8px hsl(38, 92%, 50%)' }} />
              <span className="text-muted-foreground">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(0, 84%, 60%)', boxShadow: '0 0 8px hsl(0, 84%, 60%)' }} />
              <span className="text-muted-foreground">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(215, 16%, 47%)', boxShadow: '0 0 8px hsl(215, 16%, 47%)' }} />
              <span className="text-muted-foreground">Maintenance</span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Geographic reference */}
      <div className="absolute bottom-4 left-4 z-10 text-xs text-muted-foreground pointer-events-none">
        <div className="flex items-center gap-2 bg-card/70 backdrop-blur-sm px-2 py-1 rounded border border-border/50">
          <div className="w-4 h-px border-t border-dashed border-muted-foreground" />
          <span>Equator / Tropic Lines</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalServerMap;
