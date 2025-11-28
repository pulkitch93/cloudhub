export interface NovaMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'kpi-card' | 'chart' | 'action-card' | 'steps';
  metadata?: any;
}

export interface NovaAlert {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  affectedResource: string;
  detectedAt: string;
  status: 'open' | 'assigned' | 'in-progress' | 'resolved';
  impactScore: number;
  suggestedFix: string;
  prescriptiveAction?: PrescriptiveAction;
}

export interface PrescriptiveAction {
  id: string;
  type: 'rightsize' | 'migrate' | 'scale' | 'reduce-egress' | 'adoption' | 'ticket';
  title: string;
  description: string;
  impact: string;
  estimatedSavings?: number;
  steps: RunbookStep[];
  cta: string;
}

export interface RunbookStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  validationMsg?: string;
}

export type NovaIntent = 
  | 'ALERTS_LIST'
  | 'ALERTS_DIAGNOSE'
  | 'COST_TREND'
  | 'USAGE_TREND'
  | 'RIGHTSIZE'
  | 'MIGRATE'
  | 'SCALE'
  | 'ADOPTION_DRIVE'
  | 'EXPLAIN_CHANGE'
  | 'GENERAL_QA';

export interface NovaContext {
  currentPage: string;
  filters: {
    timeRange?: string;
    tenantId?: string;
    region?: string;
    provider?: string;
  };
  recentAlerts: number;
  healthSignals: {
    costSpike?: boolean;
    performanceIssue?: boolean;
    lowAdoption?: boolean;
  };
}
