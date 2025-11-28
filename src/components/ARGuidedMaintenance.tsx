import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Glasses, 
  Mic, 
  Video, 
  Play, 
  Pause, 
  CheckCircle2, 
  AlertCircle,
  Users,
  Wifi,
  TrendingDown,
  Clock,
  Wrench,
  Eye,
  MessageSquare,
  Activity
} from 'lucide-react';

interface MaintenanceSession {
  id: string;
  technician: string;
  component: string;
  server: string;
  status: 'active' | 'paused' | 'completed';
  progress: number;
  startTime: string;
  estimatedDuration: number;
  currentDuration: number;
  steps: MaintenanceStep[];
  currentStep: number;
  voiceGuidanceActive: boolean;
  expertConnected: boolean;
  inframonitorSync: boolean;
}

interface MaintenanceStep {
  id: number;
  title: string;
  description: string;
  arOverlay: string;
  completed: boolean;
  healthMetric?: string;
}

const mockSessions: MaintenanceSession[] = [
  {
    id: 'ar-001',
    technician: 'Mike Chen',
    component: 'Power Supply Unit',
    server: 'SR650-DC1-R3-S12',
    status: 'active',
    progress: 65,
    startTime: '14:23',
    estimatedDuration: 45,
    currentDuration: 29,
    currentStep: 3,
    voiceGuidanceActive: true,
    expertConnected: false,
    inframonitorSync: true,
    steps: [
      { 
        id: 1, 
        title: 'Safety Check', 
        description: 'Power down server and verify zero voltage',
        arOverlay: 'Showing power indicators and voltage readings',
        completed: true,
        healthMetric: 'Voltage: 0V ✓'
      },
      { 
        id: 2, 
        title: 'Access Panel', 
        description: 'Remove server cover and locate PSU',
        arOverlay: 'Highlighting cover screws and PSU location',
        completed: true
      },
      { 
        id: 3, 
        title: 'Disconnect Cables', 
        description: 'Remove power cables in correct sequence',
        arOverlay: 'Animated cable removal sequence with color coding',
        completed: false,
        healthMetric: 'Cable temps: Normal'
      },
      { 
        id: 4, 
        title: 'Remove PSU', 
        description: 'Unscrew and extract power supply unit',
        arOverlay: 'Showing screw locations and extraction path',
        completed: false
      },
      { 
        id: 5, 
        title: 'Install New PSU', 
        description: 'Insert replacement unit and secure',
        arOverlay: 'Alignment guides and torque specifications',
        completed: false
      },
      { 
        id: 6, 
        title: 'Reconnect & Test', 
        description: 'Connect cables and perform power-on test',
        arOverlay: 'Cable routing and test sequence',
        completed: false
      }
    ]
  },
  {
    id: 'ar-002',
    technician: 'Sarah Johnson',
    component: 'Memory Module',
    server: 'SR850-DC2-R1-S05',
    status: 'active',
    progress: 40,
    startTime: '14:15',
    estimatedDuration: 30,
    currentDuration: 12,
    currentStep: 2,
    voiceGuidanceActive: true,
    expertConnected: true,
    inframonitorSync: true,
    steps: [
      { id: 1, title: 'Locate Module', description: 'Find faulty DIMM slot', arOverlay: 'Highlighting DIMM slot D3', completed: true },
      { id: 2, title: 'Release Clips', description: 'Open retention clips', arOverlay: 'Showing clip release points', completed: false },
      { id: 3, title: 'Remove Module', description: 'Extract memory module', arOverlay: 'Proper extraction angle and force', completed: false },
      { id: 4, title: 'Install New Module', description: 'Insert replacement DIMM', arOverlay: 'Alignment and seating indicators', completed: false }
    ]
  },
  {
    id: 'ar-003',
    technician: 'David Park',
    component: 'Cooling Fan',
    server: 'SR630-DC1-R2-S08',
    status: 'completed',
    progress: 100,
    startTime: '13:45',
    estimatedDuration: 35,
    currentDuration: 28,
    currentStep: 4,
    voiceGuidanceActive: false,
    expertConnected: false,
    inframonitorSync: true,
    steps: [
      { id: 1, title: 'Identify Fan', description: 'Locate failed cooling fan', arOverlay: 'Fan position indicator', completed: true },
      { id: 2, title: 'Disconnect Power', description: 'Remove fan power connector', arOverlay: 'Connector release mechanism', completed: true },
      { id: 3, title: 'Remove Fan', description: 'Extract fan assembly', arOverlay: 'Extraction path and clearances', completed: true },
      { id: 4, title: 'Install & Test', description: 'Install new fan and verify operation', arOverlay: 'RPM readings and airflow indicators', completed: true, healthMetric: 'RPM: 4200 ✓' }
    ]
  }
];

const performanceMetrics = {
  avgReductionTime: 22,
  documentationFree: 94,
  firstTimeFixRate: 87,
  expertAssistRate: 18,
  totalSessionsToday: 12,
  activeSessions: 2
};

const ARGuidedMaintenance = () => {
  const [sessions] = useState<MaintenanceSession[]>(mockSessions);
  const [selectedSession, setSelectedSession] = useState<MaintenanceSession>(mockSessions[0]);

  const getStatusColor = (status: MaintenanceSession['status']) => {
    switch (status) {
      case 'active': return 'text-green-500 border-green-500/50';
      case 'paused': return 'text-yellow-500 border-yellow-500/50';
      case 'completed': return 'text-blue-500 border-blue-500/50';
      default: return 'text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Avg. Time Reduction</p>
              <p className="text-2xl font-bold text-green-500">{performanceMetrics.avgReductionTime}%</p>
            </div>
            <TrendingDown className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Target: 20%</p>
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Documentation-Free</p>
              <p className="text-2xl font-bold text-blue-500">{performanceMetrics.documentationFree}%</p>
            </div>
            <Eye className="h-8 w-8 text-blue-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">Repairs completed via AR only</p>
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Active Sessions</p>
              <p className="text-2xl font-bold text-foreground">{performanceMetrics.activeSessions}</p>
            </div>
            <Activity className="h-8 w-8 text-primary animate-pulse" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{performanceMetrics.totalSessionsToday} today</p>
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">First-Time Fix</p>
              <p className="text-2xl font-bold text-foreground">{performanceMetrics.firstTimeFixRate}%</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">No repeat visits needed</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Sessions List */}
        <Card className="lg:col-span-1 p-4 bg-card border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Glasses className="h-5 w-5 text-primary" />
              AR Sessions
            </h3>
            <Badge variant="outline" className="text-primary border-primary/50">
              {sessions.filter(s => s.status === 'active').length} Active
            </Badge>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto">
            {sessions.map((session) => (
              <Card 
                key={session.id}
                className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                  selectedSession.id === session.id ? 'border-primary bg-primary/5' : 'border-border'
                }`}
                onClick={() => setSelectedSession(session)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-foreground">{session.technician}</h4>
                    <p className="text-xs text-muted-foreground">{session.server}</p>
                  </div>
                  <Badge variant="outline" className={getStatusColor(session.status)}>
                    {session.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Wrench className="h-3 w-3" />
                    <span>{session.component}</span>
                  </div>

                  <Progress value={session.progress} className="h-1" />

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {session.voiceGuidanceActive && (
                        <Mic className="h-3 w-3 text-green-500 animate-pulse" />
                      )}
                      {session.expertConnected && (
                        <Video className="h-3 w-3 text-blue-500" />
                      )}
                      {session.inframonitorSync && (
                        <Wifi className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                    <span className="text-muted-foreground">
                      {session.currentDuration}/{session.estimatedDuration}m
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Main AR Session View */}
        <Card className="lg:col-span-2 p-6 bg-card border-border">
          <Tabs defaultValue="ar-overlay" className="w-full">
            <TabsList>
              <TabsTrigger value="ar-overlay">AR Overlay</TabsTrigger>
              <TabsTrigger value="voice-guide">Voice Guidance</TabsTrigger>
              <TabsTrigger value="expert-assist">Expert Assist</TabsTrigger>
            </TabsList>

            <TabsContent value="ar-overlay" className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground">{selectedSession.component}</h3>
                  <p className="text-sm text-muted-foreground">{selectedSession.server}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-500 border-green-500/50">
                    <Wifi className="h-3 w-3 mr-1" />
                    InfraMonitor Synced
                  </Badge>
                  {selectedSession.status === 'active' && (
                    <Button size="sm" variant="outline">
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                  )}
                  {selectedSession.status === 'completed' && (
                    <Badge variant="outline" className="text-blue-500 border-blue-500/50">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                </div>
              </div>

              {/* AR View Simulation */}
              <Card className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 border-primary/30 p-8 relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/5" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-4">
                    <Glasses className="h-5 w-5 text-primary" />
                    <span className="text-sm font-semibold text-foreground">Lenovo Smart Glass View</span>
                    <Badge variant="outline" className="text-green-500 border-green-500/50 ml-auto">
                      Live
                    </Badge>
                  </div>

                  <div className="space-y-3 bg-black/30 backdrop-blur-sm p-4 rounded-lg border border-primary/20">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-blue-400">Component Health:</span>
                      <span className="text-green-400 font-mono">
                        {selectedSession.steps[selectedSession.currentStep - 1]?.healthMetric || 'Normal'}
                      </span>
                    </div>
                    <div className="h-px bg-primary/20" />
                    <div className="text-primary text-sm">
                      <p className="font-semibold mb-1">Current AR Overlay:</p>
                      <p className="text-xs text-blue-300">
                        {selectedSession.steps[selectedSession.currentStep - 1]?.arOverlay}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Maintenance Steps */}
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-foreground">Maintenance Steps</h4>
                  <div className="text-xs text-muted-foreground">
                    Step {selectedSession.currentStep} of {selectedSession.steps.length}
                  </div>
                </div>

                {selectedSession.steps.map((step) => (
                  <Card 
                    key={step.id}
                    className={`p-3 ${
                      step.id === selectedSession.currentStep
                        ? 'border-primary bg-primary/5'
                        : step.completed
                        ? 'border-green-500/30 bg-green-500/5'
                        : 'border-border'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {step.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : step.id === selectedSession.currentStep ? (
                          <Play className="h-5 w-5 text-primary animate-pulse" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h5 className="text-sm font-semibold text-foreground">{step.title}</h5>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                        {step.healthMetric && (
                          <p className="text-xs text-green-500 mt-1">{step.healthMetric}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Duration: {selectedSession.currentDuration}m / {selectedSession.estimatedDuration}m</span>
                  <span className="text-green-500 font-semibold ml-2">
                    ({Math.round(((selectedSession.estimatedDuration - selectedSession.currentDuration) / selectedSession.estimatedDuration) * 100)}% faster)
                  </span>
                </div>
                <Progress value={selectedSession.progress} className="w-32 h-2" />
              </div>
            </TabsContent>

            <TabsContent value="voice-guide" className="space-y-4">
              <Card className="p-4 bg-card border-border">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Mic className="h-4 w-4 text-primary" />
                    AI Copilot Voice Guidance
                  </h4>
                  <Badge variant="outline" className={selectedSession.voiceGuidanceActive ? 'text-green-500 border-green-500/50' : 'text-muted-foreground border-border'}>
                    {selectedSession.voiceGuidanceActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                {selectedSession.voiceGuidanceActive && (
                  <div className="space-y-3">
                    <Card className="p-3 bg-primary/5 border-primary/30">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm text-foreground font-semibold mb-1">Current Instruction:</p>
                          <p className="text-sm text-muted-foreground">
                            "{selectedSession.steps[selectedSession.currentStep - 1]?.description}. 
                            {selectedSession.steps[selectedSession.currentStep - 1]?.arOverlay}"
                          </p>
                        </div>
                      </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-3">
                      <Button variant="outline" size="sm" className="w-full">
                        <Mic className="h-4 w-4 mr-2" />
                        Ask Question
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <Play className="h-4 w-4 mr-2" />
                        Repeat Step
                      </Button>
                    </div>

                    <Card className="p-3 bg-card/50 border-border">
                      <p className="text-xs text-muted-foreground mb-2">Recent Voice Commands:</p>
                      <div className="space-y-1 text-xs">
                        <p className="text-foreground">• "Show me the cable routing"</p>
                        <p className="text-foreground">• "What's the torque specification?"</p>
                        <p className="text-foreground">• "Display component temperature"</p>
                      </div>
                    </Card>
                  </div>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="expert-assist" className="space-y-4">
              <Card className="p-4 bg-card border-border">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Remote Expert Assistance
                  </h4>
                  {selectedSession.expertConnected ? (
                    <Badge variant="outline" className="text-green-500 border-green-500/50">
                      <Video className="h-3 w-3 mr-1" />
                      Expert Connected
                    </Badge>
                  ) : (
                    <Button size="sm" variant="outline">
                      <Video className="h-4 w-4 mr-2" />
                      Connect Expert
                    </Button>
                  )}
                </div>

                {selectedSession.expertConnected ? (
                  <div className="space-y-4">
                    <Card className="bg-gradient-to-br from-blue-950/50 to-purple-950/50 border-primary/30 p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">Dr. Lisa Anderson</p>
                          <p className="text-xs text-muted-foreground">Senior Hardware Specialist</p>
                        </div>
                        <Badge variant="outline" className="text-green-500 border-green-500/50 ml-auto">
                          Online
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Video className="h-4 w-4 mr-2" />
                          Video Call
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Chat
                        </Button>
                      </div>
                    </Card>

                    <Card className="p-3 bg-card/50 border-border">
                      <p className="text-xs font-semibold text-foreground mb-2">Expert Notes:</p>
                      <p className="text-xs text-muted-foreground">
                        "Check cable 3 connection - thermal imaging shows slightly elevated temperature. 
                        Recommend reseating before final assembly."
                      </p>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground mb-4">
                      No expert currently connected. Connect with a remote specialist for real-time guidance.
                    </p>
                    <div className="grid grid-cols-3 gap-3 text-xs text-muted-foreground">
                      <div>
                        <p className="font-semibold text-foreground">8</p>
                        <p>Experts Available</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">&lt;2m</p>
                        <p>Avg Response</p>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{performanceMetrics.expertAssistRate}%</p>
                        <p>Sessions w/ Assist</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ARGuidedMaintenance;
