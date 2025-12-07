# CloudHub 2.0 - API Documentation

Complete API documentation for all services, utilities, hooks, and modules in the CloudHub platform.

---

## Table of Contents

1. [Services](#services)
   - [Dashboard API](#dashboard-api)
   - [Nova AI Service](#nova-ai-service)
2. [Utility Functions](#utility-functions)
   - [Analytics Export](#analytics-export)
   - [PDF Export](#pdf-export)
   - [Provisioning WebSocket](#provisioning-websocket)
   - [Common Utilities](#common-utilities)
3. [Custom Hooks](#custom-hooks)
   - [useLocalStorage](#uselocalstorage)
   - [useUserRole](#useuserrole)
   - [useDashboard](#usedashboard)
   - [useMobile](#usemobile)
   - [useToast](#usetoast)
4. [Context Providers](#context-providers)
   - [DashboardContext](#dashboardcontext)
5. [Type Definitions](#type-definitions)

---

## Services

### Dashboard API

**Module:** `src/services/dashboardApi.ts`

The Dashboard API service provides methods for fetching platform data including tenants, workloads, metrics, alerts, and KPIs.

#### Methods

##### `getTenants()`

Retrieves all tenants in the platform.

```typescript
async getTenants(): Promise<Tenant[]>
```

**Returns:** `Promise<Tenant[]>` - Array of tenant objects

**Example:**
```typescript
import { dashboardApi } from '@/services/dashboardApi';

const tenants = await dashboardApi.getTenants();
console.log(`Total tenants: ${tenants.length}`);
```

---

##### `getWorkloads(filters?)`

Retrieves workloads with optional filtering.

```typescript
async getWorkloads(filters?: {
  tenantId?: string;
  provider?: string;
  region?: string;
}): Promise<Workload[]>
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `filters.tenantId` | `string` | Filter by tenant ID |
| `filters.provider` | `string` | Filter by cloud provider (AWS, Azure, GCP, IBM Cloud) |
| `filters.region` | `string` | Filter by region |

**Returns:** `Promise<Workload[]>` - Filtered array of workloads

**Example:**
```typescript
// Get all AWS workloads
const awsWorkloads = await dashboardApi.getWorkloads({ provider: 'AWS' });

// Get workloads for a specific tenant
const tenantWorkloads = await dashboardApi.getWorkloads({ tenantId: 'tenant-1' });

// Combine filters
const filtered = await dashboardApi.getWorkloads({
  provider: 'Azure',
  region: 'eu-west-1'
});
```

---

##### `getMetrics(from, to)`

Retrieves aggregated metrics for a date range.

```typescript
async getMetrics(from: string, to: string): Promise<Aggregate[]>
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `from` | `string` | Start date in ISO 8601 format |
| `to` | `string` | End date in ISO 8601 format |

**Returns:** `Promise<Aggregate[]>` - Daily aggregated metrics

**Example:**
```typescript
const metrics = await dashboardApi.getMetrics('2024-01-01', '2024-01-31');
const totalCost = metrics.reduce((sum, m) => sum + m.totalCost, 0);
console.log(`Total cost for period: $${totalCost}`);
```

---

##### `getAlerts(filters?)`

Retrieves alerts with optional tenant filtering.

```typescript
async getAlerts(filters?: { tenantId?: string }): Promise<Alert[]>
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `filters.tenantId` | `string` | Filter by tenant ID |

**Returns:** `Promise<Alert[]>` - Array of alert objects

**Example:**
```typescript
// Get all alerts
const allAlerts = await dashboardApi.getAlerts();

// Get alerts for specific tenant
const tenantAlerts = await dashboardApi.getAlerts({ tenantId: 'tenant-1' });

// Filter by severity
const criticalAlerts = allAlerts.filter(a => a.severity === 'critical');
```

---

##### `getFeatureAdoption()`

Retrieves feature adoption metrics over time.

```typescript
async getFeatureAdoption(): Promise<FeatureAdoption[]>
```

**Returns:** `Promise<FeatureAdoption[]>` - 30 days of adoption data

**Example:**
```typescript
const adoption = await dashboardApi.getFeatureAdoption();
const latestAdoption = adoption[adoption.length - 1].adoptionPct;
console.log(`Current adoption: ${latestAdoption}%`);
```

---

##### `getRecommendations()`

Retrieves AI-generated optimization recommendations.

```typescript
async getRecommendations(): Promise<Recommendation[]>
```

**Returns:** `Promise<Recommendation[]>` - Array of recommendations

**Example:**
```typescript
const recommendations = await dashboardApi.getRecommendations();
const highImpact = recommendations.filter(r => r.impactScore > 80);
const totalSavings = recommendations.reduce((sum, r) => sum + r.estSavingsMonthly, 0);
```

---

##### `getKPIData()`

Retrieves Key Performance Indicator data with trends.

```typescript
async getKPIData(): Promise<KPIData>
```

**Returns:** `Promise<KPIData>` - Complete KPI data object

**Example:**
```typescript
const kpis = await dashboardApi.getKPIData();
console.log(`Active tenants: ${kpis.activeTenants.value}`);
console.log(`Change from last period: ${kpis.activeTenants.delta}%`);
console.log(`Trend data: ${kpis.activeTenants.trend.join(', ')}`);
```

---

##### `assignAlert(id, userId)`

Assigns an alert to a user.

```typescript
async assignAlert(id: string, userId: string): Promise<void>
```

**Example:**
```typescript
await dashboardApi.assignAlert('alert-1', 'user-123');
```

---

##### `snoozeAlert(id, duration)`

Snoozes an alert for a specified duration.

```typescript
async snoozeAlert(id: string, duration: number): Promise<void>
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `id` | `string` | Alert ID |
| `duration` | `number` | Duration in minutes |

**Example:**
```typescript
// Snooze for 1 hour
await dashboardApi.snoozeAlert('alert-1', 60);
```

---

##### `applyRecommendation(id)`

Applies a recommendation.

```typescript
async applyRecommendation(id: string): Promise<void>
```

**Example:**
```typescript
await dashboardApi.applyRecommendation('rec-1');
```

---

### Nova AI Service

**Module:** `src/services/lenaAiService.ts`

The Nova AI service powers the AI assistant, providing alert management, runbook execution, and slash command handling.

#### Methods

##### `getAlerts(filters?)`

Retrieves alerts sorted by impact score.

```typescript
async getAlerts(filters?: {
  severity?: string;
  status?: string;
  timeWindow?: string;
}): Promise<NovaAlert[]>
```

**Example:**
```typescript
import { novaAiService } from '@/services/lenaAiService';

// Get critical alerts
const criticalAlerts = await novaAiService.getAlerts({ severity: 'critical' });

// Get open alerts
const openAlerts = await novaAiService.getAlerts({ status: 'open' });
```

---

##### `assignAlert(alertId, userId)`

Assigns an alert to a user.

```typescript
async assignAlert(alertId: string, userId: string): Promise<void>
```

---

##### `snoozeAlert(alertId, duration)`

Snoozes an alert.

```typescript
async snoozeAlert(alertId: string, duration: number): Promise<void>
```

---

##### `resolveAlert(alertId)`

Resolves an alert.

```typescript
async resolveAlert(alertId: string): Promise<void>
```

---

##### `executeRunbook(actionId)`

Executes an automated runbook.

```typescript
async executeRunbook(actionId: string): Promise<{
  success: boolean;
  message: string;
}>
```

**Example:**
```typescript
const result = await novaAiService.executeRunbook('action-1');
if (result.success) {
  console.log(result.message);
}
```

---

##### `parseSlashCommand(input)`

Parses a slash command from user input.

```typescript
parseSlashCommand(input: string): {
  command: string;
  args: string[];
} | null
```

**Example:**
```typescript
const parsed = novaAiService.parseSlashCommand('/alerts today');
// Returns: { command: 'alerts', args: ['today'] }

const notSlash = novaAiService.parseSlashCommand('regular message');
// Returns: null
```

---

##### `handleSlashCommand(command, args, context)`

Handles a parsed slash command.

```typescript
async handleSlashCommand(
  command: string,
  args: string[],
  context: NovaContext
): Promise<string>
```

**Supported Commands:**
| Command | Arguments | Description |
|---------|-----------|-------------|
| `/alerts` | `today` | Lists alerts from today |
| `/cost` | `top-drivers` | Shows top 5 cost drivers |
| `/rightsize` | `hotspots` | Shows rightsizing opportunities |
| `/explain` | `change last7d` | Explains recent changes |
| `/adoption` | `opportunities` | Shows adoption opportunities |

**Example:**
```typescript
const response = await novaAiService.handleSlashCommand(
  'alerts',
  ['today'],
  {
    currentPage: '/dashboard',
    filters: {},
    recentAlerts: 5,
    healthSignals: {}
  }
);
console.log(response);
```

---

## Utility Functions

### Analytics Export

**Module:** `src/utils/analyticsExport.ts`

Functions for exporting analytics data to various formats.

#### Interfaces

```typescript
interface AnalyticsData {
  revenueData: any[];
  deploymentData: any[];
  satisfactionData: any[];
  trendingSolutions: any[];
  vendorData: any[];
}

interface ExportFilters {
  dateRange: string;
  vendor?: string;
  category?: string;
}
```

#### `exportToCSV(data, filename)`

Exports data array to CSV file.

```typescript
exportToCSV(data: any[], filename: string): void
```

**Example:**
```typescript
import { exportToCSV } from '@/utils/analyticsExport';

const data = [
  { name: 'Item 1', value: 100 },
  { name: 'Item 2', value: 200 }
];
exportToCSV(data, 'my-export');
// Downloads: my-export_2024-03-15.csv
```

---

#### `exportToExcel(analyticsData, filters)`

Exports analytics data to multi-sheet Excel file.

```typescript
exportToExcel(analyticsData: AnalyticsData, filters: ExportFilters): void
```

**Generated Sheets:**
- Revenue
- Vendor Performance
- Deployments
- Satisfaction
- Trending Solutions

**Example:**
```typescript
import { exportToExcel } from '@/utils/analyticsExport';

exportToExcel({
  revenueData: [...],
  deploymentData: [...],
  satisfactionData: [...],
  trendingSolutions: [...],
  vendorData: [...]
}, {
  dateRange: '30d',
  vendor: 'all'
});
```

---

#### `exportToPDF(analyticsData, filters)`

Exports analytics data to formatted PDF report.

```typescript
exportToPDF(analyticsData: AnalyticsData, filters: ExportFilters): void
```

**Example:**
```typescript
import { exportToPDF } from '@/utils/analyticsExport';

exportToPDF(analyticsData, { dateRange: '30d' });
// Downloads: partner_analytics_2024-03-15.pdf
```

---

### PDF Export

**Module:** `src/utils/pdfExport.ts`

Compliance report PDF generation.

#### `generateComplianceReport(data)`

Generates a comprehensive compliance PDF report.

```typescript
interface ComplianceData {
  overallScore: number;
  activePolicies: number;
  driftAlerts: number;
  regionalScores: Array<{
    region: string;
    score: number;
    status: string;
  }>;
  driftAlertDetails: Array<{
    resource: string;
    policy: string;
    severity: string;
    detected: string;
    status: string;
  }>;
  violations: Array<{
    policy: string;
    resource: string;
    severity: string;
    timestamp: string;
  }>;
}

generateComplianceReport(data: ComplianceData): void
```

**Report Sections:**
1. Executive Summary
2. Regional Compliance Scores
3. Drift Alerts & Violations
4. Remediation Recommendations
5. Trend Analysis

**Example:**
```typescript
import { generateComplianceReport } from '@/utils/pdfExport';

generateComplianceReport({
  overallScore: 87,
  activePolicies: 5,
  driftAlerts: 3,
  regionalScores: [
    { region: 'US-East-1', score: 92, status: 'Excellent' }
  ],
  driftAlertDetails: [...],
  violations: [...]
});
```

---

### Provisioning WebSocket

**Module:** `src/utils/provisioningWebSocket.ts`

Real-time provisioning updates via WebSocket simulation.

#### Interfaces

```typescript
interface ProvisioningUpdate {
  taskId: string;
  status: "completed" | "in-progress" | "pending" | "failed";
  progress: number;
  message: string;
  timestamp: string;
}

type ProvisioningCallback = (update: ProvisioningUpdate) => void;
```

#### `getProvisioningWebSocket()`

Returns the singleton WebSocket instance.

```typescript
getProvisioningWebSocket(): ProvisioningWebSocket
```

#### Class: `ProvisioningWebSocket`

##### Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `connect` | `connect(tenantId: string): void` | Connects to provisioning updates |
| `subscribe` | `subscribe(callback: ProvisioningCallback): void` | Subscribes to updates |
| `unsubscribe` | `unsubscribe(callback: ProvisioningCallback): void` | Unsubscribes from updates |
| `disconnect` | `disconnect(): void` | Disconnects and cleans up |

**Example:**
```typescript
import { getProvisioningWebSocket, ProvisioningUpdate } from '@/utils/provisioningWebSocket';

const ws = getProvisioningWebSocket();

const handleUpdate = (update: ProvisioningUpdate) => {
  console.log(`Task ${update.taskId}: ${update.progress}% - ${update.message}`);
};

ws.subscribe(handleUpdate);
ws.connect('tenant-123');

// Later...
ws.unsubscribe(handleUpdate);
ws.disconnect();
```

---

### Common Utilities

**Module:** `src/lib/utils.ts`

#### `cn(...inputs)`

Merges class names using clsx and tailwind-merge.

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]): string
```

**Example:**
```typescript
import { cn } from '@/lib/utils';

// Basic usage
cn('px-4 py-2', 'bg-blue-500');
// Returns: 'px-4 py-2 bg-blue-500'

// Conditional classes
cn('btn', isActive && 'btn-active', isDisabled && 'opacity-50');

// Override handling
cn('px-4 py-2', 'px-6');
// Returns: 'py-2 px-6' (px-4 is overridden)
```

---

## Custom Hooks

### useLocalStorage

**Module:** `src/hooks/useLocalStorage.ts`

Persists state to localStorage with automatic serialization.

```typescript
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void]
```

**Parameters:**
| Name | Type | Description |
|------|------|-------------|
| `key` | `string` | localStorage key |
| `initialValue` | `T` | Default value if key doesn't exist |

**Returns:** Tuple of `[storedValue, setValue]`

**Example:**
```typescript
import { useLocalStorage } from '@/hooks/useLocalStorage';

function MyComponent() {
  const [settings, setSettings] = useLocalStorage('user-settings', {
    theme: 'dark',
    notifications: true
  });

  // Update entire object
  setSettings({ theme: 'light', notifications: false });

  // Update using function (for partial updates)
  setSettings(prev => ({ ...prev, theme: 'light' }));
}
```

---

### useUserRole

**Module:** `src/hooks/useUserRole.ts`

Manages user role state with localStorage persistence.

```typescript
type UserRole = "admin" | "user";

function useUserRole(): {
  role: UserRole;
  isAdmin: boolean;
  updateRole: (newRole: UserRole) => void;
}
```

**⚠️ Security Warning:** This is frontend-only. Always validate roles server-side.

**Example:**
```typescript
import { useUserRole } from '@/hooks/useUserRole';

function AdminPanel() {
  const { role, isAdmin, updateRole } = useUserRole();

  if (!isAdmin) {
    return <p>Access denied</p>;
  }

  return <AdminDashboard />;
}
```

---

### useDashboard

**Module:** `src/contexts/DashboardContext.tsx`

Accesses dashboard context for filters and role management.

```typescript
function useDashboard(): {
  filters: DashboardFilters;
  setFilters: (filters: DashboardFilters) => void;
  updateFilter: (key: keyof DashboardFilters, value: any) => void;
  role: AppRole;
  setRole: (role: AppRole) => void;
  resetFilters: () => void;
}
```

**Must be used within `DashboardProvider`.**

**Example:**
```typescript
import { useDashboard } from '@/contexts/DashboardContext';

function FilterPanel() {
  const { filters, updateFilter, resetFilters } = useDashboard();

  return (
    <>
      <select
        value={filters.timeRange}
        onChange={(e) => updateFilter('timeRange', e.target.value)}
      >
        <option value="1d">Last 24h</option>
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
      </select>
      <button onClick={resetFilters}>Reset</button>
    </>
  );
}
```

---

### useMobile

**Module:** `src/hooks/use-mobile.tsx`

Detects mobile viewport.

```typescript
function useMobile(): boolean
```

**Example:**
```typescript
import { useMobile } from '@/hooks/use-mobile';

function ResponsiveComponent() {
  const isMobile = useMobile();

  return isMobile ? <MobileLayout /> : <DesktopLayout />;
}
```

---

### useToast

**Module:** `src/hooks/use-toast.ts`

Toast notification management.

```typescript
function useToast(): {
  toast: (props: ToastProps) => void;
  toasts: Toast[];
  dismiss: (id?: string) => void;
}
```

**Example:**
```typescript
import { useToast } from '@/hooks/use-toast';

function MyComponent() {
  const { toast } = useToast();

  const handleAction = () => {
    toast({
      title: 'Success',
      description: 'Action completed successfully',
      variant: 'default'
    });
  };
}
```

---

## Context Providers

### DashboardContext

**Module:** `src/contexts/DashboardContext.tsx`

Provides dashboard state management.

#### Interface

```typescript
interface DashboardContextType {
  filters: DashboardFilters;
  setFilters: (filters: DashboardFilters) => void;
  updateFilter: (key: keyof DashboardFilters, value: any) => void;
  role: AppRole;
  setRole: (role: AppRole) => void;
  resetFilters: () => void;
}
```

#### Usage

```tsx
import { DashboardProvider, useDashboard } from '@/contexts/DashboardContext';

// Wrap your app
function App() {
  return (
    <DashboardProvider>
      <Dashboard />
    </DashboardProvider>
  );
}

// Use in child components
function Dashboard() {
  const { filters, role, setRole } = useDashboard();
  // ...
}
```

---

## Type Definitions

For complete type definitions, see:

- [`src/types/dashboard.ts`](./src/types/dashboard.ts) - Dashboard types
- [`src/types/anomaly.ts`](./src/types/anomaly.ts) - Anomaly detection types
- [`src/types/digitalTwin.ts`](./src/types/digitalTwin.ts) - Digital Twin types
- [`src/types/lenaAI.ts`](./src/types/lenaAI.ts) - Nova AI types

---

## Future: Storage Module (Planned)

When Lovable Cloud is enabled, the following storage methods will be available:

### File Upload

```typescript
// Upload a file to a storage bucket
async uploadFile(bucket: string, path: string, file: File): Promise<{
  path: string;
  fullPath: string;
  id: string;
}>
```

### File Download

```typescript
// Get a public URL for a file
getPublicUrl(bucket: string, path: string): string

// Download a file
async downloadFile(bucket: string, path: string): Promise<Blob>
```

### File Management

```typescript
// List files in a bucket
async listFiles(bucket: string, folder?: string): Promise<FileObject[]>

// Delete a file
async deleteFile(bucket: string, path: string): Promise<void>

// Move/rename a file
async moveFile(bucket: string, fromPath: string, toPath: string): Promise<void>
```

---

## Error Handling

All async methods should be wrapped in try-catch blocks:

```typescript
try {
  const data = await dashboardApi.getKPIData();
  // Handle success
} catch (error) {
  console.error('Failed to fetch KPI data:', error);
  // Handle error (show toast, retry, etc.)
}
```

---

## Rate Limiting

Currently, all API methods include simulated 300ms latency. In production:

- Implement exponential backoff for retries
- Cache responses where appropriate
- Use TanStack Query for automatic caching and deduplication

---

*Last updated: December 2024*
