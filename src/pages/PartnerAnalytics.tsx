import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DollarSign, TrendingUp, CheckCircle2, Star, 
  Users, Package, ArrowUpRight, ArrowDownRight,
  Calendar, Download, Filter
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';

const PartnerAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedVendor, setSelectedVendor] = useState('all');

  // Mock analytics data
  const revenueData = [
    { month: 'Jan', revenue: 45000, growth: 12 },
    { month: 'Feb', revenue: 52000, growth: 15.5 },
    { month: 'Mar', revenue: 48000, growth: -7.7 },
    { month: 'Apr', revenue: 61000, growth: 27.1 },
    { month: 'May', revenue: 58000, growth: -4.9 },
    { month: 'Jun', revenue: 73000, growth: 25.9 },
  ];

  const deploymentSuccessData = [
    { week: 'Week 1', successful: 45, failed: 3, total: 48 },
    { week: 'Week 2', successful: 52, failed: 2, total: 54 },
    { week: 'Week 3', successful: 48, failed: 5, total: 53 },
    { week: 'Week 4', successful: 61, failed: 1, total: 62 },
  ];

  const vendorRevenueData = [
    { vendor: 'Lenovo', revenue: 125000, share: 35, color: 'hsl(var(--chart-1))' },
    { vendor: 'VMware', revenue: 95000, share: 27, color: 'hsl(var(--chart-2))' },
    { vendor: 'Nutanix', revenue: 78000, share: 22, color: 'hsl(var(--chart-3))' },
    { vendor: 'NVIDIA', revenue: 56000, share: 16, color: 'hsl(var(--chart-4))' },
  ];

  const satisfactionData = [
    { category: 'Ease of Deployment', score: 4.8 },
    { category: 'Performance', score: 4.6 },
    { category: 'Support Quality', score: 4.7 },
    { category: 'Documentation', score: 4.5 },
    { category: 'Value for Money', score: 4.4 },
  ];

  const trendingSolutions = [
    { 
      id: 1, 
      name: 'NVIDIA AI Enterprise', 
      vendor: 'NVIDIA', 
      deployments: 567,
      growth: 45.2,
      revenue: 25650,
      rating: 4.9,
      successRate: 98.5
    },
    { 
      id: 2, 
      name: 'vSphere Enterprise Plus', 
      vendor: 'VMware', 
      deployments: 1250,
      growth: 23.8,
      revenue: 62438,
      rating: 4.9,
      successRate: 99.2
    },
    { 
      id: 3, 
      name: 'ThinkSystem SR650 V3', 
      vendor: 'Lenovo', 
      deployments: 342,
      growth: 18.5,
      revenue: 29070,
      rating: 4.8,
      successRate: 97.8
    },
    { 
      id: 4, 
      name: 'Nutanix Enterprise Cloud', 
      vendor: 'Nutanix', 
      deployments: 890,
      growth: 15.3,
      revenue: 133500,
      rating: 4.7,
      successRate: 96.4
    },
    { 
      id: 5, 
      name: 'VMware NSX Data Center', 
      vendor: 'VMware', 
      deployments: 678,
      growth: 12.1,
      revenue: 32147,
      rating: 4.8,
      successRate: 98.1
    },
  ];

  const getVendorColor = (vendor: string) => {
    switch (vendor) {
      case 'Lenovo': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'VMware': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Nutanix': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'NVIDIA': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const calculateSuccessRate = () => {
    const total = deploymentSuccessData.reduce((acc, curr) => acc + curr.total, 0);
    const successful = deploymentSuccessData.reduce((acc, curr) => acc + curr.successful, 0);
    return ((successful / total) * 100).toFixed(1);
  };

  const totalRevenue = revenueData.reduce((acc, curr) => acc + curr.revenue, 0);
  const avgGrowth = revenueData.reduce((acc, curr) => acc + curr.growth, 0) / revenueData.length;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Partner Analytics</h2>
            <p className="text-muted-foreground">Track revenue, performance, and partner success metrics</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">
                ${(totalRevenue / 1000).toFixed(0)}K
              </p>
              <div className="flex items-center gap-1 text-sm">
                <ArrowUpRight className="h-4 w-4 text-success" />
                <span className="text-success font-semibold">{avgGrowth.toFixed(1)}%</span>
                <span className="text-muted-foreground">vs last period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-success/10 to-success/5 border-success/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">{calculateSuccessRate()}%</p>
              <div className="flex items-center gap-1 text-sm">
                <span className="text-muted-foreground">
                  {deploymentSuccessData.reduce((acc, curr) => acc + curr.successful, 0)} successful
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 border-yellow-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Avg. Satisfaction</p>
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">4.6/5.0</p>
              <div className="flex items-center gap-1 text-sm">
                <ArrowUpRight className="h-4 w-4 text-success" />
                <span className="text-success font-semibold">+0.3</span>
                <span className="text-muted-foreground">this month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-muted-foreground">Active Partners</p>
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <p className="text-3xl font-bold text-foreground mb-1">4</p>
              <div className="flex items-center gap-1 text-sm">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">12 solutions</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="revenue" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="satisfaction">Satisfaction</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          {/* Revenue Analytics Tab */}
          <TabsContent value="revenue" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                  <CardDescription>Monthly revenue over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--primary))" 
                        fill="url(#revenueGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Vendor Revenue Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue by Vendor</CardTitle>
                  <CardDescription>Distribution across partner vendors</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={vendorRevenueData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ vendor, share }) => `${vendor} ${share}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="revenue"
                      >
                        {vendorRevenueData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))', 
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                        formatter={(value: number) => `$${value.toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Vendor Revenue Table */}
            <Card>
              <CardHeader>
                <CardTitle>Vendor Performance Details</CardTitle>
                <CardDescription>Detailed revenue breakdown by partner</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendorRevenueData.map((vendor) => (
                    <div key={vendor.vendor} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card/50">
                      <div className="flex items-center gap-4">
                        <Badge className={getVendorColor(vendor.vendor)}>{vendor.vendor}</Badge>
                        <div>
                          <p className="font-semibold text-foreground">${vendor.revenue.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">{vendor.share}% market share</p>
                        </div>
                      </div>
                      <TrendingUp className="h-5 w-5 text-success" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Deployment Success Rate</CardTitle>
                <CardDescription>Weekly deployment outcomes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={deploymentSuccessData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="successful" fill="hsl(var(--success))" name="Successful" />
                    <Bar dataKey="failed" fill="hsl(var(--destructive))" name="Failed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Satisfaction Tab */}
          <TabsContent value="satisfaction" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Satisfaction Scores</CardTitle>
                <CardDescription>Average ratings across key categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={satisfactionData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis type="number" domain={[0, 5]} stroke="hsl(var(--muted-foreground))" />
                    <YAxis dataKey="category" type="category" width={150} stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-success/5 border-success/20">
                <CardContent className="pt-6 text-center">
                  <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2 fill-yellow-500" />
                  <p className="text-3xl font-bold text-foreground">4.8</p>
                  <p className="text-sm text-muted-foreground">Overall Rating</p>
                </CardContent>
              </Card>
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6 text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <p className="text-3xl font-bold text-foreground">1,247</p>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                </CardContent>
              </Card>
              <Card className="bg-blue-500/5 border-blue-500/20">
                <CardContent className="pt-6 text-center">
                  <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-foreground">94%</p>
                  <p className="text-sm text-muted-foreground">Would Recommend</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Trending Solutions</CardTitle>
                <CardDescription>Most popular solutions by deployment growth</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendingSolutions.map((solution, index) => (
                    <Card key={solution.id} className="border-border bg-card/50">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1">
                            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary font-bold">
                              #{index + 1}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-semibold text-foreground">{solution.name}</h4>
                                <Badge className={getVendorColor(solution.vendor)}>
                                  {solution.vendor}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                                <div>
                                  <p className="text-xs text-muted-foreground">Deployments</p>
                                  <p className="text-sm font-semibold text-foreground">{solution.deployments}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Growth</p>
                                  <div className="flex items-center gap-1">
                                    <ArrowUpRight className="h-3 w-3 text-success" />
                                    <p className="text-sm font-semibold text-success">{solution.growth}%</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Revenue</p>
                                  <p className="text-sm font-semibold text-foreground">${solution.revenue.toLocaleString()}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground">Success Rate</p>
                                  <p className="text-sm font-semibold text-success">{solution.successRate}%</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="font-semibold text-foreground">{solution.rating}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default PartnerAnalytics;
