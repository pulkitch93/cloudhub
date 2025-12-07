/**
 * @fileoverview Dashboard type definitions for the CloudHub platform.
 * Contains interfaces for tenants, workloads, metrics, alerts, and KPIs.
 * @module types/dashboard
 * @version 1.0.0
 */

/**
 * Application user roles that determine dashboard view and permissions.
 * - `executive`: High-level KPIs and cost summaries
 * - `operations`: Detailed alerts and technical metrics
 * @typedef {'executive' | 'operations'} AppRole
 */
export type AppRole = 'executive' | 'operations';

/**
 * Represents a customer organization (tenant) in the multi-tenant platform.
 * @interface Tenant
 * @property {string} id - Unique identifier for the tenant
 * @property {string} name - Display name of the organization
 * @property {string} industry - Industry vertical (e.g., Finance, Healthcare)
 * @property {string} region - Primary deployment region (e.g., us-east-1)
 * @property {string} plan - Subscription plan (Starter, Professional, Enterprise)
 * @property {number} healthScore - Overall health score (0-100)
 * @property {string} renewalDate - ISO 8601 date string for contract renewal
 * @example
 * const tenant: Tenant = {
 *   id: 'tenant-123',
 *   name: 'Acme Corp',
 *   industry: 'Technology',
 *   region: 'us-east-1',
 *   plan: 'Enterprise',
 *   healthScore: 95,
 *   renewalDate: '2024-12-31T00:00:00Z'
 * };
 */
export interface Tenant {
  id: string;
  name: string;
  industry: string;
  region: string;
  plan: string;
  healthScore: number;
  renewalDate: string;
}

/**
 * Represents a compute workload running in the hybrid cloud environment.
 * @interface Workload
 * @property {string} id - Unique identifier for the workload
 * @property {string} tenantId - Reference to the parent tenant
 * @property {string} name - Descriptive name for the workload
 * @property {string} provider - Cloud provider (AWS, Azure, GCP, IBM Cloud)
 * @property {string} region - Deployment region
 * @property {number} cpuPct - Current CPU utilization percentage (0-100)
 * @property {number} memPct - Current memory utilization percentage (0-100)
 * @property {number} costDaily - Daily cost in USD
 * @property {boolean} anomalyFlag - Whether an anomaly has been detected
 * @example
 * const workload: Workload = {
 *   id: 'workload-001',
 *   tenantId: 'tenant-123',
 *   name: 'web-api-production',
 *   provider: 'AWS',
 *   region: 'us-east-1',
 *   cpuPct: 45,
 *   memPct: 72,
 *   costDaily: 125.50,
 *   anomalyFlag: false
 * };
 */
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

/**
 * Daily aggregated metrics for platform-wide usage and costs.
 * Used for trend analysis and forecasting.
 * @interface Aggregate
 * @property {string} date - Date in YYYY-MM-DD format
 * @property {number} computeHours - Total compute hours consumed
 * @property {number} storageTB - Total storage used in terabytes
 * @property {number} egressGB - Total data egress in gigabytes
 * @property {number} totalCost - Total cost in USD for the day
 * @property {number} alertsCount - Number of alerts generated
 * @example
 * const aggregate: Aggregate = {
 *   date: '2024-03-15',
 *   computeHours: 8500,
 *   storageTB: 350,
 *   egressGB: 1200,
 *   totalCost: 42000,
 *   alertsCount: 12
 * };
 */
export interface Aggregate {
  date: string;
  computeHours: number;
  storageTB: number;
  egressGB: number;
  totalCost: number;
  alertsCount: number;
}

/**
 * Represents an operational alert requiring attention.
 * @interface Alert
 * @property {string} id - Unique identifier for the alert
 * @property {string} tenantId - Reference to the affected tenant
 * @property {'critical' | 'high' | 'medium' | 'low'} severity - Alert severity level
 * @property {string} category - Alert category (Performance, Cost, Security, etc.)
 * @property {string} createdAt - ISO 8601 timestamp when alert was created
 * @property {'open' | 'assigned' | 'resolved' | 'snoozed'} status - Current alert status
 * @property {string} [owner] - User ID of assigned owner (optional)
 * @property {string} title - Brief alert title
 * @property {string} description - Detailed alert description
 * @example
 * const alert: Alert = {
 *   id: 'alert-001',
 *   tenantId: 'tenant-123',
 *   severity: 'high',
 *   category: 'Performance',
 *   createdAt: '2024-03-15T10:30:00Z',
 *   status: 'open',
 *   title: 'High CPU utilization detected',
 *   description: 'CPU usage above 90% for 15 minutes'
 * };
 */
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

/**
 * Tracks feature adoption metrics over time.
 * @interface FeatureAdoption
 * @property {string} date - Date in YYYY-MM-DD format
 * @property {string} feature - Name of the feature being tracked
 * @property {number} activeTenants - Number of tenants using the feature
 * @property {number} adoptionPct - Adoption percentage (0-100)
 * @example
 * const adoption: FeatureAdoption = {
 *   date: '2024-03-15',
 *   feature: 'Advanced Analytics',
 *   activeTenants: 25,
 *   adoptionPct: 45
 * };
 */
export interface FeatureAdoption {
  date: string;
  feature: string;
  activeTenants: number;
  adoptionPct: number;
}

/**
 * AI-generated recommendation for optimization.
 * @interface Recommendation
 * @property {string} id - Unique identifier for the recommendation
 * @property {'cost' | 'performance' | 'compliance' | 'adoption'} type - Recommendation category
 * @property {string} title - Brief recommendation title
 * @property {string} description - Short description of the issue
 * @property {number} impactScore - Impact score (0-100, higher = more impactful)
 * @property {number} estSavingsMonthly - Estimated monthly savings in USD
 * @property {string} actionLink - URL path to take action
 * @property {string} details - Detailed explanation and rationale
 * @example
 * const recommendation: Recommendation = {
 *   id: 'rec-001',
 *   type: 'cost',
 *   title: 'Rightsize overprovisioned instances',
 *   description: '12 instances running at <30% CPU',
 *   impactScore: 85,
 *   estSavingsMonthly: 4200,
 *   actionLink: '/optimize/rightsize',
 *   details: 'Analysis shows sustained low utilization...'
 * };
 */
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

/**
 * Dashboard filter configuration for data queries.
 * @interface DashboardFilters
 * @property {'1d' | '7d' | '30d' | '90d' | 'custom'} timeRange - Selected time range
 * @property {string} [tenantId] - Filter by specific tenant
 * @property {string} [region] - Filter by region
 * @property {string} [provider] - Filter by cloud provider
 * @property {string} [tier] - Filter by subscription tier
 * @property {{ from: Date; to: Date }} [customDateRange] - Custom date range (when timeRange is 'custom')
 * @example
 * const filters: DashboardFilters = {
 *   timeRange: '7d',
 *   region: 'us-east-1',
 *   provider: 'AWS'
 * };
 */
export interface DashboardFilters {
  timeRange: '1d' | '7d' | '30d' | '90d' | 'custom';
  tenantId?: string;
  region?: string;
  provider?: string;
  tier?: string;
  customDateRange?: { from: Date; to: Date };
}

/**
 * Key Performance Indicator data structure with trend information.
 * @interface KPIMetric
 * @property {number} value - Current metric value
 * @property {number} delta - Percentage change from previous period
 * @property {number[]} trend - Array of recent values for sparkline
 */
interface KPIMetric {
  value: number;
  delta: number;
  trend: number[];
}

/**
 * Complete KPI data for the dashboard overview.
 * @interface KPIData
 * @property {KPIMetric} activeTenants - Active tenant count and trends
 * @property {KPIMetric} activeWorkloads - Active workload count and trends
 * @property {KPIMetric} currentMonthSpend - Current month spending in USD
 * @property {KPIMetric} openAlerts24h - Open alerts in last 24 hours
 * @property {KPIMetric} featureAdoption - Feature adoption percentage
 * @example
 * const kpis: KPIData = {
 *   activeTenants: { value: 247, delta: 8.5, trend: [220, 225, 230, 235, 247] },
 *   activeWorkloads: { value: 1834, delta: 12.3, trend: [1620, 1700, 1780, 1834] },
 *   currentMonthSpend: { value: 847000, delta: -12, trend: [920000, 880000, 847000] },
 *   openAlerts24h: { value: 8, delta: -37.5, trend: [15, 12, 10, 8] },
 *   featureAdoption: { value: 67.8, delta: 5.2, trend: [62, 64, 66, 67.8] }
 * };
 */
export interface KPIData {
  activeTenants: { value: number; delta: number; trend: number[] };
  activeWorkloads: { value: number; delta: number; trend: number[] };
  currentMonthSpend: { value: number; delta: number; trend: number[] };
  openAlerts24h: { value: number; delta: number; trend: number[] };
  featureAdoption: { value: number; delta: number; trend: number[] };
}
