import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Server, Database, Network, Activity, ArrowRight } from 'lucide-react';

interface Node {
  id: string;
  type: 'server' | 'database' | 'load-balancer';
  name: string;
  status: 'healthy' | 'warning' | 'critical';
  position: { x: number; y: number };
}

interface Connection {
  from: string;
  to: string;
  traffic: number; // Mbps
  latency: number; // ms
}

const InfrastructureTopology = () => {
  const [nodes] = useState<Node[]>([
    { id: 'lb-1', type: 'load-balancer', name: 'LB-Primary', status: 'healthy', position: { x: 400, y: 50 } },
    { id: 'srv-1', type: 'server', name: 'Web-01', status: 'healthy', position: { x: 200, y: 200 } },
    { id: 'srv-2', type: 'server', name: 'Web-02', status: 'warning', position: { x: 400, y: 200 } },
    { id: 'srv-3', type: 'server', name: 'Web-03', status: 'healthy', position: { x: 600, y: 200 } },
    { id: 'db-1', type: 'database', name: 'DB-Primary', status: 'healthy', position: { x: 300, y: 400 } },
    { id: 'db-2', type: 'database', name: 'DB-Replica', status: 'healthy', position: { x: 500, y: 400 } },
  ]);

  const [connections, setConnections] = useState<Connection[]>([
    { from: 'lb-1', to: 'srv-1', traffic: 45.2, latency: 2 },
    { from: 'lb-1', to: 'srv-2', traffic: 78.5, latency: 3 },
    { from: 'lb-1', to: 'srv-3', traffic: 52.1, latency: 2 },
    { from: 'srv-1', to: 'db-1', traffic: 23.4, latency: 5 },
    { from: 'srv-2', to: 'db-1', traffic: 41.2, latency: 6 },
    { from: 'srv-3', to: 'db-1', traffic: 28.9, latency: 5 },
    { from: 'db-1', to: 'db-2', traffic: 15.3, latency: 8 },
  ]);

  // Simulate real-time traffic updates
  useEffect(() => {
    const interval = setInterval(() => {
      setConnections(prev => prev.map(conn => ({
        ...conn,
        traffic: Math.max(10, conn.traffic + (Math.random() - 0.5) * 10),
        latency: Math.max(1, conn.latency + (Math.random() - 0.5) * 2)
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const getNodeIcon = (type: Node['type']) => {
    switch (type) {
      case 'server': return <Server className="h-6 w-6" />;
      case 'database': return <Database className="h-6 w-6" />;
      case 'load-balancer': return <Network className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status: Node['status']) => {
    switch (status) {
      case 'healthy': return 'bg-success/20 border-success text-success';
      case 'warning': return 'bg-warning/20 border-warning text-warning';
      case 'critical': return 'bg-destructive/20 border-destructive text-destructive';
    }
  };

  const getTrafficColor = (traffic: number) => {
    if (traffic > 70) return 'stroke-destructive';
    if (traffic > 50) return 'stroke-warning';
    return 'stroke-success';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Infrastructure Topology
        </CardTitle>
        <CardDescription>Real-time network connections and traffic flow visualization</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full h-[500px] bg-card/50 rounded-lg border border-border overflow-hidden">
          <svg className="absolute inset-0 w-full h-full">
            {/* Draw connections */}
            {connections.map((conn, idx) => {
              const fromNode = nodes.find(n => n.id === conn.from);
              const toNode = nodes.find(n => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              const x1 = fromNode.position.x;
              const y1 = fromNode.position.y;
              const x2 = toNode.position.x;
              const y2 = toNode.position.y;

              // Calculate midpoint for traffic label
              const midX = (x1 + x2) / 2;
              const midY = (y1 + y2) / 2;

              return (
                <g key={idx}>
                  {/* Connection line */}
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    className={getTrafficColor(conn.traffic)}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="10"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </line>
                  
                  {/* Traffic indicator */}
                  <circle
                    className={getTrafficColor(conn.traffic)}
                    fill="currentColor"
                    r="3"
                  >
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      path={`M ${x1} ${y1} L ${x2} ${y2}`}
                    />
                  </circle>

                  {/* Traffic label */}
                  <text
                    x={midX}
                    y={midY - 10}
                    className="fill-foreground text-xs"
                    textAnchor="middle"
                  >
                    {conn.traffic.toFixed(1)} Mbps
                  </text>
                  <text
                    x={midX}
                    y={midY + 5}
                    className="fill-muted-foreground text-xs"
                    textAnchor="middle"
                  >
                    {conn.latency.toFixed(1)}ms
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Draw nodes */}
          {nodes.map((node) => (
            <div
              key={node.id}
              className={`absolute flex flex-col items-center gap-1 -translate-x-1/2 -translate-y-1/2 transition-all ${getStatusColor(node.status)} rounded-lg p-3 border-2`}
              style={{ left: node.position.x, top: node.position.y }}
            >
              {getNodeIcon(node.type)}
              <span className="text-xs font-medium whitespace-nowrap">{node.name}</span>
              <div className="flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span className="text-xs">{node.status}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success"></div>
            <span className="text-muted-foreground">Healthy (&lt;50 Mbps)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning"></div>
            <span className="text-muted-foreground">Moderate (50-70 Mbps)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
            <span className="text-muted-foreground">High (&gt;70 Mbps)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfrastructureTopology;
