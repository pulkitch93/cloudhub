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
        
        {/* Detailed world map outline */}
        <g opacity="0.5" stroke="hsl(var(--primary))" strokeWidth="2" fill="hsl(var(--primary) / 0.05)">
          {/* North America */}
          <path d="M 130,120 L 150,100 L 180,95 L 200,100 L 220,110 L 240,130 L 255,150 L 265,180 L 270,210 L 268,240 L 260,270 L 245,295 L 225,310 L 200,315 L 180,310 L 165,295 L 155,270 L 150,240 L 145,210 L 140,180 L 135,150 Z" />
          
          {/* South America */}
          <path d="M 225,315 L 235,340 L 242,370 L 245,400 L 240,420 L 230,430 L 215,428 L 205,415 L 200,390 L 198,360 L 200,330 L 210,320 Z" />
          
          {/* Central America connection */}
          <path d="M 200,315 L 210,320 L 220,315 L 225,315" fill="none" />
          
          {/* Europe */}
          <path d="M 470,145 L 490,135 L 510,140 L 530,150 L 545,165 L 550,185 L 548,205 L 540,220 L 525,228 L 505,230 L 485,225 L 470,210 L 465,190 L 468,170 Z" />
          
          {/* Africa */}
          <path d="M 495,215 L 510,230 L 525,250 L 535,275 L 540,305 L 542,335 L 538,365 L 528,385 L 512,395 L 492,398 L 475,390 L 465,370 L 463,340 L 468,310 L 475,280 L 485,250 L 492,230 Z" />
          
          {/* Asia */}
          <path d="M 550,125 L 580,115 L 615,118 L 650,130 L 685,145 L 715,165 L 740,190 L 755,215 L 760,240 L 755,265 L 740,285 L 715,295 L 685,298 L 655,295 L 625,285 L 595,270 L 570,250 L 555,225 L 548,195 L 548,165 L 550,140 Z" />
          
          {/* Middle East connection */}
          <path d="M 548,205 L 560,215 L 575,220 L 585,225" fill="none" />
          
          {/* India */}
          <path d="M 610,230 L 625,235 L 635,250 L 640,270 L 638,290 L 628,305 L 615,310 L 602,305 L 595,290 L 593,270 L 598,250 L 605,235 Z" />
          
          {/* Southeast Asia */}
          <path d="M 640,270 L 655,275 L 670,285 L 678,300 L 675,315 L 665,325 L 650,328 L 640,320 L 638,305 Z" />
          
          {/* Australia */}
          <path d="M 765,330 L 795,325 L 820,332 L 840,345 L 850,365 L 848,385 L 835,400 L 815,408 L 790,410 L 770,405 L 755,390 L 750,370 L 753,350 Z" />
          
          {/* Greenland */}
          <path d="M 295,45 L 320,40 L 340,48 L 350,65 L 348,85 L 335,100 L 315,105 L 295,98 L 285,82 L 288,65 Z" />
          
          {/* Japan */}
          <path d="M 805,195 L 815,190 L 825,195 L 828,210 L 825,225 L 815,230 L 805,225 L 802,210 Z" />
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
