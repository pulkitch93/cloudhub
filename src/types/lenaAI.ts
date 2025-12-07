/**
 * @fileoverview Nova AI Assistant type definitions.
 * Contains interfaces for messages, alerts, actions, and context.
 * @module types/lenaAI
 * @version 1.0.0
 */

/**
 * Represents a message in the Nova AI chat interface.
 * @interface NovaMessage
 * @property {string} id - Unique message identifier
 * @property {'user' | 'assistant' | 'system'} role - Message sender role
 * @property {string} content - Message text content
 * @property {Date} timestamp - When the message was created
 * @property {'text' | 'kpi-card' | 'chart' | 'action-card' | 'steps'} [type] - Rich content type
 * @property {any} [metadata] - Additional metadata for rich content rendering
 * @example
 * const message: NovaMessage = {
 *   id: 'msg-001',
 *   role: 'assistant',
 *   content: 'I found 3 cost optimization opportunities.',
 *   timestamp: new Date(),
 *   type: 'text'
 * };
 */
export interface NovaMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  type?: 'text' | 'kpi-card' | 'chart' | 'action-card' | 'steps';
  metadata?: any;
}

/**
 * Represents an alert surfaced by Nova AI.
 * @interface NovaAlert
 * @property {string} id - Unique alert identifier
 * @property {'critical' | 'high' | 'medium' | 'low'} severity - Alert severity level
 * @property {string} title - Brief alert title
 * @property {string} description - Detailed alert description
 * @property {string} affectedResource - Resource affected by the alert
 * @property {string} detectedAt - ISO 8601 timestamp when detected
 * @property {'open' | 'assigned' | 'in-progress' | 'resolved'} status - Current status
 * @property {number} impactScore - Business impact score (0-100)
 * @property {string} suggestedFix - AI-suggested remediation
 * @property {PrescriptiveAction} [prescriptiveAction] - Detailed action plan
 * @example
 * const alert: NovaAlert = {
 *   id: 'alert-001',
 *   severity: 'critical',
 *   title: 'Egress cost spike detected',
 *   description: 'Data transfer costs increased 340%',
 *   affectedResource: 'Tenant: FinanceCorp',
 *   detectedAt: '2024-03-15T10:30:00Z',
 *   status: 'open',
 *   impactScore: 95,
 *   suggestedFix: 'Enable VPC peering'
 * };
 */
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

/**
 * Represents an automated action/runbook that Nova can execute.
 * @interface PrescriptiveAction
 * @property {string} id - Unique action identifier
 * @property {ActionType} type - Category of action
 * @property {string} title - Action title
 * @property {string} description - Detailed description
 * @property {string} impact - Expected impact description
 * @property {number} [estimatedSavings] - Estimated monthly savings in USD
 * @property {RunbookStep[]} steps - List of execution steps
 * @property {string} cta - Call-to-action button text
 * @example
 * const action: PrescriptiveAction = {
 *   id: 'action-001',
 *   type: 'rightsize',
 *   title: 'Rightsize Overprovisioned Instances',
 *   description: 'Reduce instance sizes to match utilization',
 *   impact: '$3.8K/month savings',
 *   estimatedSavings: 3800,
 *   steps: [...],
 *   cta: 'Apply Rightsizing'
 * };
 */
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

/**
 * Represents a single step in an automated runbook.
 * @interface RunbookStep
 * @property {string} id - Unique step identifier
 * @property {string} title - Step title
 * @property {string} description - Detailed step description
 * @property {'pending' | 'in-progress' | 'completed' | 'failed'} status - Execution status
 * @property {string} [validationMsg] - Validation message after execution
 * @example
 * const step: RunbookStep = {
 *   id: 'step-1',
 *   title: 'Analyze traffic patterns',
 *   description: 'Review source and destination of transfers',
 *   status: 'pending'
 * };
 */
export interface RunbookStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  validationMsg?: string;
}

/**
 * User intent categories that Nova can recognize and handle.
 * Used for intent classification in natural language processing.
 * @typedef {string} NovaIntent
 * - `ALERTS_LIST`: User wants to see current alerts
 * - `ALERTS_DIAGNOSE`: User wants to diagnose a specific alert
 * - `COST_TREND`: User asks about cost trends
 * - `USAGE_TREND`: User asks about usage trends
 * - `RIGHTSIZE`: User wants rightsizing recommendations
 * - `MIGRATE`: User wants migration recommendations
 * - `SCALE`: User wants scaling recommendations
 * - `ADOPTION_DRIVE`: User asks about feature adoption
 * - `EXPLAIN_CHANGE`: User wants explanation of changes
 * - `GENERAL_QA`: General question/answer
 */
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

/**
 * Context information provided to Nova for personalized responses.
 * @interface NovaContext
 * @property {string} currentPage - Current page/route the user is viewing
 * @property {ContextFilters} filters - Active dashboard filters
 * @property {number} recentAlerts - Count of recent alerts
 * @property {HealthSignals} healthSignals - Current health indicators
 * @example
 * const context: NovaContext = {
 *   currentPage: '/dashboard',
 *   filters: { timeRange: '7d', region: 'us-east-1' },
 *   recentAlerts: 5,
 *   healthSignals: { costSpike: true, performanceIssue: false, lowAdoption: true }
 * };
 */
export interface NovaContext {
  currentPage: string;
  filters: {
    /**
     * Selected time range filter
     */
    timeRange?: string;
    /**
     * Selected tenant filter
     */
    tenantId?: string;
    /**
     * Selected region filter
     */
    region?: string;
    /**
     * Selected cloud provider filter
     */
    provider?: string;
  };
  recentAlerts: number;
  healthSignals: {
    /**
     * Whether a cost spike has been detected
     */
    costSpike?: boolean;
    /**
     * Whether a performance issue has been detected
     */
    performanceIssue?: boolean;
    /**
     * Whether low feature adoption has been detected
     */
    lowAdoption?: boolean;
  };
}
