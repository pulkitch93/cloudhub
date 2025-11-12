import { LenaAlert, PrescriptiveAction, LenaContext } from '@/types/lenaAI';

// Mock alerts data
export const mockAlerts: LenaAlert[] = [
  {
    id: 'alert-1',
    severity: 'critical',
    title: 'Egress cost spike detected',
    description: 'Data transfer costs increased 340% in us-east-1 over last 24h',
    affectedResource: 'Tenant: FinanceCorp',
    detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    impactScore: 95,
    suggestedFix: 'Enable VPC peering or review data transfer patterns',
    prescriptiveAction: {
      id: 'action-1',
      type: 'reduce-egress',
      title: 'Reduce Data Transfer Costs',
      description: 'Implement VPC peering to reduce inter-region data transfer',
      impact: '$4.2K/month savings estimated',
      estimatedSavings: 4200,
      steps: [
        {
          id: 'step-1',
          title: 'Analyze traffic patterns',
          description: 'Review source and destination of high-volume transfers',
          status: 'pending',
        },
        {
          id: 'step-2',
          title: 'Enable VPC peering',
          description: 'Configure peering between us-east-1 and eu-west-1',
          status: 'pending',
        },
        {
          id: 'step-3',
          title: 'Update route tables',
          description: 'Modify routing to use private connections',
          status: 'pending',
        },
        {
          id: 'step-4',
          title: 'Monitor and validate',
          description: 'Confirm egress costs decrease over next 48h',
          status: 'pending',
        },
      ],
      cta: 'Start Optimization',
    },
  },
  {
    id: 'alert-2',
    severity: 'critical',
    title: 'Over-provisioned instances detected',
    description: '8 instances running at <25% CPU for 14+ consecutive days',
    affectedResource: 'Multi-tenant workloads in AWS',
    detectedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    impactScore: 88,
    suggestedFix: 'Downsize instances to save costs without performance impact',
    prescriptiveAction: {
      id: 'action-2',
      type: 'rightsize',
      title: 'Rightsize Overprovisioned Instances',
      description: 'Reduce instance sizes to match actual resource utilization',
      impact: '$3.8K/month savings, 15% CPU headroom maintained',
      estimatedSavings: 3800,
      steps: [
        {
          id: 'step-1',
          title: 'Identify instances',
          description: 'List 8 instances with sustained low utilization',
          status: 'pending',
        },
        {
          id: 'step-2',
          title: 'Plan downsize',
          description: 'Calculate new instance types (t3.large → t3.medium)',
          status: 'pending',
        },
        {
          id: 'step-3',
          title: 'Schedule maintenance',
          description: 'Coordinate with tenants for low-traffic window',
          status: 'pending',
        },
        {
          id: 'step-4',
          title: 'Execute rightsizing',
          description: 'Stop, modify, and restart instances',
          status: 'pending',
        },
      ],
      cta: 'Apply Rightsizing',
    },
  },
  {
    id: 'alert-3',
    severity: 'high',
    title: 'Noisy neighbor detected',
    description: 'TenantAlpha workloads impacting TenantBeta performance in shared cluster',
    affectedResource: 'us-east-1 cluster-02',
    detectedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    status: 'assigned',
    impactScore: 75,
    suggestedFix: 'Migrate TenantAlpha to dedicated cluster or separate AZ',
    prescriptiveAction: {
      id: 'action-3',
      type: 'migrate',
      title: 'Migrate Noisy Workload',
      description: 'Move TenantAlpha to isolated infrastructure',
      impact: '~30min downtime, SLA improvement for TenantBeta',
      steps: [
        {
          id: 'step-1',
          title: 'Provision target cluster',
          description: 'Spin up dedicated cluster in us-east-1c',
          status: 'pending',
        },
        {
          id: 'step-2',
          title: 'Backup and snapshot',
          description: 'Create recovery point before migration',
          status: 'pending',
        },
        {
          id: 'step-3',
          title: 'Execute migration',
          description: 'Move workloads with zero data loss',
          status: 'pending',
        },
        {
          id: 'step-4',
          title: 'Validate and cleanup',
          description: 'Verify performance and decommission old resources',
          status: 'pending',
        },
      ],
      cta: 'Start Migration',
    },
  },
  {
    id: 'alert-4',
    severity: 'high',
    title: 'Missing backups for compliance',
    description: '6 tenants do not have automated backup enabled',
    affectedResource: 'Healthcare, Finance tenants',
    detectedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    impactScore: 70,
    suggestedFix: 'Enable daily backups with 30-day retention',
  },
  {
    id: 'alert-5',
    severity: 'medium',
    title: 'Low feature adoption',
    description: 'Advanced Analytics feature at only 18% adoption across paid tenants',
    affectedResource: '45 Enterprise/Professional tenants',
    detectedAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    status: 'open',
    impactScore: 55,
    suggestedFix: 'Launch targeted enablement campaign with use case templates',
    prescriptiveAction: {
      id: 'action-5',
      type: 'adoption',
      title: 'Drive Feature Adoption',
      description: 'Targeted campaign to increase Advanced Analytics usage',
      impact: 'Potential for 25% upsell conversion',
      steps: [
        {
          id: 'step-1',
          title: 'Identify target tenants',
          description: 'Filter paid tenants not using Advanced Analytics',
          status: 'pending',
        },
        {
          id: 'step-2',
          title: 'Create enablement assets',
          description: 'Build use case guides and video tutorials',
          status: 'pending',
        },
        {
          id: 'step-3',
          title: 'Send campaign email',
          description: 'Personalized outreach with value proposition',
          status: 'pending',
        },
        {
          id: 'step-4',
          title: 'Track and follow up',
          description: 'Monitor activation rate and schedule check-ins',
          status: 'pending',
        },
      ],
      cta: 'Launch Campaign',
    },
  },
  {
    id: 'alert-6',
    severity: 'medium',
    title: 'Memory utilization trending up',
    description: 'Average memory usage increased 18% week-over-week in Azure',
    affectedResource: 'Azure eu-west-1',
    detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    status: 'in-progress',
    impactScore: 50,
    suggestedFix: 'Monitor for memory leaks or consider capacity planning',
  },
];

// Mock prescriptive actions
export const mockPrescriptiveActions: PrescriptiveAction[] = mockAlerts
  .filter(a => a.prescriptiveAction)
  .map(a => a.prescriptiveAction!);

// Service functions
export const lenaAiService = {
  async getAlerts(filters?: { severity?: string; status?: string; timeWindow?: string }): Promise<LenaAlert[]> {
    await new Promise(resolve => setTimeout(resolve, 300));
    let results = [...mockAlerts];
    
    if (filters?.severity) {
      results = results.filter(a => a.severity === filters.severity);
    }
    if (filters?.status) {
      results = results.filter(a => a.status === filters.status);
    }
    
    return results.sort((a, b) => b.impactScore - a.impactScore);
  },

  async assignAlert(alertId: string, userId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Alert ${alertId} assigned to ${userId}`);
  },

  async snoozeAlert(alertId: string, duration: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Alert ${alertId} snoozed for ${duration} minutes`);
  },

  async resolveAlert(alertId: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300));
    console.log(`Alert ${alertId} resolved`);
  },

  async executeRunbook(actionId: string): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      success: true,
      message: 'Runbook executed successfully. Changes will take effect in 5-10 minutes.',
    };
  },

  parseSlashCommand(input: string): { command: string; args: string[] } | null {
    if (!input.startsWith('/')) return null;
    
    const parts = input.slice(1).split(' ');
    return {
      command: parts[0],
      args: parts.slice(1),
    };
  },

  async handleSlashCommand(command: string, args: string[], context: LenaContext): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    switch (command) {
      case 'alerts':
        if (args[0] === 'today') {
          const alerts = await this.getAlerts();
          const today = alerts.filter(a => {
            const alertDate = new Date(a.detectedAt);
            const now = new Date();
            return alertDate.toDateString() === now.toDateString();
          });
          return `Found ${today.length} alerts today:\n${today.map(a => `• ${a.title} (${a.severity})`).join('\n')}`;
        }
        break;
      
      case 'cost':
        if (args[0] === 'top-drivers') {
          return 'Top 5 cost drivers (last 30d):\n1. Data Transfer (Azure) - $12.4K (+45%)\n2. Compute (AWS) - $8.9K (-5%)\n3. Storage (GCP) - $6.2K (+12%)\n4. Database (Multi) - $4.8K (+8%)\n5. Network Load Balancers - $3.1K (+22%)';
        }
        break;
      
      case 'rightsize':
        if (args[0] === 'hotspots') {
          return 'Top 3 rightsizing opportunities:\n1. AWS t3.2xlarge → t3.xlarge (8 instances) - Save $3.8K/mo\n2. Azure D4s_v3 → D2s_v3 (5 instances) - Save $2.1K/mo\n3. GCP n2-standard-8 → n2-standard-4 (3 instances) - Save $1.4K/mo';
        }
        break;
      
      case 'explain':
        if (args[0] === 'change' && args[1] === 'last7d') {
          return 'Change analysis (last 7 days):\n• Egress costs +340% in us-east-1 due to cross-region database queries\n• Compute hours -12% from rightsizing campaign\n• Active workloads +8% from 3 new tenant onboardings\n• Alert count -35% from proactive monitoring';
        }
        break;
      
      case 'adoption':
        if (args[0] === 'opportunities') {
          return 'Adoption opportunities:\n• Advanced Analytics: 45 tenants eligible, 18% current adoption\n• Automated Backups: 12 tenants without protection\n• Multi-Region: 8 tenants with latency issues, 0 using multi-region\n• API Access: 23 paid tenants not using APIs';
        }
        break;
    }
    
    return `Unknown command: /${command}. Try /alerts today, /cost top-drivers 30d, /rightsize hotspots, /explain change last7d, or /adoption opportunities`;
  },
};
