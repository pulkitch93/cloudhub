import { Brain, TrendingUp, Leaf, AlertTriangle, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface AIModel {
  name: string;
  type: string;
  architecture: string;
  accuracy: number;
  status: "active" | "training" | "idle";
  predictions: string;
  description: string;
  icon: any;
}

const models: AIModel[] = [
  {
    name: "Predictive Failure Model",
    type: "LSTM Network",
    architecture: "3-layer LSTM with attention",
    accuracy: 94.2,
    status: "active",
    predictions: "1.2K/day",
    description: "Predicts hardware failures 72 hours in advance using historical telemetry patterns",
    icon: AlertTriangle,
  },
  {
    name: "Cost Forecaster",
    type: "Transformer",
    architecture: "GPT-style decoder",
    accuracy: 91.8,
    status: "active",
    predictions: "850/day",
    description: "Forecasts cloud spending and identifies cost optimization opportunities",
    icon: TrendingUp,
  },
  {
    name: "Carbon Optimizer",
    type: "Multi-objective RL",
    architecture: "PPO with custom rewards",
    accuracy: 88.5,
    status: "active",
    predictions: "Real-time",
    description: "Optimizes workload placement for minimal carbon footprint while maintaining performance",
    icon: Leaf,
  },
  {
    name: "Anomaly Detection",
    type: "Transformer",
    architecture: "Encoder-only with temporal encoding",
    accuracy: 96.1,
    status: "active",
    predictions: "Continuous",
    description: "Detects unusual patterns in metrics, logs, and traces across hybrid infrastructure",
    icon: Zap,
  },
  {
    name: "Workload Predictor",
    type: "LSTM + CNN Hybrid",
    architecture: "Dual-path architecture",
    accuracy: 89.3,
    status: "training",
    predictions: "N/A",
    description: "Predicts resource demands and automatically scales infrastructure ahead of demand spikes",
    icon: Brain,
  },
];

const AIModels = () => {
  const getStatusBadge = (status: AIModel["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-success/10 text-success border-success/20">Active</Badge>;
      case "training":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Training</Badge>;
      case "idle":
        return <Badge className="bg-muted text-muted-foreground border-border">Idle</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">AI Models Dashboard</h2>
          <p className="text-muted-foreground">Monitor and manage AI models powering intelligent operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Active Models</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">4</p>
              <p className="text-xs text-success mt-1">All systems operational</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Avg Accuracy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">92.4%</p>
              <p className="text-xs text-success mt-1">↑ 2.1% from last month</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Daily Predictions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">2.05K</p>
              <p className="text-xs text-muted-foreground mt-1">Across all models</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {models.map((model) => {
            const Icon = model.icon;
            return (
              <Card key={model.name} className="bg-card border-border hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <CardTitle className="text-foreground">{model.name}</CardTitle>
                          {getStatusBadge(model.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{model.description}</p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Type</p>
                      <p className="text-sm font-medium text-foreground">{model.type}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Architecture</p>
                      <p className="text-sm font-medium text-foreground">{model.architecture}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Accuracy</p>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-foreground">{model.accuracy}%</p>
                        <Progress value={model.accuracy} className="h-1" />
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Predictions</p>
                      <p className="text-sm font-medium text-foreground">{model.predictions}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AIModels;
