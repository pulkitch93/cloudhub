import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  AlertTriangle, 
  Brain, 
  TrendingUp, 
  Activity,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { useToast } from '@/hooks/use-toast';

interface DeviceHealth {
  deviceId: string;
  deviceName: string;
  failureProbability: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  predictedFailureTime: number; // hours
  keyIndicators: {
    cpu: number;
    memory: number;
    temperature: number;
    errorRate: number;
  };
  recommendations: string[];
}

interface TelemetryHistory {
  timestamp: string;
  cpu: number;
  memory: number;
  temperature: number;
  errorRate: number;
}

const PredictiveMaintenanceML = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [deviceHealthScores, setDeviceHealthScores] = useState<DeviceHealth[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<DeviceHealth | null>(null);
  const { toast } = useToast();

  // Simulate historical telemetry data
  const [telemetryHistory] = useState<TelemetryHistory[]>([
    { timestamp: '00:00', cpu: 45, memory: 62, temperature: 38, errorRate: 0.2 },
    { timestamp: '04:00', cpu: 52, memory: 65, temperature: 42, errorRate: 0.3 },
    { timestamp: '08:00', cpu: 68, memory: 72, temperature: 48, errorRate: 0.5 },
    { timestamp: '12:00', cpu: 75, memory: 78, temperature: 55, errorRate: 0.8 },
    { timestamp: '16:00', cpu: 82, memory: 84, temperature: 62, errorRate: 1.2 },
    { timestamp: '20:00', cpu: 88, memory: 89, temperature: 68, errorRate: 1.8 },
    { timestamp: '24:00', cpu: 91, memory: 92, temperature: 72, errorRate: 2.3 },
  ]);

  // Simulate ML analysis
  const runPredictiveAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    // Simulate ML model analysis with realistic patterns
    setTimeout(() => {
      const mockHealthScores: DeviceHealth[] = [
        {
          deviceId: 'edge-003',
          deviceName: 'Edge Server Gamma',
          failureProbability: 87,
          riskLevel: 'critical',
          predictedFailureTime: 12,
          keyIndicators: {
            cpu: 91,
            memory: 92,
            temperature: 72,
            errorRate: 2.3,
          },
          recommendations: [
            'Schedule immediate maintenance window',
            'Reduce workload by 40%',
            'Check cooling system',
            'Backup critical data',
          ],
        },
        {
          deviceId: 'edge-002',
          deviceName: 'IoT Gateway Beta',
          failureProbability: 65,
          riskLevel: 'high',
          predictedFailureTime: 48,
          keyIndicators: {
            cpu: 78,
            memory: 82,
            temperature: 58,
            errorRate: 1.1,
          },
          recommendations: [
            'Plan maintenance within 48 hours',
            'Monitor memory usage closely',
            'Review error logs',
          ],
        },
        {
          deviceId: 'edge-001',
          deviceName: '5G Node Alpha',
          failureProbability: 32,
          riskLevel: 'medium',
          predictedFailureTime: 168,
          keyIndicators: {
            cpu: 52,
            memory: 61,
            temperature: 42,
            errorRate: 0.4,
          },
          recommendations: [
            'Continue routine monitoring',
            'Schedule preventive maintenance',
          ],
        },
        {
          deviceId: 'edge-004',
          deviceName: '5G Node Delta',
          failureProbability: 15,
          riskLevel: 'low',
          predictedFailureTime: 720,
          keyIndicators: {
            cpu: 38,
            memory: 45,
            temperature: 35,
            errorRate: 0.1,
          },
          recommendations: [
            'Device operating normally',
            'No immediate action required',
          ],
        },
      ];

      setDeviceHealthScores(mockHealthScores);
      setIsAnalyzing(false);

      // Show critical alerts
      const criticalDevices = mockHealthScores.filter(d => d.riskLevel === 'critical');
      if (criticalDevices.length > 0) {
        toast({
          title: 'Critical Failure Risk Detected',
          description: `${criticalDevices[0].deviceName} requires immediate attention`,
          variant: 'destructive',
        });
      }
    }, 3000);
  };

  useEffect(() => {
    // Run initial analysis
    runPredictiveAnalysis();
  }, []);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'critical':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Critical Risk</Badge>;
      case 'high':
        return <Badge className="bg-orange-500/10 text-orange-500 border-orange-500/20">High Risk</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Medium Risk</Badge>;
      case 'low':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Low Risk</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Analysis Control */}
      <Card className="bg-card border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">ML Predictive Maintenance</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered failure prediction based on telemetry patterns
              </p>
            </div>
          </div>
          <Button 
            onClick={runPredictiveAnalysis} 
            disabled={isAnalyzing}
            className="gap-2"
          >
            <Zap className="h-4 w-4" />
            {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
          </Button>
        </div>

        {isAnalyzing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Analyzing telemetry data...</span>
              <span className="text-foreground">{analysisProgress}%</span>
            </div>
            <Progress value={analysisProgress} className="h-2" />
          </div>
        )}

        {!isAnalyzing && deviceHealthScores.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-border">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {deviceHealthScores.filter(d => d.riskLevel === 'critical').length}
              </p>
              <p className="text-sm text-red-500">Critical</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {deviceHealthScores.filter(d => d.riskLevel === 'high').length}
              </p>
              <p className="text-sm text-orange-500">High Risk</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {deviceHealthScores.filter(d => d.riskLevel === 'medium').length}
              </p>
              <p className="text-sm text-yellow-500">Medium Risk</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">
                {deviceHealthScores.filter(d => d.riskLevel === 'low').length}
              </p>
              <p className="text-sm text-green-500">Low Risk</p>
            </div>
          </div>
        )}
      </Card>

      {/* Device Health Scores */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card border-border">
          <div className="p-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Device Risk Assessment</h3>
            <p className="text-sm text-muted-foreground">Ranked by failure probability</p>
          </div>
          <ScrollArea className="h-[500px]">
            <div className="p-6 space-y-4">
              {deviceHealthScores
                .sort((a, b) => b.failureProbability - a.failureProbability)
                .map((device) => (
                  <div
                    key={device.deviceId}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedDevice?.deviceId === device.deviceId
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedDevice(device)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <AlertTriangle className={`h-5 w-5 ${getRiskColor(device.riskLevel)}`} />
                        <div>
                          <h4 className="font-medium text-foreground">{device.deviceName}</h4>
                          <p className="text-xs text-muted-foreground">{device.deviceId}</p>
                        </div>
                      </div>
                      {getRiskBadge(device.riskLevel)}
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Failure Probability</span>
                        <span className={`font-medium ${getRiskColor(device.riskLevel)}`}>
                          {device.failureProbability}%
                        </span>
                      </div>
                      <Progress 
                        value={device.failureProbability} 
                        className="h-2"
                      />
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>Predicted failure in ~{device.predictedFailureTime}h</span>
                    </div>
                  </div>
                ))}
            </div>
          </ScrollArea>
        </Card>

        {/* Detailed Analysis */}
        <div className="space-y-6">
          {selectedDevice ? (
            <>
              <Card className="bg-card border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {selectedDevice.deviceName}
                    </h3>
                    <p className="text-sm text-muted-foreground">Detailed health analysis</p>
                  </div>
                  {getRiskBadge(selectedDevice.riskLevel)}
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">CPU Usage</span>
                      <span className="text-foreground">{selectedDevice.keyIndicators.cpu}%</span>
                    </div>
                    <Progress value={selectedDevice.keyIndicators.cpu} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Memory Usage</span>
                      <span className="text-foreground">{selectedDevice.keyIndicators.memory}%</span>
                    </div>
                    <Progress value={selectedDevice.keyIndicators.memory} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Temperature</span>
                      <span className="text-foreground">{selectedDevice.keyIndicators.temperature}°C</span>
                    </div>
                    <Progress value={(selectedDevice.keyIndicators.temperature / 100) * 100} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Error Rate</span>
                      <span className="text-foreground">{selectedDevice.keyIndicators.errorRate}%</span>
                    </div>
                    <Progress value={selectedDevice.keyIndicators.errorRate * 10} className="h-2" />
                  </div>
                </div>
              </Card>

              <Card className="bg-card border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  AI Recommendations
                </h3>
                <div className="space-y-2">
                  {selectedDevice.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                      <p className="text-sm text-muted-foreground">{rec}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card className="bg-card border-border p-6 h-full flex items-center justify-center">
              <div className="text-center">
                <Activity className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">Select a device to view detailed analysis</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Telemetry Trends */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Historical Telemetry Patterns</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={telemetryHistory}>
              <defs>
                <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="timestamp" stroke="hsl(var(--muted-foreground))" />
              <YAxis stroke="hsl(var(--muted-foreground))" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="cpu" 
                stroke="hsl(var(--primary))" 
                fill="url(#cpuGradient)"
                name="CPU %"
              />
              <Area 
                type="monotone" 
                dataKey="memory" 
                stroke="hsl(var(--chart-2))" 
                fill="url(#memoryGradient)"
                name="Memory %"
              />
              <Line 
                type="monotone" 
                dataKey="temperature" 
                stroke="hsl(var(--destructive))" 
                name="Temperature °C"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default PredictiveMaintenanceML;
