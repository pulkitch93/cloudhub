export type AppRole = 'executive' | 'operations' | 'product';

export interface Tenant {
  id: string;
  name: string;
  industry: string;
  region: string;
  plan: string;
  healthScore: number;
  renewalDate: string;
}

export interface Workload {
  id: string;
  tenantId: string;
  name: string;
  provider: string;
  region: string;
  cpuPct: number;
  memPct: number;
  costDaily: number;
  anomalyFlag: boolean;
}

export interface Aggregate {
  date: string;
  computeHours: number;
  storageTB: number;
  egressGB: number;
  totalCost: number;
  alertsCount: number;
}

export interface Alert {
  id: string;
  tenantId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  createdAt: string;
  status: 'open' | 'assigned' | 'resolved' | 'snoozed';
  owner?: string;
  title: string;
  description: string;
}

export interface FeatureAdoption {
  date: string;
  feature: string;
  activeTenants: number;
  adoptionPct: number;
}

export interface Recommendation {
  id: string;
  type: 'cost' | 'performance' | 'compliance' | 'adoption';
  title: string;
  description: string;
  impactScore: number;
  estSavingsMonthly: number;
  actionLink: string;
  details: string;
}

export interface DashboardFilters {
  timeRange: '1d' | '7d' | '30d' | '90d' | 'custom';
  tenantId?: string;
  region?: string;
  provider?: string;
  tier?: string;
  customDateRange?: { from: Date; to: Date };
}

export interface KPIData {
  activeTenants: { value: number; delta: number; trend: number[] };
  activeWorkloads: { value: number; delta: number; trend: number[] };
  currentMonthSpend: { value: number; delta: number; trend: number[] };
  openAlerts24h: { value: number; delta: number; trend: number[] };
  featureAdoption: { value: number; delta: number; trend: number[] };
}
