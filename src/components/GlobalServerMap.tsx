import { useState } from 'react';
import { Server } from '@/types/digitalTwin';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Server as ServerIcon } from 'lucide-react';

interface GlobalServerMapProps {
  servers: Server[];
  onServerSelect?: (server: Server) => void;
}

// Server locations mapped to real coordinates
const serverLocations: Record<string, { lat: number; lng: number; city: string; region: string }> = {
  'US-East': { lat: 40.7128, lng: -74.0060, city: 'New York', region: 'US East' },
  'US-West': { lat: 37.7749, lng: -122.4194, city: 'San Francisco', region: 'US West' },
  'EU-Central': { lat: 50.1109, lng: 8.6821, city: 'Frankfurt', region: 'EU Central' },
  'AP-Southeast': { lat: 1.3521, lng: 103.8198, city: 'Singapore', region: 'AP Southeast' },
  'UK-South': { lat: 51.5074, lng: -0.1278, city: 'London', region: 'UK South' },
  'AU-East': { lat: -33.8688, lng: 151.2093, city: 'Sydney', region: 'AU East' },
};

const GlobalServerMap = ({ servers, onServerSelect }: GlobalServerMapProps) => {
  const [hoveredLocation, setHoveredLocation] = useState<string | null>(null);

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

  // Group servers by location
  const locationGroups = servers.reduce((acc, server) => {
    const location = server.location || 'US-East';
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(server);
    return acc;
  }, {} as Record<string, Server[]>);

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden bg-gradient-to-br from-background via-background/95 to-muted/20 border border-border">
      <svg
        viewBox="0 0 1000 500"
        className="absolute inset-0 w-full h-full"
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
        </defs>
        
        <rect width="1000" height="500" fill="url(#grid)" />
        
        {/* Geographic lines */}
        <g opacity="0.2" stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" strokeDasharray="5,5">
          <line x1="50" y1="250" x2="950" y2="250" />
          <line x1="50" y1="180" x2="950" y2="180" />
          <line x1="50" y1="320" x2="950" y2="320" />
          <line x1="50" y1="110" x2="950" y2="110" />
          <line x1="50" y1="390" x2="950" y2="390" />
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

        {/* Country borders */}
        <g opacity="0.3" stroke="hsl(var(--primary))" strokeWidth="0.5" fill="none">
          <path d="M 125,160 L 300,170" />
          <path d="M 180,320 L 260,315" />
          <path d="M 520,160 L 540,200 L 560,180" />
          <path d="M 490,300 L 560,310 L 530,380" />
          <path d="M 680,180 L 750,220 L 800,240" />
        </g>

        {/* Connection lines between servers */}
        {servers.map((server, i) => {
          const serverLoc = serverLocations[server.location || 'US-East'];
          const pos = coordToPosition(serverLoc.lat, serverLoc.lng);
          return servers.slice(i + 1).map((targetServer, j) => {
            const targetLoc = serverLocations[targetServer.location || 'US-East'];
            const targetPos = coordToPosition(targetLoc.lat, targetLoc.lng);
            return (
              <line
                key={`${i}-${j}`}
                x1={pos.x}
                y1={pos.y}
                x2={targetPos.x}
                y2={targetPos.y}
                stroke="hsl(var(--primary))"
                strokeWidth="1"
                opacity="0.2"
                strokeDasharray="5,5"
              >
                <animate attributeName="stroke-dashoffset" from="10" to="0" dur="2s" repeatCount="indefinite" />
              </line>
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
            >
              {isHovered && (
                <circle r="20" fill="none" stroke={statusColor} strokeWidth="2" opacity="0.6">
                  <animate attributeName="r" from="15" to="25" dur="1.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                </circle>
              )}
              
              <circle r="8" fill={statusColor} filter="url(#glow)" style={{ transition: 'all 0.2s' }} />
              <circle r="3" fill="white" />

              {locationServers.length > 1 && (
                <g transform="translate(8, -8)">
                  <circle r="6" fill="hsl(var(--accent))" />
                  <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="8" fontWeight="bold">
                    {locationServers.length}
                  </text>
                </g>
              )}

              <g transform="translate(0, 20)">
                <rect x="-35" y="-10" width="70" height="18" rx="4" fill="hsl(var(--popover))" stroke="hsl(var(--border))" strokeWidth="1" opacity={isHovered ? "1" : "0.9"} />
                <text x="0" y="0" textAnchor="middle" dominantBaseline="central" fill="hsl(var(--popover-foreground))" fontSize="10" fontWeight="600">
                  {location.city}
                </text>
              </g>
            </g>
          );
        })}
      </svg>
      
      <div className="absolute top-4 left-4 space-y-2 pointer-events-none z-10">
        <Badge className="bg-card/90 backdrop-blur-sm border-border pointer-events-auto">
          <ServerIcon className="w-3 h-3 mr-1" />
          Global Server Distribution ({servers.length} servers)
        </Badge>
      </div>
      
      {hoveredLocation && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
          <Card className="p-4 min-w-[280px] bg-card/95 backdrop-blur-sm border-border shadow-primary">
            <h3 className="font-bold text-sm mb-2 text-foreground">
              {serverLocations[hoveredLocation].city}, {serverLocations[hoveredLocation].region}
            </h3>
            <div className="space-y-2">
              <div className="text-xs text-muted-foreground">
                {locationGroups[hoveredLocation].length} server{locationGroups[hoveredLocation].length > 1 ? 's' : ''} at this location
              </div>
              <div className="space-y-1">
                {locationGroups[hoveredLocation].map(server => (
                  <div key={server.id} className="flex items-center justify-between text-xs">
                    <span className="text-foreground font-medium">{server.name}</span>
                    <span className="capitalize" style={{
                      color: server.status === 'critical' ? 'hsl(0, 84%, 60%)' :
                             server.status === 'warning' ? 'hsl(38, 92%, 50%)' :
                             server.status === 'maintenance' ? 'hsl(215, 16%, 47%)' :
                             'hsl(142, 70%, 45%)'
                    }}>
                      {server.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">Click for detailed telemetry</p>
            </div>
          </Card>
        </div>
      )}
      
      <div className="absolute bottom-4 right-4 z-10">
        <Card className="p-3 bg-card/90 backdrop-blur-sm border-border">
          <div className="text-xs font-semibold text-foreground mb-2">Status Legend</div>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(142, 70%, 45%)' }} />
              <span className="text-muted-foreground">Healthy</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(38, 92%, 50%)' }} />
              <span className="text-muted-foreground">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(0, 84%, 60%)' }} />
              <span className="text-muted-foreground">Critical</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(215, 16%, 47%)' }} />
              <span className="text-muted-foreground">Maintenance</span>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="absolute bottom-4 left-4 z-10 text-xs text-muted-foreground space-y-1 pointer-events-none">
        <div className="flex items-center gap-2">
          <div className="w-4 h-px bg-muted-foreground opacity-40" style={{ borderTop: '1px dashed' }} />
          <span>Equator / Tropic Lines</span>
        </div>
      </div>
    </div>
  );
};

export default GlobalServerMap;
