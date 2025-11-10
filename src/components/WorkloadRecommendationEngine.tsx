import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Lightbulb, TrendingUp, Server, Cpu, HardDrive, Zap, ThumbsUp } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface WorkloadRecommendation {
  workloadId: string;
  workloadName: string;
  workloadType: 'database' | 'web' | 'compute' | 'storage';
  currentServer: string;
  recommendedServer: string;
  score: number;
  reasoning: string[];
  metrics: {
    cpuMatch: number;
    memoryMatch: number;
    storageMatch: number;
    networkMatch: number;
  };
  estimatedImprovement: {
    performance: number;
    cost: number;
    efficiency: number;
  };
}

const WorkloadRecommendationEngine = () => {
  const recommendations: WorkloadRecommendation[] = [
    {
      workloadId: 'wl-1',
      workloadName: 'Analytics Processing',
      workloadType: 'compute',
      currentServer: 'Web-05 (16 CPU, 32GB RAM)',
      recommendedServer: 'Compute-Node-02 (32 CPU, 128GB RAM)',
      score: 94,
      reasoning: [
        'Current CPU at 89% - needs more compute capacity',
        'Memory-intensive workload benefits from larger RAM',
        'Target server has 45% available capacity',
        'Network proximity to data sources optimal'
      ],
      metrics: {
        cpuMatch: 96,
        memoryMatch: 92,
        storageMatch: 78,
        networkMatch: 88
      },
      estimatedImprovement: {
        performance: 42,
        cost: -15,
        efficiency: 38
      }
    },
    {
      workloadId: 'wl-2',
      workloadName: 'Cache Layer',
      workloadType: 'storage',
      currentServer: 'App-Server-02 (8 CPU, 16GB RAM)',
      recommendedServer: 'Cache-Optimized-01 (16 CPU, 64GB RAM, NVMe)',
      score: 89,
      reasoning: [
        'High I/O operations need faster storage',
        'Memory-resident cache benefits from more RAM',
        'Current disk latency causing bottlenecks',
        'SSD storage provides 5x faster access times'
      ],
      metrics: {
        cpuMatch: 85,
        memoryMatch: 94,
        storageMatch: 98,
        networkMatch: 82
      },
      estimatedImprovement: {
        performance: 65,
        cost: -8,
        efficiency: 52
      }
    },
    {
      workloadId: 'wl-3',
      workloadName: 'Web Application',
      workloadType: 'web',
      currentServer: 'DB-Worker-03 (16 CPU, 64GB RAM)',
      recommendedServer: 'Web-Server-07 (8 CPU, 32GB RAM)',
      score: 82,
      reasoning: [
        'Over-provisioned resources on current server',
        'Web workload doesn\'t require DB-class hardware',
        'Target server better suited for HTTP traffic',
        'Cost reduction without performance impact'
      ],
      metrics: {
        cpuMatch: 78,
        memoryMatch: 80,
        storageMatch: 75,
        networkMatch: 92
      },
      estimatedImprovement: {
        performance: 5,
        cost: 35,
        efficiency: 28
      }
    }
  ];

  const getWorkloadIcon = (type: WorkloadRecommendation['workloadType']) => {
    switch (type) {
      case 'compute': return <Cpu className="h-4 w-4" />;
      case 'database': return <Server className="h-4 w-4" />;
      case 'storage': return <HardDrive className="h-4 w-4" />;
      case 'web': return <Zap className="h-4 w-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-primary';
    return 'text-warning';
  };

  const getProgressColor = (value: number) => {
    if (value >= 90) return 'bg-success';
    if (value >= 75) return 'bg-primary';
    return 'bg-warning';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          AI-Powered Workload Placement Recommendations
        </CardTitle>
        <CardDescription>
          Optimal server suggestions based on workload characteristics, hardware capabilities, and utilization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-card/50 border border-border">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Active Recommendations</div>
            <div className="text-2xl font-bold text-foreground">{recommendations.length}</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Avg. Improvement</div>
            <div className="text-2xl font-bold text-success">+38%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Est. Cost Savings</div>
            <div className="text-2xl font-bold text-success">$8.5K/mo</div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div
              key={rec.workloadId}
              className="p-4 rounded-lg border border-border bg-card/50 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getWorkloadIcon(rec.workloadType)}
                  <div>
                    <div className="font-semibold text-foreground">{rec.workloadName}</div>
                    <div className="text-xs text-muted-foreground capitalize">{rec.workloadType} workload</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-primary/10 text-primary border-primary/20">
                    <Lightbulb className="h-3 w-3 mr-1" />
                    Match Score
                  </Badge>
                  <span className={`text-2xl font-bold ${getScoreColor(rec.score)}`}>{rec.score}</span>
                </div>
              </div>

              {/* Current vs Recommended */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-secondary/10 border border-border">
                  <div className="text-xs font-semibold text-muted-foreground mb-1">Current Placement</div>
                  <div className="text-sm font-mono text-foreground">{rec.currentServer}</div>
                </div>
                <div className="p-3 rounded-lg bg-success/10 border border-success/20">
                  <div className="text-xs font-semibold text-success mb-1">Recommended Placement</div>
                  <div className="text-sm font-mono text-foreground">{rec.recommendedServer}</div>
                </div>
              </div>

              {/* Hardware Match Metrics */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-foreground">Hardware Compatibility:</div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">CPU Match</span>
                      <span className="font-mono">{rec.metrics.cpuMatch}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={rec.metrics.cpuMatch} className="h-2" />
                      <div 
                        className={`absolute inset-0 h-2 rounded-full ${getProgressColor(rec.metrics.cpuMatch)}`}
                        style={{ width: `${rec.metrics.cpuMatch}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Memory Match</span>
                      <span className="font-mono">{rec.metrics.memoryMatch}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={rec.metrics.memoryMatch} className="h-2" />
                      <div 
                        className={`absolute inset-0 h-2 rounded-full ${getProgressColor(rec.metrics.memoryMatch)}`}
                        style={{ width: `${rec.metrics.memoryMatch}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Storage Match</span>
                      <span className="font-mono">{rec.metrics.storageMatch}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={rec.metrics.storageMatch} className="h-2" />
                      <div 
                        className={`absolute inset-0 h-2 rounded-full ${getProgressColor(rec.metrics.storageMatch)}`}
                        style={{ width: `${rec.metrics.storageMatch}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-muted-foreground">Network Match</span>
                      <span className="font-mono">{rec.metrics.networkMatch}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={rec.metrics.networkMatch} className="h-2" />
                      <div 
                        className={`absolute inset-0 h-2 rounded-full ${getProgressColor(rec.metrics.networkMatch)}`}
                        style={{ width: `${rec.metrics.networkMatch}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Reasoning */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-foreground">Recommendation Factors:</div>
                <div className="space-y-1">
                  {rec.reasoning.map((reason, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <ThumbsUp className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{reason}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estimated Improvements */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="text-xs font-semibold text-foreground mb-2">Estimated Improvements:</div>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-muted-foreground mb-1">Performance</div>
                    <div className={`text-lg font-bold ${rec.estimatedImprovement.performance > 0 ? 'text-success' : 'text-foreground'}`}>
                      {rec.estimatedImprovement.performance > 0 ? '+' : ''}{rec.estimatedImprovement.performance}%
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Cost</div>
                    <div className={`text-lg font-bold ${rec.estimatedImprovement.cost < 0 ? 'text-success' : 'text-destructive'}`}>
                      {rec.estimatedImprovement.cost}%
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground mb-1">Efficiency</div>
                    <div className={`text-lg font-bold ${rec.estimatedImprovement.efficiency > 0 ? 'text-success' : 'text-foreground'}`}>
                      {rec.estimatedImprovement.efficiency > 0 ? '+' : ''}{rec.estimatedImprovement.efficiency}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2 border-t border-border">
                <Button size="sm">
                  Apply Recommendation
                </Button>
                <Button size="sm" variant="outline">
                  Simulate Impact
                </Button>
                <Button size="sm" variant="ghost">
                  Dismiss
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkloadRecommendationEngine;
