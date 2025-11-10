import { Leaf, TrendingDown, Wind, Zap, Globe, Bell } from "lucide-react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { mockAnomalies } from "@/types/anomaly";
import { CarbonCreditMarketplace } from "@/components/CarbonCreditMarketplace";

const carbonTrendData = [
  { month: "Jan", actual: 2.8, forecast: 2.7, optimized: 2.1 },
  { month: "Feb", actual: 2.6, forecast: 2.5, optimized: 2.0 },
  { month: "Mar", actual: 2.4, forecast: 2.4, optimized: 1.9 },
  { month: "Apr", actual: 0, forecast: 2.5, optimized: 1.95 },
  { month: "May", actual: 0, forecast: 2.6, optimized: 2.0 },
  { month: "Jun", actual: 0, forecast: 2.7, optimized: 2.1 },
];

const energyByRegion = [
  { region: "US-East", renewable: 65, fossil: 35, total: 425 },
  { region: "EU-West", renewable: 82, fossil: 18, total: 380 },
  { region: "APAC", renewable: 48, fossil: 52, total: 290 },
  { region: "US-West", renewable: 71, fossil: 29, total: 195 },
];

const carbonByService = [
  { service: "Compute", emissions: 1.2, reduction: -22 },
  { service: "Storage", emissions: 0.6, reduction: -15 },
  { service: "Network", emissions: 0.4, reduction: -12 },
  { service: "Database", emissions: 0.2, reduction: -8 },
];

interface GreenRecommendation {
  id: string;
  title: string;
  description: string;
  reduction: string;
  impact: "high" | "medium" | "low";
  category: string;
}

const recommendations: GreenRecommendation[] = [
  {
    id: "1",
    title: "Shift workloads to EU-West region",
    description: "82% renewable energy grid vs 65% in US-East",
    reduction: "340T CO₂/year",
    impact: "high",
    category: "Location",
  },
  {
    id: "2",
    title: "Schedule batch jobs during solar peak",
    description: "Run ML training during 11am-3pm when solar generation peaks",
    reduction: "185T CO₂/year",
    impact: "high",
    category: "Timing",
  },
  {
    id: "3",
    title: "Enable cool storage tiering",
    description: "Archive rarely-accessed data to lower-energy storage classes",
    reduction: "92T CO₂/year",
    impact: "medium",
    category: "Storage",
  },
  {
    id: "4",
    title: "Optimize network routing",
    description: "Route traffic through regions with cleaner energy sources",
    reduction: "68T CO₂/year",
    impact: "medium",
    category: "Network",
  },
];

const GreenOps = () => {
  const carbonAnomalies = mockAnomalies.filter(a => a.type === "carbon" && a.status === "active");
  
  const getImpactBadge = (impact: GreenRecommendation["impact"]) => {
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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">GreenOps Dashboard</h2>
              <p className="text-muted-foreground">Carbon footprint tracking and sustainability optimization</p>
            </div>
            {carbonAnomalies.length > 0 && (
              <Badge className="bg-warning/10 text-warning border-warning/20 text-sm px-3 py-1">
                <Bell className="h-3 w-3 mr-1" />
                {carbonAnomalies.length} Active Anomalies
              </Badge>
            )}
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Current Carbon Footprint</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">2.4T CO₂</p>
              <p className="text-xs text-success mt-1">↓ 0.2T (-7.7%) vs Feb</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Renewable Energy %</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">67%</p>
              <p className="text-xs text-success mt-1">↑ 4% vs last quarter</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Potential Reduction</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-success">685T CO₂</p>
              <p className="text-xs text-success mt-1">28.5% reduction possible</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-muted-foreground">Carbon Credits</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">1.8T</p>
              <p className="text-xs text-muted-foreground mt-1">Offset purchased</p>
            </CardContent>
          </Card>
        </div>

        {/* Carbon Trend Chart */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-foreground">Carbon Emissions Trend & Forecast</CardTitle>
              <Button className="bg-success hover:bg-success/90">
                <Leaf className="h-4 w-4 mr-2" />
                Apply Green Optimizations
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={carbonTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" label={{ value: 'Tons CO₂', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }}
                />
                <Area type="monotone" dataKey="optimized" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="Post-Optimization" />
                <Line type="monotone" dataKey="actual" stroke="#E2231A" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="forecast" stroke="#F59E0B" strokeWidth={2} strokeDasharray="5 5" name="Forecast" />
              </AreaChart>
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
                <div className="w-4 h-4 bg-success opacity-60 rounded-sm"></div>
                <span className="text-muted-foreground">Post-Optimization</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Energy Mix by Region */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Renewable Energy by Region</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={energyByRegion} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="region" type="category" stroke="hsl(var(--muted-foreground))" width={80} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--card))", 
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="renewable" stackId="a" fill="#10B981" name="Renewable" />
                  <Bar dataKey="fossil" stackId="a" fill="#EF4444" name="Fossil" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Carbon by Service */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Carbon Emissions by Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {carbonByService.map((item) => (
                  <div key={item.service} className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-foreground">{item.service}</span>
                        <span className="text-sm font-bold text-foreground">{item.emissions}T CO₂</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-success rounded-full"
                            style={{ width: `${(item.emissions / 1.2) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-success flex items-center gap-1">
                          <TrendingDown className="h-3 w-3" />
                          {Math.abs(item.reduction)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Carbon Credit Marketplace */}
        <div className="mb-8">
          <CarbonCreditMarketplace />
        </div>

        {/* AI Recommendations */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Leaf className="h-5 w-5 text-success" />
              <CardTitle className="text-foreground">AI-Powered Sustainability Recommendations</CardTitle>
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
                        <span className="text-sm font-bold text-success flex items-center gap-1">
                          <Leaf className="h-3 w-3" />
                          Reduce: {rec.reduction}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-success border-success/20 hover:bg-success/10">
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

export default GreenOps;
