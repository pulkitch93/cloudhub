import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  DollarSign, TrendingUp, CheckCircle2, Star, 
  Users, Package, ArrowUpRight, ArrowDownRight,
  Calendar, Download, Filter, FileText, FileSpreadsheet,
  Mail, Settings, ChevronDown, GitCompare, LayoutGrid,
  Target, Award, Zap, ShieldCheck, Clock, Activity
} from 'lucide-react';
import { toast } from 'sonner';
import { exportToCSV, exportToExcel, exportToPDF } from '@/utils/analyticsExport';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  Area, AreaChart
} from 'recharts';

const PartnerAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedVendor, setSelectedVendor] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [comparisonPeriod, setComparisonPeriod] = useState<string | null>(null);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailReportConfig, setEmailReportConfig] = useState({
    email: '',
    frequency: 'weekly',
    recipients: [] as string[]
  });
  const [drillDownDialog, setDrillDownDialog] = useState(false);
  const [drillDownData, setDrillDownData] = useState<any>(null);
  const [dashboardCustomizer, setDashboardCustomizer] = useState(false);
  const [dashboardWidgets, setDashboardWidgets] = useState(() => {
    const saved = localStorage.getItem('dashboardWidgets');
    return saved ? JSON.parse(saved) : {
      revenue: true,
      deployments: true,
      satisfaction: true,
      trending: true,
      vendorScorecard: true,
      comparison: true
    };
  });

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
      successRate: 98.5,
      transactions: 892
    },
    { 
      id: 2, 
      name: 'vSphere Enterprise Plus', 
      vendor: 'VMware', 
      deployments: 1250,
      growth: 23.8,
      revenue: 62438,
      rating: 4.9,
      successRate: 99.2,
      transactions: 1580
    },
    { 
      id: 3, 
      name: 'ThinkSystem SR650 V3', 
      vendor: 'Lenovo', 
      deployments: 342,
      growth: 18.5,
      revenue: 29070,
      rating: 4.8,
      successRate: 97.8,
      transactions: 450
    },
    { 
      id: 4, 
      name: 'Nutanix Enterprise Cloud', 
      vendor: 'Nutanix', 
      deployments: 890,
      growth: 15.3,
      revenue: 133500,
      rating: 4.7,
      successRate: 96.4,
      transactions: 1120
    },
    { 
      id: 5, 
      name: 'VMware NSX Data Center', 
      vendor: 'VMware', 
      deployments: 678,
      growth: 12.1,
      revenue: 32147,
      rating: 4.8,
      successRate: 98.1,
      transactions: 845
    },
  ];

  // Comparison period data
  const comparisonRevenueData = comparisonPeriod ? [
    { month: 'Jan', revenue: 38000, growth: 8 },
    { month: 'Feb', revenue: 44000, growth: 15.8 },
    { month: 'Mar', revenue: 51000, growth: 15.9 },
    { month: 'Apr', revenue: 48000, growth: -5.9 },
    { month: 'May', revenue: 55000, growth: 14.6 },
    { month: 'Jun', revenue: 58000, growth: 5.5 },
  ] : null;

  // Vendor scorecards
  const vendorScorecards = [
    {
      vendor: 'Lenovo',
      rating: 4.8,
      performance: 96,
      uptime: 99.9,
      support: 4.7,
      innovation: 4.6,
      compliance: 98,
      timeToMarket: 12,
      industryRank: 2
    },
    {
      vendor: 'VMware',
      rating: 4.9,
      performance: 98,
      uptime: 99.95,
      support: 4.9,
      innovation: 4.8,
      compliance: 99,
      timeToMarket: 8,
      industryRank: 1
    },
    {
      vendor: 'Nutanix',
      rating: 4.7,
      performance: 94,
      uptime: 99.7,
      support: 4.6,
      innovation: 4.7,
      compliance: 97,
      timeToMarket: 10,
      industryRank: 3
    },
    {
      vendor: 'NVIDIA',
      rating: 4.9,
      performance: 99,
      uptime: 99.99,
      support: 4.8,
      innovation: 5.0,
      compliance: 99,
      timeToMarket: 6,
      industryRank: 1
    }
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
  
  const comparisonTotalRevenue = comparisonRevenueData?.reduce((acc, curr) => acc + curr.revenue, 0) || 0;
  const revenueVariance = comparisonPeriod ? ((totalRevenue - comparisonTotalRevenue) / comparisonTotalRevenue * 100) : null;

  // Filter data based on selections
  const filteredVendorData = selectedVendor === 'all' 
    ? vendorRevenueData 
    : vendorRevenueData.filter(v => v.vendor.toLowerCase() === selectedVendor.toLowerCase());

  const filteredTrendingSolutions = trendingSolutions.filter(solution => {
    const matchesVendor = selectedVendor === 'all' || solution.vendor.toLowerCase() === selectedVendor.toLowerCase();
    return matchesVendor;
  });

  const filteredScorecards = selectedVendor === 'all'
    ? vendorScorecards
    : vendorScorecards.filter(s => s.vendor.toLowerCase() === selectedVendor.toLowerCase());

  // Export handlers
  const handleExport = (format: 'csv' | 'excel' | 'pdf') => {
    const analyticsData = {
      revenueData,
      deploymentData: deploymentSuccessData,
      satisfactionData,
      trendingSolutions: filteredTrendingSolutions,
      vendorData: filteredVendorData
    };

    const filters = {
      dateRange: timeRange,
      vendor: selectedVendor,
      category: selectedCategory
    };

    try {
      switch (format) {
        case 'csv':
          exportToCSV(filteredTrendingSolutions, 'trending_solutions');
          toast.success('CSV exported successfully');
          break;
        case 'excel':
          exportToExcel(analyticsData, filters);
          toast.success('Excel report exported successfully');
          break;
        case 'pdf':
          exportToPDF(analyticsData, filters);
          toast.success('PDF report exported successfully');
          break;
      }
    } catch (error) {
      toast.error('Failed to export report');
      console.error('Export error:', error);
    }
  };

  // Schedule report reminders using localStorage
  const handleScheduleReport = () => {
    if (!emailReportConfig.email) {
      toast.error('Please provide recipient information');
      return;
    }

    // Save schedule to localStorage
    const schedule = {
      recipients: emailReportConfig.email,
      frequency: emailReportConfig.frequency,
      lastNotified: new Date().toISOString(),
      filters: {
        timeRange,
        vendor: selectedVendor,
        category: selectedCategory
      }
    };
    
    localStorage.setItem('analyticsReportSchedule', JSON.stringify(schedule));
    
    toast.success('Report reminder scheduled', {
      description: `You'll receive ${emailReportConfig.frequency} reminders to download and share reports`
    });
    
    setShowEmailDialog(false);
    setEmailReportConfig({ email: '', frequency: 'weekly', recipients: [] });
  };

  // Check for scheduled report reminders on page load
  useEffect(() => {
    const scheduleStr = localStorage.getItem('analyticsReportSchedule');
    if (!scheduleStr) return;

    const schedule = JSON.parse(scheduleStr);
    const now = new Date();
    const lastNotified = new Date(schedule.lastNotified);
    const hoursSince = (now.getTime() - lastNotified.getTime()) / (1000 * 60 * 60);

    let shouldNotify = false;
    if (schedule.frequency === 'daily' && hoursSince >= 24) shouldNotify = true;
    if (schedule.frequency === 'weekly' && hoursSince >= 168) shouldNotify = true; // 7 days
    if (schedule.frequency === 'monthly' && hoursSince >= 720) shouldNotify = true; // 30 days

    if (shouldNotify) {
      toast.info('📊 Analytics Report Reminder', {
        description: `Time to download and share reports with ${schedule.recipients}`,
        action: {
          label: 'Download PDF',
          onClick: () => handleExport('pdf')
        },
        duration: 10000
      });

      // Update last notified time
      schedule.lastNotified = now.toISOString();
      localStorage.setItem('analyticsReportSchedule', JSON.stringify(schedule));
    }
  }, []);

  // Handle chart drill-down
  const handleChartClick = (data: any, type: string) => {
    setDrillDownData({ ...data, type });
    setDrillDownDialog(true);
  };

  // Save dashboard configuration
  const saveDashboardConfig = () => {
    localStorage.setItem('dashboardWidgets', JSON.stringify(dashboardWidgets));
    toast.success('Dashboard layout saved');
    setDashboardCustomizer(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Partner Analytics</h2>
              <p className="text-muted-foreground">Track revenue, performance, and partner success metrics</p>
            </div>
            <div className="flex items-center gap-3">
              <Dialog open={dashboardCustomizer} onOpenChange={setDashboardCustomizer}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Customize
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Customize Dashboard</DialogTitle>
                    <DialogDescription>
                      Select which widgets to display on your dashboard
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    {Object.entries(dashboardWidgets).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <Label htmlFor={key} className="capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <Switch
                          id={key}
                          checked={value as boolean}
                          onCheckedChange={(checked) => 
                            setDashboardWidgets({ ...dashboardWidgets, [key]: checked })
                          }
                        />
                      </div>
                    ))}
                    <Button onClick={saveDashboardConfig} className="w-full">
                      Save Layout
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Schedule Reports
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule Report Reminders</DialogTitle>
                    <DialogDescription>
                      Get browser reminders to download and share analytics reports with stakeholders
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Recipient Names (for reference)</Label>
                      <Input
                        id="email"
                        type="text"
                        placeholder="e.g., Finance Team, CEO, Board Members"
                        value={emailReportConfig.email}
                        onChange={(e) => setEmailReportConfig({ ...emailReportConfig, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="frequency">Report Frequency</Label>
                      <Select 
                        value={emailReportConfig.frequency} 
                        onValueChange={(value) => setEmailReportConfig({ ...emailReportConfig, frequency: value })}
                      >
                        <SelectTrigger id="frequency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly (Monday)</SelectItem>
                          <SelectItem value="monthly">Monthly (1st day)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Included Metrics</Label>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-success" />
                          <span>Revenue trends and growth</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-success" />
                          <span>Deployment success rates</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-success" />
                          <span>Top trending solutions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-3 w-3 text-success" />
                          <span>User satisfaction scores</span>
                        </div>
                      </div>
                    </div>
                    <Button onClick={handleScheduleReport} className="w-full">
                      Set Reminder Schedule
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleExport('csv')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('excel')}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export as Excel
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Advanced Filters */}
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">Filters:</span>
                </div>
                
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

                <Select value={selectedVendor} onValueChange={setSelectedVendor}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Vendors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Vendors</SelectItem>
                    <SelectItem value="lenovo">Lenovo</SelectItem>
                    <SelectItem value="vmware">VMware</SelectItem>
                    <SelectItem value="nutanix">Nutanix</SelectItem>
                    <SelectItem value="nvidia">NVIDIA</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="compute">Compute</SelectItem>
                    <SelectItem value="virtualization">Virtualization</SelectItem>
                    <SelectItem value="ai-ml">AI & ML</SelectItem>
                    <SelectItem value="networking">Networking</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={comparisonPeriod || 'none'} onValueChange={(v) => setComparisonPeriod(v === 'none' ? null : v)}>
                  <SelectTrigger className="w-[200px]">
                    <GitCompare className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Compare Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Comparison</SelectItem>
                    <SelectItem value="previous">Previous Period</SelectItem>
                    <SelectItem value="year-ago">Year Ago</SelectItem>
                    <SelectItem value="quarter-ago">Quarter Ago</SelectItem>
                  </SelectContent>
                </Select>

                {(selectedVendor !== 'all' || selectedCategory !== 'all' || comparisonPeriod) && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedVendor('all');
                      setSelectedCategory('all');
                      setComparisonPeriod(null);
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
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
                {revenueVariance !== null && comparisonPeriod ? (
                  <>
                    {revenueVariance >= 0 ? (
                      <ArrowUpRight className="h-4 w-4 text-success" />
                    ) : (
                      <ArrowDownRight className="h-4 w-4 text-destructive" />
                    )}
                    <span className={revenueVariance >= 0 ? "text-success font-semibold" : "text-destructive font-semibold"}>
                      {revenueVariance >= 0 ? '+' : ''}{revenueVariance.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">vs {comparisonPeriod.replace('-', ' ')}</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="h-4 w-4 text-success" />
                    <span className="text-success font-semibold">{avgGrowth.toFixed(1)}%</span>
                    <span className="text-muted-foreground">vs last period</span>
                  </>
                )}
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
            <TabsTrigger value="scorecards">Vendor Scorecards</TabsTrigger>
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
                    <AreaChart data={revenueData} onClick={(data) => data?.activePayload && handleChartClick(data.activePayload[0].payload, 'revenue')}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                        {comparisonRevenueData && (
                          <linearGradient id="comparisonGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--muted))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--muted))" stopOpacity={0}/>
                          </linearGradient>
                        )}
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
                        cursor={{ fill: 'hsl(var(--muted))' }}
                      />
                      {comparisonRevenueData && <Legend />}
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="hsl(var(--primary))" 
                        fill="url(#revenueGradient)"
                        strokeWidth={2}
                        name="Current Period"
                      />
                      {comparisonRevenueData && (
                        <Area 
                          type="monotone" 
                          data={comparisonRevenueData}
                          dataKey="revenue" 
                          stroke="hsl(var(--muted-foreground))" 
                          fill="url(#comparisonGradient)"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          name="Comparison Period"
                        />
                      )}
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
                        onClick={(data) => handleChartClick(data, 'vendor')}
                        cursor="pointer"
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
                  <BarChart data={deploymentSuccessData} onClick={(data) => data?.activePayload && handleChartClick(data.activePayload[0].payload, 'deployment')}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      cursor={{ fill: 'hsl(var(--muted))' }}
                    />
                    <Legend />
                    <Bar dataKey="successful" fill="hsl(var(--success))" name="Successful" cursor="pointer" />
                    <Bar dataKey="failed" fill="hsl(var(--destructive))" name="Failed" cursor="pointer" />
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
                {filteredTrendingSolutions.map((solution, index) => (
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

          {/* Vendor Scorecards Tab */}
          <TabsContent value="scorecards" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredScorecards.map((scorecard) => (
                <Card key={scorecard.vendor} className="border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {scorecard.vendor}
                        <Badge className={getVendorColor(scorecard.vendor)}>
                          Rank #{scorecard.industryRank}
                        </Badge>
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
                        <span className="text-2xl font-bold">{scorecard.rating}</span>
                      </div>
                    </div>
                    <CardDescription>Industry benchmarking and performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Performance Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Target className="h-4 w-4" />
                          <span>Performance Score</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-success h-2 rounded-full transition-all" 
                              style={{ width: `${scorecard.performance}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">{scorecard.performance}%</span>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Activity className="h-4 w-4" />
                          <span>Uptime</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all" 
                              style={{ width: `${scorecard.uptime}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">{scorecard.uptime}%</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ShieldCheck className="h-4 w-4" />
                          <span>Compliance</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-secondary rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all" 
                              style={{ width: `${scorecard.compliance}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold">{scorecard.compliance}%</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Zap className="h-4 w-4" />
                          <span>Innovation</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm font-semibold">{scorecard.innovation}/5.0</span>
                        </div>
                      </div>
                    </div>

                    {/* Key Stats */}
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">{scorecard.support}</p>
                        <p className="text-xs text-muted-foreground">Support Rating</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">{scorecard.timeToMarket}d</p>
                        <p className="text-xs text-muted-foreground">Time to Market</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Award className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <p className="text-2xl font-bold text-foreground">#{scorecard.industryRank}</p>
                        <p className="text-xs text-muted-foreground">Industry Rank</p>
                      </div>
                    </div>

                    {/* Benchmark Indicator */}
                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <Badge variant={scorecard.industryRank === 1 ? "default" : "secondary"}>
                        {scorecard.industryRank === 1 ? "Market Leader" : "Top Performer"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {scorecard.performance >= 95 ? "Exceeds" : "Meets"} industry standards
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Drill-down Dialog */}
        <Dialog open={drillDownDialog} onOpenChange={setDrillDownDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detailed Breakdown</DialogTitle>
              <DialogDescription>
                {drillDownData?.type === 'revenue' && `Revenue details for ${drillDownData.month}`}
                {drillDownData?.type === 'vendor' && `${drillDownData.vendor} performance details`}
                {drillDownData?.type === 'deployment' && `Deployment breakdown for ${drillDownData.week}`}
              </DialogDescription>
            </DialogHeader>
            {drillDownData && (
              <div className="space-y-4">
                {drillDownData.type === 'revenue' && (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
                          <p className="text-2xl font-bold">${drillDownData.revenue?.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Total Revenue</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <TrendingUp className="h-6 w-6 text-success mx-auto mb-2" />
                          <p className="text-2xl font-bold">{drillDownData.growth?.toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground">Growth Rate</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <Package className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">{Math.floor(drillDownData.revenue / 150)}</p>
                          <p className="text-xs text-muted-foreground">Transactions</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Revenue Sources</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between p-2 rounded bg-muted/50">
                          <span>Direct Sales</span>
                          <span className="font-semibold">${(drillDownData.revenue * 0.6).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-muted/50">
                          <span>Partner Channel</span>
                          <span className="font-semibold">${(drillDownData.revenue * 0.3).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-2 rounded bg-muted/50">
                          <span>Marketplace</span>
                          <span className="font-semibold">${(drillDownData.revenue * 0.1).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {drillDownData.type === 'vendor' && (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
                          <p className="text-2xl font-bold">${drillDownData.revenue?.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Total Revenue</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <Package className="h-6 w-6 text-success mx-auto mb-2" />
                          <p className="text-2xl font-bold">{drillDownData.share}%</p>
                          <p className="text-xs text-muted-foreground">Market Share</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <TrendingUp className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                          <p className="text-2xl font-bold">3</p>
                          <p className="text-xs text-muted-foreground">Active Solutions</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Top Solutions</h4>
                      <div className="space-y-2">
                        {trendingSolutions
                          .filter(s => s.vendor === drillDownData.vendor)
                          .map(solution => (
                            <div key={solution.id} className="flex justify-between p-2 rounded bg-muted/50">
                              <span>{solution.name}</span>
                              <div className="flex items-center gap-3">
                                <span className="text-sm text-muted-foreground">{solution.deployments} deployments</span>
                                <span className="font-semibold">${solution.revenue.toLocaleString()}</span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                )}
                {drillDownData.type === 'deployment' && (
                  <>
                    <div className="grid grid-cols-3 gap-4">
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <CheckCircle2 className="h-6 w-6 text-success mx-auto mb-2" />
                          <p className="text-2xl font-bold">{drillDownData.successful}</p>
                          <p className="text-xs text-muted-foreground">Successful</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <ArrowDownRight className="h-6 w-6 text-destructive mx-auto mb-2" />
                          <p className="text-2xl font-bold">{drillDownData.failed}</p>
                          <p className="text-xs text-muted-foreground">Failed</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="pt-6 text-center">
                          <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
                          <p className="text-2xl font-bold">{((drillDownData.successful / drillDownData.total) * 100).toFixed(1)}%</p>
                          <p className="text-xs text-muted-foreground">Success Rate</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Deployment Details - {drillDownData.week}</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between p-3 rounded bg-success/10 border border-success/20">
                          <div>
                            <p className="font-semibold text-foreground">Successful Deployments</p>
                            <p className="text-sm text-muted-foreground">Average time: 12 minutes</p>
                          </div>
                          <span className="text-2xl font-bold text-success">{drillDownData.successful}</span>
                        </div>
                        <div className="flex justify-between p-3 rounded bg-destructive/10 border border-destructive/20">
                          <div>
                            <p className="font-semibold text-foreground">Failed Deployments</p>
                            <p className="text-sm text-muted-foreground">Main issues: Configuration, Timeout</p>
                          </div>
                          <span className="text-2xl font-bold text-destructive">{drillDownData.failed}</span>
                        </div>
                        <div className="p-3 rounded bg-muted/50">
                          <p className="text-sm text-muted-foreground mb-2">Common Success Factors:</p>
                          <ul className="text-sm space-y-1 list-disc list-inside">
                            <li>Pre-deployment validation passed</li>
                            <li>Resource availability verified</li>
                            <li>Configuration templates used</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default PartnerAnalytics;
