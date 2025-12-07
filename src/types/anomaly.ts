/**
 * @fileoverview Anomaly detection type definitions for cost and carbon monitoring.
 * Contains interfaces for anomalies with root cause analysis and remediation steps.
 * @module types/anomaly
 * @version 1.0.0
 */

/**
 * Represents a detected anomaly in the system (cost or carbon).
 * Includes root cause analysis and recommended remediation steps.
 * @interface Anomaly
 * @property {string} id - Unique anomaly identifier (e.g., "ANM-001")
 * @property {"cost" | "carbon"} type - Type of anomaly detected
 * @property {"critical" | "warning" | "info"} severity - Anomaly severity level
 * @property {string} title - Brief title describing the anomaly
 * @property {string} description - Detailed description of what was detected
 * @property {string} detectedAt - ISO 8601 timestamp when anomaly was detected
 * @property {AnomalyMetric} metric - Quantitative metric information
 * @property {RootCause} rootCause - Root cause analysis details
 * @property {Remediation} remediation - Recommended remediation steps
 * @property {"active" | "acknowledged" | "resolved"} status - Current anomaly status
 * @example
 * const anomaly: Anomaly = {
 *   id: 'ANM-001',
 *   type: 'cost',
 *   severity: 'critical',
 *   title: 'Unexpected compute cost spike',
 *   description: 'Compute costs increased by 127% above forecast',
 *   detectedAt: '2024-03-15T10:30:00Z',
 *   metric: { name: 'Compute Cost', current: 425000, expected: 187000, deviation: 127 },
 *   rootCause: { summary: 'Auto-scaling triggered', details: [...], affectedResources: [...] },
 *   remediation: { automated: true, steps: [...], estimatedImpact: 'Save $18K/month' },
 *   status: 'active'
 * };
 */
export interface Anomaly {
  id: string;
  type: "cost" | "carbon";
  severity: "critical" | "warning" | "info";
  title: string;
  description: string;
  detectedAt: string;
  metric: {
    /**
     * Name of the metric being tracked
     * @example "Compute Cost", "Carbon Footprint"
     */
    name: string;
    /**
     * Current metric value
     */
    current: number;
    /**
     * Expected/baseline metric value
     */
    expected: number;
    /**
     * Percentage deviation from expected value
     */
    deviation: number;
  };
  rootCause: {
    /**
     * Brief summary of the root cause
     */
    summary: string;
    /**
     * Detailed list of contributing factors
     */
    details: string[];
    /**
     * List of affected resource identifiers
     */
    affectedResources: string[];
  };
  remediation: {
    /**
     * Whether automated remediation is available
     */
    automated: boolean;
    /**
     * Step-by-step remediation instructions
     */
    steps: string[];
    /**
     * Estimated impact of applying remediation
     */
    estimatedImpact: string;
  };
  status: "active" | "acknowledged" | "resolved";
}

/**
 * Mock anomalies data for demonstration and testing.
 * Includes realistic examples of cost and carbon anomalies.
 * @constant {Anomaly[]}
 * @example
 * import { mockAnomalies } from '@/types/anomaly';
 * const activeAnomalies = mockAnomalies.filter(a => a.status === 'active');
 */
export const mockAnomalies: Anomaly[] = [
  {
    id: "ANM-001",
    type: "cost",
    severity: "critical",
    title: "Unexpected compute cost spike in US-East",
    description: "Compute costs increased by 127% above forecast",
    detectedAt: new Date(Date.now() - 15 * 60000).toISOString(),
    metric: {
      name: "Compute Cost",
      current: 425000,
      expected: 187000,
      deviation: 127,
    },
    rootCause: {
      summary: "Auto-scaling triggered by unexpected traffic surge",
      details: [
        "Traffic increased from 2.3K req/s to 18.7K req/s at 09:42 UTC",
        "Auto-scaling policy added 47 EC2 instances in 12 minutes",
        "Instance type: c5.4xlarge ($0.68/hour) instead of configured c5.xlarge",
        "Scale-down policy failed to trigger after traffic normalized",
      ],
      affectedResources: [
        "web-cluster-prod-us-east-1",
        "api-gateway-prod",
        "load-balancer-prod-01",
      ],
    },
    remediation: {
      automated: true,
      steps: [
        "Validate traffic surge is legitimate (DDoS check: passed)",
        "Adjust auto-scaling policy to use correct instance types",
        "Trigger immediate scale-down to baseline capacity",
        "Enable cooling period to prevent rapid scaling cycles",
        "Set up cost anomaly alerts for this cluster",
      ],
      estimatedImpact: "Save $18K/month by right-sizing instances",
    },
    status: "active",
  },
  {
    id: "ANM-002",
    type: "carbon",
    severity: "warning",
    title: "Carbon emissions 42% above baseline",
    description: "Workload shifted to high-carbon intensity region",
    detectedAt: new Date(Date.now() - 45 * 60000).toISOString(),
    metric: {
      name: "Carbon Footprint",
      current: 3.4,
      expected: 2.4,
      deviation: 42,
    },
    rootCause: {
      summary: "Failover to APAC region with lower renewable energy mix",
      details: [
        "Primary EU-West region experienced latency spike at 08:15 UTC",
        "Automated failover routed 68% of traffic to APAC region",
        "APAC renewable energy: 48% vs EU-West: 82%",
        "ML training jobs continued in APAC despite resolution in EU-West",
      ],
      affectedResources: [
        "ml-training-cluster-apac",
        "cdn-apac-01",
        "database-replica-apac-02",
      ],
    },
    remediation: {
      automated: true,
      steps: [
        "Verify EU-West region latency is within SLA",
        "Gradually shift traffic back to EU-West (greener grid)",
        "Reschedule ML training to solar peak hours (11am-3pm local)",
        "Update failover policy to prioritize green regions",
        "Enable carbon-aware load balancing",
      ],
      estimatedImpact: "Reduce 685T CO₂/year by optimizing region selection",
    },
    status: "active",
  },
  {
    id: "ANM-003",
    type: "cost",
    severity: "warning",
    title: "Storage costs trending 23% above forecast",
    description: "Unoptimized data retention causing storage bloat",
    detectedAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    metric: {
      name: "Storage Cost",
      current: 215000,
      expected: 175000,
      deviation: 23,
    },
    rootCause: {
      summary: "Log retention policy not enforced, cold data not archived",
      details: [
        "Application logs accumulating at 2.8TB/day without rotation",
        "3.2TB of data untouched for 90+ days still in hot storage",
        "Database snapshots not deleted after 30-day retention period",
        "Development environments not cleaned up (45 stale S3 buckets)",
      ],
      affectedResources: [
        "logs-bucket-prod",
        "database-snapshots-prod",
        "dev-environment-storage",
      ],
    },
    remediation: {
      automated: true,
      steps: [
        "Enforce 30-day log retention policy",
        "Archive cold data (>90 days) to Glacier",
        "Delete stale database snapshots older than retention period",
        "Clean up unused development storage buckets",
        "Enable S3 lifecycle policies for automatic tiering",
      ],
      estimatedImpact: "Save $15K/year through intelligent data lifecycle management",
    },
    status: "acknowledged",
  },
];
