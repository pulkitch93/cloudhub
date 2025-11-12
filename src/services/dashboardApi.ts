import { Tenant, Workload, Aggregate, Alert, FeatureAdoption, Recommendation, KPIData } from '@/types/dashboard';

// Mock data generators
const generateMockTenants = (): Tenant[] => {
  const industries = ['Finance', 'Healthcare', 'Retail', 'Technology', 'Manufacturing'];
  const regions = ['us-east-1', 'eu-west-1', 'ap-southeast-1'];
  const plans = ['Starter', 'Professional', 'Enterprise'];
  
  return Array.from({ length: 25 }, (_, i) => ({
    id: `tenant-${i + 1}`,
    name: `${industries[i % industries.length]} Corp ${i + 1}`,
    industry: industries[i % industries.length],
    region: regions[i % regions.length],
    plan: plans[i % plans.length],
    healthScore: Math.floor(Math.random() * 30) + 70,
    renewalDate: new Date(Date.now() + Math.random() * 180 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

const generateMockWorkloads = (tenants: Tenant[]): Workload[] => {
  const providers = ['AWS', 'Azure', 'GCP', 'IBM Cloud'];
  const regions = ['us-east-1', 'eu-west-1', 'ap-southeast-1'];
  
  return tenants.flatMap(tenant => 
    Array.from({ length: Math.floor(Math.random() * 5) + 2 }, (_, i) => ({
      id: `workload-${tenant.id}-${i}`,
      tenantId: tenant.id,
      name: `${tenant.name.split(' ')[0]}-workload-${i + 1}`,
      provider: providers[Math.floor(Math.random() * providers.length)],
      region: regions[Math.floor(Math.random() * regions.length)],
      cpuPct: Math.floor(Math.random() * 100),
      memPct: Math.floor(Math.random() * 100),
      costDaily: Math.floor(Math.random() * 500) + 50,
      anomalyFlag: Math.random() > 0.85,
    }))
  );
};

const generateMockAggregates = (days: number): Aggregate[] => {
  return Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (days - i - 1));
    
    return {
      date: date.toISOString().split('T')[0],
      computeHours: Math.floor(Math.random() * 10000) + 5000,
      storageTB: Math.floor(Math.random() * 500) + 200,
      egressGB: Math.floor(Math.random() * 2000) + 500,
      totalCost: Math.floor(Math.random() * 50000) + 30000,
      alertsCount: Math.floor(Math.random() * 20),
    };
  });
};

const generateMockAlerts = (tenants: Tenant[]): Alert[] => {
  const severities: Alert['severity'][] = ['critical', 'high', 'medium', 'low'];
  const statuses: Alert['status'][] = ['open', 'assigned', 'resolved', 'snoozed'];
  const categories = ['Performance', 'Cost', 'Security', 'Compliance', 'Availability'];
  
  return Array.from({ length: 15 }, (_, i) => ({
    id: `alert-${i + 1}`,
    tenantId: tenants[Math.floor(Math.random() * tenants.length)].id,
    severity: severities[Math.floor(Math.random() * severities.length)],
    category: categories[Math.floor(Math.random() * categories.length)],
    createdAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    owner: Math.random() > 0.5 ? `user-${Math.floor(Math.random() * 5) + 1}` : undefined,
    title: `${categories[Math.floor(Math.random() * categories.length)]} issue detected`,
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  }));
};

const generateMockRecommendations = (): Recommendation[] => {
  return [
    {
      id: 'rec-1',
      type: 'cost',
      title: 'Rightsize overprovisioned instances',
      description: '12 instances are running at <30% CPU utilization consistently',
      impactScore: 85,
      estSavingsMonthly: 4200,
      actionLink: '/optimize/rightsize',
      details: 'Analysis shows these instances have been underutilized for 14+ days. Downsizing will save ~$4.2K/month with no performance impact.',
    },
    {
      id: 'rec-2',
      type: 'performance',
      title: 'Move noisy-neighbor workloads',
      description: 'Tenant Alpha workloads impacting Tenant Beta in us-east-1',
      impactScore: 72,
      estSavingsMonthly: 0,
      actionLink: '/workloads/migrate',
      details: 'Resource contention detected. Migrate Tenant Alpha workloads to dedicated cluster to improve Tenant Beta SLA.',
    },
    {
      id: 'rec-3',
      type: 'compliance',
      title: 'Enable backup for non-compliant tenants',
      description: '8 tenants missing automated backups',
      impactScore: 90,
      estSavingsMonthly: 0,
      actionLink: '/compliance/backup',
      details: 'Compliance policy requires daily backups. Enable automated backups for these tenants to meet SLA requirements.',
    },
    {
      id: 'rec-4',
      type: 'adoption',
      title: 'Promote feature enablement campaign',
      description: 'Advanced Analytics feature at only 23% adoption',
      impactScore: 65,
      estSavingsMonthly: 0,
      actionLink: '/features/campaigns',
      details: 'Low adoption detected. Create targeted campaign to educate customers on Advanced Analytics benefits.',
    },
  ];
};

// Mock API endpoints - TODO: Replace with actual API calls
export const dashboardApi = {
  async getTenants(): Promise<Tenant[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockTenants();
  },
  
  async getWorkloads(filters?: { tenantId?: string; provider?: string; region?: string }): Promise<Workload[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const tenants = generateMockTenants();
    let workloads = generateMockWorkloads(tenants);
    
    if (filters?.tenantId) {
      workloads = workloads.filter(w => w.tenantId === filters.tenantId);
    }
    if (filters?.provider) {
      workloads = workloads.filter(w => w.provider === filters.provider);
    }
    if (filters?.region) {
      workloads = workloads.filter(w => w.region === filters.region);
    }
    
    return workloads;
  },
  
  async getMetrics(from: string, to: string): Promise<Aggregate[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const days = Math.ceil((new Date(to).getTime() - new Date(from).getTime()) / (1000 * 60 * 60 * 24));
    return generateMockAggregates(days);
  },
  
  async getAlerts(filters?: { tenantId?: string }): Promise<Alert[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const tenants = generateMockTenants();
    let alerts = generateMockAlerts(tenants);
    
    if (filters?.tenantId) {
      alerts = alerts.filter(a => a.tenantId === filters.tenantId);
    }
    
    return alerts;
  },
  
  async getFeatureAdoption(): Promise<FeatureAdoption[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (30 - i - 1));
      
      return {
        date: date.toISOString().split('T')[0],
        feature: 'Advanced Analytics',
        activeTenants: Math.floor(Math.random() * 10) + 15,
        adoptionPct: Math.floor(Math.random() * 10) + 20,
      };
    });
  },
  
  async getRecommendations(): Promise<Recommendation[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateMockRecommendations();
  },
  
  async getKPIData(): Promise<KPIData> {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      activeTenants: {
        value: 247,
        delta: 8.5,
        trend: [220, 225, 230, 235, 238, 242, 247],
      },
      activeWorkloads: {
        value: 1834,
        delta: 12.3,
        trend: [1620, 1650, 1700, 1750, 1780, 1810, 1834],
      },
      currentMonthSpend: {
        value: 847000,
        delta: -12,
        trend: [920000, 910000, 895000, 880000, 870000, 860000, 847000],
      },
      openAlerts24h: {
        value: 8,
        delta: -37.5,
        trend: [15, 13, 12, 11, 10, 9, 8],
      },
      featureAdoption: {
        value: 67.8,
        delta: 5.2,
        trend: [62, 63, 64, 65, 66, 67, 67.8],
      },
    };
  },
  
  async assignAlert(id: string, userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Alert ${id} assigned to ${userId}`);
  },
  
  async snoozeAlert(id: string, duration: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Alert ${id} snoozed for ${duration} minutes`);
  },
  
  async applyRecommendation(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Recommendation ${id} applied`);
  },
};
