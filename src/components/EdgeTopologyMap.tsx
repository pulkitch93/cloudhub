import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface EdgeNode {
  id: string;
  name: string;
  coordinates: [number, number];
  status: 'online' | 'warning' | 'offline';
  type: '5G' | 'IoT' | 'Edge';
  connections: string[];
}

interface EdgeTopologyMapProps {
  nodes: EdgeNode[];
}

const EdgeTopologyMap = ({ nodes }: EdgeTopologyMapProps) => {
  const [hoveredNode, setHoveredNode] = useState<EdgeNode | null>(null);

  // Convert lat/lng to SVG coordinates
  const coordToPosition = (coord: [number, number]) => {
    // Convert longitude (-180 to 180) to x (0 to 1000)
    const x = ((coord[0] + 180) / 360) * 1000;
    // Convert latitude (-90 to 90) to y (0 to 500), inverted
    const y = ((90 - coord[1]) / 180) * 500;
    return { x, y };
  };

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div className="relative w-full h-[500px] bg-gradient-to-br from-background via-background/95 to-muted/20">
        <svg
          viewBox="0 0 1000 500"
          className="absolute inset-0 w-full h-full"
          style={{ filter: 'drop-shadow(0 0 20px hsl(var(--primary) / 0.1))' }}
        >
          <defs>
            <pattern id="edge-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path
                d="M 50 0 L 0 0 0 50"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.5"
                opacity="0.2"
              />
            </pattern>

            <filter id="edge-glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <rect width="1000" height="500" fill="url(#edge-grid)" />

          {/* Simplified world map outline */}
          <g opacity="0.2" stroke="hsl(var(--primary))" strokeWidth="1" fill="none">
            {/* North America */}
            <path d="M 150,150 Q 180,120 220,140 Q 240,160 250,200 Q 240,250 220,280 Q 200,290 180,280 Q 160,260 150,240 Z" />
            {/* Europe */}
            <path d="M 480,160 Q 500,150 520,160 Q 530,180 525,200 Q 515,210 500,205 Q 485,195 480,180 Z" />
            {/* Asia */}
            <path d="M 550,140 Q 600,130 650,150 Q 700,170 720,200 Q 730,230 720,260 Q 700,280 670,275 Q 640,270 610,260 Q 580,240 560,210 Q 545,180 550,140 Z" />
          </g>

          {/* Connection lines */}
          {nodes.flatMap((node) =>
            node.connections.map((targetId) => {
              const target = nodes.find((n) => n.id === targetId);
              if (!target) return null;
              
              const startPos = coordToPosition(node.coordinates);
              const endPos = coordToPosition(target.coordinates);
              
              return (
                <line
                  key={`${node.id}-${targetId}`}
                  x1={startPos.x}
                  y1={startPos.y}
                  x2={endPos.x}
                  y2={endPos.y}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  opacity="0.6"
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
            }).filter(Boolean)
          )}

          {/* Edge nodes */}
          {nodes.map((node) => {
            const pos = coordToPosition(node.coordinates);
            const statusColor = 
              node.status === 'online' ? 'hsl(142, 70%, 45%)' :
              node.status === 'warning' ? 'hsl(38, 92%, 50%)' : 
              'hsl(0, 84%, 60%)';
            
            const isHovered = hoveredNode?.id === node.id;

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHoveredNode(node)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Pulse animation ring */}
                {isHovered && (
                  <circle
                    r="15"
                    fill="none"
                    stroke={statusColor}
                    strokeWidth="2"
                    opacity="0.6"
                  >
                    <animate
                      attributeName="r"
                      from="12"
                      to="20"
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

                {/* Node marker */}
                <circle
                  r={isHovered ? '10' : '8'}
                  fill={statusColor}
                  filter="url(#edge-glow)"
                  style={{ transition: 'all 0.2s' }}
                />

                {/* Type indicator icon */}
                <g transform="translate(-4, -4)" fill="white" fontSize="8">
                  {node.type === '5G' && (
                    <text x="0" y="6" fontSize="6" fontWeight="bold">5G</text>
                  )}
                  {node.type === 'IoT' && (
                    <circle cx="4" cy="4" r="2" />
                  )}
                  {node.type === 'Edge' && (
                    <rect x="1" y="1" width="6" height="6" rx="1" />
                  )}
                </g>
              </g>
            );
          })}
        </svg>

        {/* Hover tooltip */}
        {hoveredNode && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-none">
            <Card className="p-3 min-w-[200px] bg-card/95 backdrop-blur-sm border-border shadow-primary">
              <h3 className="font-bold text-sm mb-1 text-foreground">{hoveredNode.name}</h3>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Type:</span>
                  <span className="font-bold text-foreground">{hoveredNode.type}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-bold capitalize" style={{
                    color: hoveredNode.status === 'online' ? 'hsl(142, 70%, 45%)' :
                           hoveredNode.status === 'warning' ? 'hsl(38, 92%, 50%)' :
                           'hsl(0, 84%, 60%)'
                  }}>
                    {hoveredNode.status}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(142, 70%, 45%)' }} />
            <span className="text-sm text-muted-foreground">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(38, 92%, 50%)' }} />
            <span className="text-sm text-muted-foreground">Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(0, 84%, 60%)' }} />
            <span className="text-sm text-muted-foreground">Offline</span>
          </div>
          <Badge variant="outline" className="ml-auto">
            {nodes.length} Nodes
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default EdgeTopologyMap;
