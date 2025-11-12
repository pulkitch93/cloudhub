import { useEffect, useState } from 'react';
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';
import Header from '@/components/Header';
import DashboardKPICard from '@/components/dashboard/DashboardKPICard';
import RoleToggle from '@/components/dashboard/RoleToggle';
import TimeRangeSelector from '@/components/dashboard/TimeRangeSelector';
import TrendCharts from '@/components/dashboard/TrendCharts';
import RecommendationsPanel from '@/components/dashboard/RecommendationsPanel';
import AlertsPanel from '@/components/dashboard/AlertsPanel';
import { dashboardApi } from '@/services/dashboardApi';
import { KPIData } from '@/types/dashboard';
import { Activity, Users, DollarSign, AlertTriangle, TrendingUp, Download, Share2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

const DashboardContent = () => {
  const { role, filters, resetFilters } = useDashboard();
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchKPIs = async () => {
      setLoading(true);
      const data = await dashboardApi.getKPIData();
      setKpiData(data);
      setLoading(false);
    };
    fetchKPIs();
  }, [filters]);

  const getVisibleSections = () => {
    switch (role) {
      case 'executive':
        return ['kpis', 'cost', 'recommendations'];
      case 'operations':
        return ['kpis', 'alerts', 'trends'];
      case 'product':
        return ['kpis', 'adoption', 'recommendations'];
      default:
        return ['kpis', 'trends', 'alerts', 'recommendations'];
    }
  };

  const visibleSections = getVisibleSections();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Top Bar */}
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">Dashboard</h1>
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                Production
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-3">
              <RoleToggle />
              <TimeRangeSelector />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={resetFilters}>
                  <RotateCcw className="w-4 h-4 mr-1" />
                  Reset
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-8">
        {/* KPI Row */}
        {visibleSections.includes('kpis') && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Key Performance Indicators</h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-36" />
                ))}
              </div>
            ) : kpiData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <DashboardKPICard
                  title="Active Tenants"
                  value={kpiData.activeTenants.value}
                  delta={kpiData.activeTenants.delta}
                  trend={kpiData.activeTenants.trend}
                  icon={Users}
                />
                <DashboardKPICard
                  title="Active Workloads"
                  value={kpiData.activeWorkloads.value}
                  delta={kpiData.activeWorkloads.delta}
                  trend={kpiData.activeWorkloads.trend}
                  icon={Activity}
                />
                <DashboardKPICard
                  title="Current Month Spend"
                  value={kpiData.currentMonthSpend.value}
                  delta={kpiData.currentMonthSpend.delta}
                  trend={kpiData.currentMonthSpend.trend}
                  icon={DollarSign}
                  format="currency"
                />
                <DashboardKPICard
                  title="Open Alerts (24h)"
                  value={kpiData.openAlerts24h.value}
                  delta={kpiData.openAlerts24h.delta}
                  trend={kpiData.openAlerts24h.trend}
                  icon={AlertTriangle}
                />
                <DashboardKPICard
                  title="Feature Adoption"
                  value={kpiData.featureAdoption.value}
                  delta={kpiData.featureAdoption.delta}
                  trend={kpiData.featureAdoption.trend}
                  icon={TrendingUp}
                  format="percent"
                />
              </div>
            ) : null}
          </div>
        )}

        {/* Trends Row */}
        {visibleSections.includes('trends') && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Usage & Cost Trends</h2>
            <TrendCharts />
          </div>
        )}

        {/* Action Center */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {(visibleSections.includes('recommendations') || visibleSections.includes('adoption')) && (
            <RecommendationsPanel />
          )}
          
          {(visibleSections.includes('alerts') || visibleSections.includes('operations')) && (
            <AlertsPanel />
          )}
        </div>

        {/* Info Footer */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            <strong>Role View:</strong> Showing {role} dashboard. Switch roles above to see different insights. 
            All data refreshes based on selected time range and filters.
          </p>
        </div>
      </main>
    </div>
  );
};

const NewDashboard = () => {
  return (
    <DashboardProvider>
      <DashboardContent />
    </DashboardProvider>
  );
};

export default NewDashboard;
