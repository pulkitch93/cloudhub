import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Server, HardDrive, Thermometer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface PredictionItem {
  serverId: string;
  serverName: string;
  failureProbability: number;
  timeframe: '24h' | '48h' | '72h';
  riskFactors: string[];
  recommendation: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const PredictiveFailureAnalysis = () => {
  const predictions: PredictionItem[] = [
    {
      serverId: 'srv-14',
      serverName: 'DB-Worker-03',
      failureProbability: 87,
      timeframe: '24h',
      riskFactors: ['High disk I/O variance', 'Increasing temperature trend', 'Memory leak pattern detected'],
      recommendation: 'Schedule immediate maintenance and failover to replica',
      severity: 'critical'
    },
    {
      serverId: 'srv-22',
      serverName: 'Web-05',
      failureProbability: 64,
      timeframe: '48h',
      riskFactors: ['CPU thermal throttling events', 'Network packet loss increasing'],
      recommendation: 'Monitor closely, consider workload redistribution',
      severity: 'high'
    },
    {
      serverId: 'srv-08',
      serverName: 'App-Server-02',
      failureProbability: 42,
      timeframe: '72h',
      riskFactors: ['Gradual disk space reduction', 'Minor memory pressure'],
      recommendation: 'Disk cleanup recommended in next maintenance window',
      severity: 'medium'
    },
    {
      serverId: 'srv-31',
      serverName: 'Cache-01',
      failureProbability: 23,
      timeframe: '72h',
      riskFactors: ['Slight performance degradation'],
      recommendation: 'Continue monitoring, no immediate action required',
      severity: 'low'
    }
  ];

  const getSeverityBadge = (severity: PredictionItem['severity']) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Critical</Badge>;
      case 'high':
        return <Badge className="bg-warning/10 text-warning border-warning/20">High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Medium Risk</Badge>;
      case 'low':
        return <Badge className="bg-success/10 text-success border-success/20">Low Risk</Badge>;
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 75) return 'text-destructive';
    if (probability >= 50) return 'text-warning';
    return 'text-success';
  };

  const getProgressColor = (probability: number) => {
    if (probability >= 75) return 'bg-destructive';
    if (probability >= 50) return 'bg-warning';
    return 'bg-success';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI-Powered Predictive Failure Analysis
            </CardTitle>
            <CardDescription>
              Machine learning models analyzing telemetry patterns to predict server failures
            </CardDescription>
          </div>
          <Badge className="bg-primary/10 text-primary border-primary/20">
            <TrendingUp className="h-3 w-3 mr-1" />
            AI Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Model Performance Metrics */}
        <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-card/50 border border-border">
          <div>
            <div className="text-xs text-muted-foreground mb-1">Model Accuracy</div>
            <div className="text-2xl font-bold text-foreground">94.2%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">Predictions Today</div>
            <div className="text-2xl font-bold text-foreground">247</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground mb-1">False Positives</div>
            <div className="text-2xl font-bold text-success">5.8%</div>
          </div>
        </div>

        {/* Predictions List */}
        <div className="space-y-4">
          {predictions.map((prediction) => (
            <div
              key={prediction.serverId}
              className="p-4 rounded-lg border border-border bg-card/50 space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Server className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold text-foreground">{prediction.serverName}</div>
                    <div className="text-xs text-muted-foreground">ID: {prediction.serverId}</div>
                  </div>
                </div>
                {getSeverityBadge(prediction.severity)}
              </div>

              {/* Failure Probability */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Failure Probability</span>
                  <span className={`font-bold text-lg ${getProbabilityColor(prediction.failureProbability)}`}>
                    {prediction.failureProbability}%
                  </span>
                </div>
                <div className="relative">
                  <Progress value={prediction.failureProbability} className="h-2" />
                  <div 
                    className={`absolute inset-0 h-2 rounded-full ${getProgressColor(prediction.failureProbability)}`}
                    style={{ width: `${prediction.failureProbability}%` }}
                  />
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Expected within {prediction.timeframe}</span>
                </div>
              </div>

              {/* Risk Factors */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-foreground">Contributing Risk Factors:</div>
                <div className="space-y-1">
                  {prediction.riskFactors.map((factor, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs">
                      <span className="text-destructive mt-0.5">•</span>
                      <span className="text-muted-foreground">{factor}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-xs font-semibold text-primary mb-1">Recommended Action:</div>
                    <div className="text-xs text-foreground">{prediction.recommendation}</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button size="sm" variant="default">
                  Create Maintenance Task
                </Button>
                <Button size="sm" variant="outline">
                  View Telemetry
                </Button>
                <Button size="sm" variant="outline">
                  Dismiss
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* AI Model Info */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <div className="font-semibold text-foreground">AI Model: LSTM + Transformer Hybrid</div>
              <div className="text-muted-foreground">
                Analyzing 50+ telemetry metrics including CPU, memory, disk I/O, temperature, network patterns, 
                and historical failure data to predict infrastructure issues before they occur.
              </div>
              <div className="text-muted-foreground">
                Last trained: 2 hours ago • Training data: 18 months • Confidence threshold: 75%
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictiveFailureAnalysis;
