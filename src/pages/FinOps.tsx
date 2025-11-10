import { DollarSign, TrendingDown, TrendingUp, AlertCircle, Zap } from "lucide-react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const costTrendData = [
  { month: "Jan", actual: 782, forecast: 780, optimized: 650 },
  { month: "Feb", actual: 815, forecast: 810, optimized: 680 },
  { month: "Mar", actual: 847, forecast: 850, optimized: 705 },
  { month: "Apr", actual: 0, forecast: 890, optimized: 740 },
  { month: "May", actual: 0, forecast: 925, optimized: 770 },
  { month: "Jun", actual: 0, forecast: 960, optimized: 800 },
];

const costByCloud = [
  { name: "Lenovo TruScale", value: 385, color: "#E2231A" },
  { name: "AWS", value: 245, color: "#FF9900" },
  { name: "Azure", value: 152, color: "#0089D6" },
  { name: "GCP", value: 65, color: "#4285F4" },
];

const costByService = [
  { service: "Compute", cost: 425, change: -8 },
  { service: "Storage", cost: 185, change: +12 },
  { service: "Network", cost: 145, change: -5 },
  { service: "Database", cost: 92, change: +3 },
];

interface Recommendation {
  id: string;
  title: string;
  description: string;
  savings: string;
  impact: "high" | "medium" | "low";
  category: string;
}

const recommendations: Recommendation[] = [
  {
    id: "1",
    title: "Right-size over-provisioned instances",
    description: "17 EC2 instances running at <30% CPU utilization",
    savings: "$42K/year",
    impact: "high",
    category: "Compute",
  },
  {
    id: "2",
    title: "Migrate to spot instances",
    description: "Non-critical workloads suitable for spot pricing",
    savings: "$28K/year",
    impact: "high",
    category: "Compute",
  },
  {
    id: "3",
    title: "Archive cold storage data",
    description: "3.2TB untouched for 90+ days",
    savings: "$15K/year",
    impact: "medium",
    category: "Storage",
  },
  {
    id: "4",
    title: "Optimize reserved capacity",
    description: "Under-utilized reserved instances in US-West",
    savings: "$22K/year",
    impact: "medium",
    category: "Compute",
  },
];

const FinOps = () => {
  const getImpactBadge = (impact: Recommendation["impact"]) => {
    switch (impact) {
      case "high":
        return <Badge className="bg-success/10 text-success border-success/20">High Impact</Badge>;
      case "medium":
        return <Badge className="bg-warning/10 text-warning border-warning/20">Medium</Badge>;
      case "low":
        return <Badge className="bg-muted text-muted-foreground border-border">Low</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">FinOps Dashboard</h2>
          <p className="text-muted-foreground">AI-powered cost optimization and forecasting</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Current Monthly Cost</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">$847K</p>
              <p className="text-xs text-destructive mt-1">↑ $32K (+3.9%) vs Feb</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Forecasted (Apr)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">$890K</p>
              <p className="text-xs text-warning mt-1">±5% confidence interval</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Potential Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-success">$107K</p>
              <p className="text-xs text-success mt-1">12.6% cost reduction</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Anomalies Detected</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-warning">3</p>
              <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Cost Trend Chart */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Cost Trend & Forecast</CardTitle>
              <Button className="bg-primary hover:bg-primary/90">
                <Zap className="h-4 w-4 mr-2" />
                Apply All Optimizations
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={costTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Line type="monotone" dataKey="actual" stroke="#E2231A" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="forecast" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
                <Line type="monotone" dataKey="optimized" stroke="#10B981" strokeWidth={2} strokeDasharray="3 3" name="Optimized" />
              </LineChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-primary"></div>
                <span className="text-muted-foreground">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-warning" style={{ borderTop: "2px dashed" }}></div>
                <span className="text-muted-foreground">Forecast</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-success" style={{ borderTop: "2px dashed" }}></div>
                <span className="text-muted-foreground">Post-Optimization</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cost by Cloud Provider */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Cost by Cloud Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={costByCloud}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {costByCloud.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Cost by Service */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Cost by Service Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {costByService.map((item) => (
                  <div key={item.service} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{item.service}</span>
                        <span className="text-sm font-bold text-foreground">${item.cost}K</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(item.cost / 425) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs ${item.change > 0 ? 'text-destructive' : 'text-success'}`}>
                          {item.change > 0 ? <TrendingUp className="inline h-3 w-3" /> : <TrendingDown className="inline h-3 w-3" />}
                          {Math.abs(item.change)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Recommendations */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle className="text-foreground">AI-Powered Cost Optimization Recommendations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div key={rec.id} className="p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold text-foreground">{rec.title}</h4>
                        {getImpactBadge(rec.impact)}
                        <Badge variant="outline" className="text-xs">{rec.category}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{rec.description}</p>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-success">Save: {rec.savings}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FinOps;
