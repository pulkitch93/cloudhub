import React, { useState } from 'react';
import { Server } from '@/types/digitalTwin';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Server as ServerIcon } from 'lucide-react';

interface GlobalServerMapProps {
  servers: Server[];
  onServerSelect?: (server: Server) => void;
}

// Server locations mapped to percentage positions on the map
const serverLocations: Record<string, { x: number; y: number; city: string; region: string }> = {
  'US-East': { x: 25, y: 40, city: 'New York', region: 'US East' },
  'US-West': { x: 15, y: 42, city: 'San Francisco', region: 'US West' },
  'EU-Central': { x: 52, y: 35, city: 'Frankfurt', region: 'EU Central' },
  'AP-Southeast': { x: 78, y: 58, city: 'Singapore', region: 'AP Southeast' },
  'UK-South': { x: 50, y: 32, city: 'London', region: 'UK South' },
  'AU-East': { x: 82, y: 75, city: 'Sydney', region: 'AU East' },
};

const GlobalServerMap = ({ servers, onServerSelect }: GlobalServerMapProps) => {
  const [hoveredServer, setHoveredServer] = useState<Server | null>(null);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);

  const handleServerClick = (server: Server) => {
    setSelectedServer(server);
    if (onServerSelect) {
      onServerSelect(server);
    }
  };

  // Group servers by location with slight offsets
  const getServerPosition = (server: Server, index: number) => {
    const location = server.location || 'US-East';
    const coords = serverLocations[location] || serverLocations['US-East'];
    
    // Add small offset based on index to prevent exact overlap
    const offsetX = (index % 3 - 1) * 1.5;
    const offsetY = Math.floor(index / 3) * 1.5;
    
    return {
      x: coords.x + offsetX,
      y: coords.y + offsetY,
      ...coords
    };
  };

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden bg-gradient-to-br from-background via-background/95 to-muted/20 border border-border">
      {/* SVG World Map */}
      <svg
        viewBox="0 0 1000 500"
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.1))' }}
      >
        {/* Grid lines for reference */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="hsl(var(--border))"
              strokeWidth="0.5"
              opacity="0.2"
            />
          </pattern>
          
          {/* Glow effect for markers */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        <rect width="1000" height="500" fill="url(#grid)" />
        
        {/* Simplified world map outline */}
        <g opacity="0.3" stroke="hsl(var(--primary))" strokeWidth="1.5" fill="none">
          {/* North America */}
          <path d="M 150,150 Q 180,120 220,140 Q 240,160 250,200 Q 240,250 220,280 Q 200,290 180,280 Q 160,260 150,240 Z" />
          
          {/* South America */}
          <path d="M 220,280 Q 230,320 240,360 Q 235,390 220,400 Q 205,395 200,370 Q 195,340 200,310 Z" />
          
          {/* Europe */}
          <path d="M 480,160 Q 500,150 520,160 Q 530,180 525,200 Q 515,210 500,205 Q 485,195 480,180 Z" />
          
          {/* Africa */}
          <path d="M 500,220 Q 520,240 530,280 Q 535,320 520,360 Q 505,370 490,360 Q 480,330 485,290 Q 490,250 500,220 Z" />
          
          {/* Asia */}
          <path d="M 550,140 Q 600,130 650,150 Q 700,170 720,200 Q 730,230 720,260 Q 700,280 670,275 Q 640,270 610,260 Q 580,240 560,210 Q 545,180 550,140 Z" />
          
          {/* Australia */}
          <path d="M 780,340 Q 810,335 830,350 Q 835,370 825,385 Q 805,390 785,380 Q 775,365 780,340 Z" />
        </g>
        
        {/* Connection lines between servers */}
        {servers.map((server, i) => {
          const pos = getServerPosition(server, servers.filter(s => s.location === server.location).indexOf(server));
          return servers.slice(i + 1).map((targetServer, j) => {
            const targetPos = getServerPosition(targetServer, servers.filter(s => s.location === targetServer.location).indexOf(targetServer));
            return (
              <line
                key={`${i}-${j}`}
                x1={pos.x * 10}
                y1={pos.y * 10}
                x2={targetPos.x * 10}
                y2={targetPos.y * 10}
                stroke="hsl(var(--primary))"
                strokeWidth="0.5"
                opacity="0.1"
                strokeDasharray="5,5"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="10"
                  to="0"
                  dur="2s"
                  repeatCount="indefinite"
                />
              </line>
            );
          });
        })}
        
        {/* Server markers */}
        {servers.map((server, index) => {
          const locationServers = servers.filter(s => s.location === server.location);
          const localIndex = locationServers.indexOf(server);
          const pos = getServerPosition(server, localIndex);
          
          const statusColor = 
            server.status === 'critical' ? 'hsl(0, 84%, 60%)' :
            server.status === 'warning' ? 'hsl(38, 92%, 50%)' :
            server.status === 'maintenance' ? 'hsl(215, 16%, 47%)' :
            'hsl(142, 70%, 45%)';
          
          const isHovered = hoveredServer?.id === server.id;
          const isSelected = selectedServer?.id === server.id;
          
          return (
            <g
              key={server.id}
              transform={`translate(${pos.x * 10}, ${pos.y * 10})`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredServer(server)}
              onMouseLeave={() => setHoveredServer(null)}
              onClick={() => handleServerClick(server)}
            >
              {/* Pulse animation ring */}
              {(isHovered || isSelected) && (
                <circle
                  r="20"
                  fill="none"
                  stroke={statusColor}
                  strokeWidth="2"
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    from="15"
                    to="25"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.6"
                    to="0"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              
              {/* Server marker */}
              <circle
                r={isHovered || isSelected ? '12' : '10'}
                fill={statusColor}
                filter="url(#glow)"
                style={{ transition: 'all 0.2s' }}
              />
              
              {/* Server icon */}
              <g transform="translate(-6, -6)" fill="white">
                <rect x="2" y="2" width="8" height="3" rx="0.5" />
                <rect x="2" y="6" width="8" height="3" rx="0.5" />
                <circle cx="3.5" cy="3.5" r="0.3" />
                <circle cx="3.5" cy="7.5" r="0.3" />
              </g>
            </g>
          );
        })}
      </svg>
      
      {/* Info overlay */}
      <div className="absolute top-4 left-4 space-y-2 pointer-events-none z-10">
        <Badge className="bg-card/90 backdrop-blur-sm border-border pointer-events-auto">
          <ServerIcon className="w-3 h-3 mr-1" />
          Global Server Distribution ({servers.length} servers)
        </Badge>
      </div>
      
      {/* Hover tooltip */}
      {hoveredServer && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
          <Card className="p-4 min-w-[280px] bg-card/95 backdrop-blur-sm border-border shadow-primary">
            <h3 className="font-bold text-sm mb-2 text-foreground">{hoveredServer.name}</h3>
            <div className="text-xs text-muted-foreground mb-3">
              {serverLocations[hoveredServer.location || 'US-East']?.city}, {serverLocations[hoveredServer.location || 'US-East']?.region}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Status:</span>
                <span className="font-bold capitalize" style={{
                  color: hoveredServer.status === 'critical' ? 'hsl(0, 84%, 60%)' :
                         hoveredServer.status === 'warning' ? 'hsl(38, 92%, 50%)' :
                         hoveredServer.status === 'maintenance' ? 'hsl(215, 16%, 47%)' :
                         'hsl(142, 70%, 45%)'
                }}>
                  {hoveredServer.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">CPU:</span>
                <span className="font-bold text-foreground">{hoveredServer.telemetry.cpu}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Memory:</span>
                <span className="font-bold text-foreground">{hoveredServer.telemetry.memory}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Temp:</span>
                <span className="font-bold text-foreground">{hoveredServer.telemetry.temperature}°C</span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">Click for detailed telemetry</p>
            </div>
          </Card>
        </div>
      )}
      
      {/* Legend */}
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
    </div>
  );
};

export default GlobalServerMap;
