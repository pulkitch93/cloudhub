import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, Play, Pause, RotateCcw, FastForward, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface HistoricalState {
  timestamp: string;
  serversOnline: number;
  totalServers: number;
  avgCpu: number;
  avgMemory: number;
  incidents: number;
  carbonEmissions: number;
}

const TimeMachine = () => {
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month'>('week');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // Generate historical data
  const generateHistoricalData = (range: 'day' | 'week' | 'month'): HistoricalState[] => {
    const points = range === 'day' ? 24 : range === 'week' ? 168 : 720;
    const data: HistoricalState[] = [];
    
    for (let i = 0; i < points; i++) {
      const hoursAgo = points - i;
      const date = new Date(Date.now() - hoursAgo * 3600000);
      
      data.push({
        timestamp: date.toLocaleString(),
        serversOnline: Math.floor(230 + Math.random() * 20),
        totalServers: 250,
        avgCpu: Math.floor(40 + Math.random() * 40 + Math.sin(i / 6) * 15),
        avgMemory: Math.floor(55 + Math.random() * 25 + Math.sin(i / 8) * 10),
        incidents: Math.random() > 0.9 ? Math.floor(Math.random() * 3) : 0,
        carbonEmissions: parseFloat((1.8 + Math.random() * 0.8).toFixed(2))
      });
    }
    
    return data;
  };

  const [historicalData] = useState(() => generateHistoricalData('week'));
  const currentState = historicalData[currentIndex];

  const handlePlay = () => {
    if (currentIndex >= historicalData.length - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(!isPlaying);
    
    if (!isPlaying) {
      toast.info('Time-machine playback started', {
        description: `Playing at ${playbackSpeed}x speed`
      });
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
    toast.info('Time-machine reset to start');
  };

  const handleTimeRangeChange = (range: 'day' | 'week' | 'month') => {
    setTimeRange(range);
    setCurrentIndex(0);
    setIsPlaying(false);
    toast.success(`Time range changed to ${range}`);
  };

  // Simulate playback
  useState(() => {
    let interval: number;
    
    if (isPlaying) {
      interval = window.setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= historicalData.length - 1) {
            setIsPlaying(false);
            toast.success('Playback complete');
            return prev;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Infrastructure Time Machine
        </CardTitle>
        <CardDescription>Replay historical infrastructure states and track system evolution</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Button
              onClick={handlePlay}
              variant={isPlaying ? "default" : "outline"}
              size="sm"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button onClick={handleReset} variant="outline" size="sm">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          <Select value={timeRange} onValueChange={(v) => handleTimeRangeChange(v as any)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Last 24 Hours</SelectItem>
              <SelectItem value="week">Last Week</SelectItem>
              <SelectItem value="month">Last Month</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <FastForward className="h-4 w-4 text-muted-foreground" />
            <Select value={playbackSpeed.toString()} onValueChange={(v) => setPlaybackSpeed(Number(v))}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1x</SelectItem>
                <SelectItem value="2">2x</SelectItem>
                <SelectItem value="5">5x</SelectItem>
                <SelectItem value="10">10x</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{currentState?.timestamp}</span>
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="space-y-2">
          <Slider
            value={[currentIndex]}
            max={historicalData.length - 1}
            step={1}
            onValueChange={([value]) => {
              setCurrentIndex(value);
              setIsPlaying(false);
            }}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{historicalData[0]?.timestamp}</span>
            <span>{historicalData[historicalData.length - 1]?.timestamp}</span>
          </div>
        </div>

        {/* Current State Display */}
        {currentState && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-lg bg-card/50 border border-border">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Servers Online</div>
              <div className="text-2xl font-bold text-foreground">
                {currentState.serversOnline}/{currentState.totalServers}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-muted-foreground mb-1">Avg CPU Usage</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-foreground">{currentState.avgCpu}%</div>
                {currentState.avgCpu > 75 && <Badge variant="destructive">High</Badge>}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-muted-foreground mb-1">Avg Memory</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-foreground">{currentState.avgMemory}%</div>
                {currentState.avgMemory > 80 && <Badge variant="destructive">High</Badge>}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-muted-foreground mb-1">Active Incidents</div>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-foreground">{currentState.incidents}</div>
                {currentState.incidents > 0 && <Badge variant="destructive">Active</Badge>}
              </div>
            </div>
            
            <div>
              <div className="text-xs text-muted-foreground mb-1">Carbon Emissions</div>
              <div className="text-2xl font-bold text-foreground">{currentState.carbonEmissions} tons/hr</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground mb-1">Playback Progress</div>
              <div className="text-2xl font-bold text-foreground">
                {((currentIndex / (historicalData.length - 1)) * 100).toFixed(1)}%
              </div>
            </div>
          </div>
        )}

        {/* Key Events Timeline */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-foreground">Notable Events</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs p-2 rounded bg-warning/10 border border-warning/20">
              <Badge variant="outline" className="text-warning border-warning">15h ago</Badge>
              <span className="text-muted-foreground">High CPU spike detected on Web-02</span>
            </div>
            <div className="flex items-center gap-2 text-xs p-2 rounded bg-success/10 border border-success/20">
              <Badge variant="outline" className="text-success border-success">2d ago</Badge>
              <span className="text-muted-foreground">Successful deployment of v2.4.1</span>
            </div>
            <div className="flex items-center gap-2 text-xs p-2 rounded bg-destructive/10 border border-destructive/20">
              <Badge variant="outline" className="text-destructive border-destructive">5d ago</Badge>
              <span className="text-muted-foreground">DB-Primary connection timeout incident</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeMachine;
