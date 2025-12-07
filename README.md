# CloudHub 2.0 - Hybrid Cloud Management Platform

A comprehensive enterprise-grade hybrid cloud management platform built with React, TypeScript, and modern web technologies. CloudHub 2.0 provides AI-powered operations, cost optimization, sustainability tracking, and unified infrastructure management.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend Framework** | React 18 + TypeScript | Component-based UI development |
| **Build Tool** | Vite | Fast development server and optimized builds |
| **Styling** | Tailwind CSS | Utility-first CSS with custom design system |
| **UI Components** | shadcn/ui (Radix primitives) | Accessible, composable components |
| **State Management** | React Context + TanStack Query | Client and server state |
| **Routing** | React Router v6 | Client-side navigation |
| **Charts** | Recharts | Data visualization |
| **3D Graphics** | Three.js + React Three Fiber | 3D infrastructure visualization |
| **Form Handling** | React Hook Form + Zod | Form management and validation |
| **PDF Generation** | jsPDF + jspdf-autotable | Report generation |
| **Excel Export** | xlsx (SheetJS) | Spreadsheet export |
| **Notifications** | Sonner | Toast notifications |

---

## 📦 Feature Modules - Detailed Documentation

### 1. Dashboard Module (`/`)

**Location:** `src/pages/NewDashboard.tsx`

The main command center providing a unified view of hybrid cloud operations with role-based customization.

#### How It Was Built

The Dashboard uses a **Context-based architecture** with the `DashboardProvider` wrapping the entire module. This allows all child components to access shared state (filters, role selection) without prop drilling.

```typescript
// Context provides global state for the dashboard
const DashboardContent = () => {
  const { role, filters, resetFilters } = useDashboard();
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  
  useEffect(() => {
    const fetchKPIs = async () => {
      const data = await dashboardApi.getKPIData();
      setKpiData(data);
    };
    fetchKPIs();
  }, [filters]); // Re-fetch when filters change
```

#### How It Functions

1. **Role-Based Views**: The `RoleToggle` component switches between Executive/Operations views
   - Executive view: Shows KPIs, cost analysis, recommendations
   - Operations view: Shows KPIs, alerts, technical trends

2. **Dynamic Section Visibility**: `getVisibleSections()` determines which panels to render based on role

3. **Time Range Filtering**: `TimeRangeSelector` updates context, triggering data re-fetch

4. **KPI Cards**: Five cards display key metrics with:
   - Current value
   - Delta (% change from previous period)
   - Trend sparkline data

#### Components Used
- `DashboardKPICard` - Individual KPI display with trend
- `RoleToggle` - Role switching UI
- `TimeRangeSelector` - Time filter dropdown
- `TrendCharts` - Recharts line/area charts
- `WorkloadDistribution` - Pie/bar distribution charts
- `RecommendationsPanel` - AI recommendations list
- `AlertsPanel` - Priority alerts display

---

### 2. AIOps Command Center (`/aiops`)

**Location:** `src/pages/AIOps.tsx`

AI-powered operations center with global infrastructure visibility and intelligent automation.

#### How It Was Built

The AIOps module uses a **Tab-based architecture** with 9 specialized views. Real-time data simulation is achieved through `setInterval` with 4-second refresh cycles.

```typescript
// Real-time telemetry simulation
useEffect(() => {
  const interval = setInterval(() => {
    setServers(prevServers =>
      prevServers.map(server => ({
        ...server,
        telemetry: {
          cpu: randomize(server.telemetry.cpu, 10, 95),
          memory: randomize(server.telemetry.memory, 20, 98),
          temperature: randomize(server.telemetry.temperature, 30, 75),
          // ... more telemetry
        },
      }))
    );
    setLastUpdate(new Date());
  }, 4000);
  return () => clearInterval(interval);
}, []);
```

#### How It Functions

1. **Global Server Map**: Interactive map with server markers colored by status
2. **Real-Time Updates**: Telemetry values fluctuate every 4 seconds
3. **Server Selection**: Clicking a server shows detailed telemetry overlay
4. **Scenario Simulation**: Run what-if scenarios for capacity planning

#### Tab Components

| Tab | Component | Function |
|-----|-----------|----------|
| Location View | `GlobalServerMap`, `TelemetryOverlay` | Geographic visualization |
| Topology | `InfrastructureTopology` | Network relationship view |
| Time Machine | `TimeMachine` | Historical state playback |
| AI Prediction | `PredictiveFailureAnalysis` | ML-based failure prediction |
| Heatmap | `CapacityHeatmap` | Resource utilization heat display |
| Remediation | `AutomatedRemediation` | Self-healing automation |
| Workload | `WorkloadRecommendationEngine` | Placement optimization |
| Collaboration | `CollaborationCanvas`, `TicketingIntegration` | Team workspace |
| AR Maintenance | `ARGuidedMaintenance` | AR-assisted procedures |

---

### 3. Edge & 5G Management (`/edge-management`)

**Location:** `src/pages/EdgeManagement.tsx`

Comprehensive edge computing and 5G infrastructure management with zero-touch provisioning.

#### How It Was Built

Edge Management uses **stateful device management** with local state for devices and provisioning. The UI is organized into 11 tabs covering the complete edge lifecycle.

```typescript
// Device state with typed interface
const [devices, setDevices] = useState<EdgeDevice[]>([
  {
    id: 'edge-001',
    name: '5G Node Alpha',
    type: '5G',
    status: 'online',
    latency: 12,
    cpu: 45,
    memory: 62,
    security: 98,
    location: 'US-East',
    uptime: 99.8
  },
  // ... more devices
]);
```

#### How It Functions

1. **Device Health Dashboard**: Cards showing device metrics with progress bars
2. **Zero-Touch Provisioning**: Automated onboarding simulation
   ```typescript
   const startZeroTouchProvisioning = () => {
     setProvisioningStatus({ inProgress: true, progress: 0 });
     const steps = ['Device discovery...', 'Security validation...', ...];
     // Simulate step-by-step progress
   };
   ```
3. **Predictive Maintenance**: ML predictions for maintenance scheduling
4. **Multi-Region Management**: Cross-region orchestration controls

#### Key Components
- `EdgeTopologyMap` - Geographic edge device layout
- `EdgeAlertMonitor` - Real-time edge alerts
- `EdgeIncidentResponse` - Incident management
- `EdgeConfigManagement` - Configuration control
- `PredictiveMaintenanceML` - ML maintenance predictions
- `NetworkTrafficVisualizer` - Traffic flow visualization
- `MultiRegionManagement` - Regional orchestration

---

### 4. FinOps Dashboard (`/finops`)

**Location:** `src/pages/FinOps.tsx`

AI-powered financial operations for cloud cost management and optimization.

#### How It Was Built

FinOps uses **static mock data** for cost trends and recommendations, with Recharts for visualization. The module emphasizes actionable insights through the recommendations system.

```typescript
// Cost data structure
const costTrendData = [
  { month: "Jan", actual: 782, forecast: 780, optimized: 650 },
  { month: "Feb", actual: 815, forecast: 810, optimized: 680 },
  // Actual shows historical, forecast shows predicted, optimized shows potential
];

// AI Recommendations
const recommendations: Recommendation[] = [
  {
    id: "1",
    title: "Right-size over-provisioned instances",
    description: "17 EC2 instances running at <30% CPU utilization",
    savings: "$42K/year",
    impact: "high",
    category: "Compute",
  },
  // ...
];
```

#### How It Functions

1. **Cost KPIs**: Four cards showing current spend, forecast, savings, anomalies
2. **Trend Chart**: Three-line chart (actual, forecast, optimized)
3. **Cost Breakdown**: Pie chart by provider, bar chart by service
4. **Recommendations**: Prioritized list with one-click apply buttons

#### Visualization Approach
- LineChart for trend analysis
- PieChart for provider distribution
- Progress bars for service category comparison
- Badge components for impact classification

---

### 5. GreenOps Dashboard (`/greenops`)

**Location:** `src/pages/GreenOps.tsx`

Sustainability tracking and carbon footprint optimization with carbon credit marketplace.

#### How It Was Built

GreenOps mirrors FinOps architecture but focuses on environmental metrics. It includes the unique `CarbonCreditMarketplace` component for offset purchasing.

```typescript
// Carbon trend similar to cost trend but with CO₂ metrics
const carbonTrendData = [
  { month: "Jan", actual: 2.8, forecast: 2.7, optimized: 2.1 }, // Tons CO₂
  // ...
];

// Energy mix by region
const energyByRegion = [
  { region: "US-East", renewable: 65, fossil: 35, total: 425 },
  { region: "EU-West", renewable: 82, fossil: 18, total: 380 }, // Greener grid
  // ...
];
```

#### How It Functions

1. **Carbon KPIs**: Footprint, renewable %, reduction potential, credits
2. **Emissions Chart**: Area chart showing actual vs. optimized emissions
3. **Regional Energy Mix**: Stacked bar chart (renewable vs. fossil)
4. **Carbon Marketplace**: Browse and purchase carbon offsets
5. **Green Recommendations**: AI suggestions for sustainability

---

### 6. Compliance Hub (`/compliance`)

**Location:** `src/pages/Compliance.tsx`

Unified policy and compliance management with real-time drift detection.

#### How It Was Built

Compliance uses **localStorage persistence** via `useLocalStorage` hook for policy templates and violations. Real-time monitoring simulates drift detection.

```typescript
// Persistent policy storage
const [policyTemplates, setPolicyTemplates] = useLocalStorage('policy-templates', [
  { id: '1', name: 'GDPR Data Protection', framework: 'GDPR', status: 'deployed', coverage: 94 },
  // ...
]);

// Real-time compliance monitoring simulation
useEffect(() => {
  const checkInterval = setInterval(() => {
    const randomCheck = Math.random();
    if (randomCheck > 0.95) {
      // 5% chance of new violation each check
      const newViolation = { /* ... */ };
      setViolations(prev => [newViolation, ...prev.slice(0, 49)]);
      toast.warning('New compliance violation detected');
    }
  }, 10000); // Check every 10 seconds
  return () => clearInterval(checkInterval);
}, []);
```

#### How It Functions

1. **Compliance Score**: Dynamic score based on violations and drift
2. **Policy Templates**: GDPR, HIPAA, NIST, SOC 2, ISO 27001 templates
3. **Drift Detection**: AI-powered continuous monitoring
4. **Auto-Remediation**: One-click fixes for common violations
5. **PDF Reports**: Generate compliance reports via `generateComplianceReport()`

#### Key Components
- `PolicyTemplateBuilder` - Create custom policies
- Policy deployment with coverage tracking
- Real-time violation logging

---

### 7. Integrations Hub (`/integrations`)

**Location:** `src/pages/Integrations.tsx`

Manage connections to cloud platforms, AI models, and enterprise tools.

#### How It Was Built

Integrations uses a **categorized static list** with configuration dialogs. The InfraMonitor (formerly XClarity) integration includes deep configuration options.

```typescript
const integrations: Integration[] = [
  // Data Sources
  { name: "InfraMonitor", category: "data-source", status: "connected", metrics: [...] },
  { name: "AWS CloudWatch", category: "data-source", status: "connected" },
  
  // AI Models
  { name: "Predictive Failure (LSTM)", category: "ai-model", status: "connected" },
  
  // External APIs
  { name: "ServiceNow", category: "external-api", status: "warning" },
];
```

#### How It Functions

1. **Category Organization**: Data Sources, AI Models, External APIs
2. **Status Indicators**: Connected (green), Warning (yellow), Disconnected (red)
3. **Metrics Display**: Key metrics per integration
4. **Configuration Dialogs**: Deep settings for each integration

#### InfraMonitor Components
- `XClarityConfig` - Connection configuration
- `XClarityMonitoring` - Real-time monitoring view
- `XClarityAlerts` - Alert management
- `XClarityConflictResolution` - Data validation

---

### 8. AI Models Dashboard (`/ai-models`)

**Location:** `src/pages/AIModels.tsx`

Monitor and manage AI/ML models powering intelligent operations.

#### How It Was Built

Simple card-based display with static model definitions. Each model card shows architecture details and performance metrics.

```typescript
const models: AIModel[] = [
  {
    name: "Predictive Failure Model",
    type: "LSTM Network",
    architecture: "3-layer LSTM with attention",
    accuracy: 94.2,
    status: "active",
    predictions: "1.2K/day",
    description: "Predicts hardware failures 72 hours in advance",
    icon: AlertTriangle,
  },
  // ... more models
];
```

#### How It Functions

1. **Model Cards**: Display name, type, architecture, accuracy
2. **Status Badges**: Active (green), Training (yellow), Idle (gray)
3. **Aggregate Stats**: Total active models, average accuracy, daily predictions
4. **Progress Bars**: Visual accuracy representation

---

### 9. Marketplace (`/marketplace`)

**Location:** `src/pages/Marketplace.tsx`

Discover and deploy partner solutions for hybrid infrastructure.

#### How It Was Built

Marketplace uses **localStorage for state persistence** (deployed solutions, telemetry) and includes a comparison feature.

```typescript
// Solution catalog with rich metadata
const solutions: Solution[] = [
  {
    id: '1',
    name: 'ThinkSystem SR650 V3',
    vendor: 'Hardware',
    category: 'compute',
    price: 'Starting at $8,500/month',
    rating: 4.8,
    deployments: 342,
    features: ['Intel Xeon Scalable', 'Up to 8TB DDR5', 'NVIDIA GPU support'],
    compatibility: ['VMware vSphere', 'Nutanix AHV', 'Azure Arc'],
    deploymentTime: '2-4 hours',
    revenueShare: 15
  },
  // ...
];

// AI-powered recommendations
const getRecommendations = (): Solution[] => {
  // Rule-based recommendations based on deployed solutions
  deployedSolutions.forEach(deployedId => {
    const deployed = solutions.find(s => s.id === deployedId);
    if (deployed?.category === 'compute') {
      // Recommend complementary virtualization solutions
    }
  });
};
```

#### How It Functions

1. **Solution Catalog**: 12+ solutions with search and category filters
2. **AI Recommendations**: Based on deployment history
3. **Solution Comparison**: Side-by-side feature comparison
4. **Deployment Tracker**: Real-time deployment progress via `DeploymentTracker`
5. **Telemetry**: Usage tracking for analytics

---

### 10. Learning Hub (`/learning-hub`)

**Location:** `src/pages/LearningHub.tsx`

Personalized learning paths and expert resources with certification.

#### How It Was Built

Learning Hub combines course catalog, partner resources, and community features with gamification elements (streaks, XP, levels).

```typescript
const mockCourses: Course[] = [
  {
    id: '1',
    title: 'VMware Aria Integration Fundamentals',
    provider: 'VMware',
    duration: '2h 30m',
    level: 'Beginner',
    progress: 65,
    type: 'video',
    tags: ['Integration', 'VMware', 'Cloud']
  },
  // ...
];

// Gamification metrics
const completedCourses = mockCourses.filter(c => c.progress === 100).length;
const averageProgress = mockCourses.reduce((acc, c) => acc + c.progress, 0) / mockCourses.length;
```

#### How It Functions

1. **Course Catalog**: Filter by role, search by topic
2. **Progress Tracking**: Per-course completion with progress bars
3. **Partner Resources**: Curated content from VMware, Microsoft, NVIDIA, etc.
4. **Community**: Discussion threads, expert contributors
5. **Certificates**: PDF generation via `CertificateGenerator`

#### Key Components
- `LearningAssistant` - AI-powered help chatbot
- `CertificateGenerator` - PDF certificate creation

---

### 11. Admin Console (`/admin/*`)

**Location:** `src/pages/admin/`

Multi-tenant administration and management for platform operators.

#### How It Was Built

Admin uses nested routing with shared layout. Each admin page provides specific management capabilities.

#### Admin Pages

| Page | Path | Purpose |
|------|------|---------|
| `AdminDashboard` | `/admin` | Overview with quick stats and navigation |
| `TenantDirectory` | `/admin/tenant-directory` | List all customer organizations |
| `ClientView` | `/admin/client-view/:tenantId` | Detailed tenant information |
| `Provisioning` | `/admin/provisioning/:tenantId` | Deployment task management |
| `CreateOrganization` | `/admin/create-organization` | New tenant onboarding wizard |
| `AuditLog` | `/admin/audit-log` | Administrative action history |

#### Provisioning WebSocket

```typescript
// Real-time provisioning updates
const ws = getProvisioningWebSocket();
ws.connect(tenantId);
ws.subscribe((update: ProvisioningUpdate) => {
  setTasks(prev => prev.map(task =>
    task.id === update.taskId
      ? { ...task, status: update.status, progress: update.progress }
      : task
  ));
});
```

---

### 12. Nova AI Assistant (Global)

**Location:** `src/components/lena/`

Floating AI copilot available throughout the application.

#### How It Was Built

Nova uses a **floating launcher pattern** with a sheet-based chat interface. It supports natural language and slash commands.

```typescript
// Slash command handling
parseSlashCommand(input: string): { command: string; args: string[] } | null {
  if (!input.startsWith('/')) return null;
  const parts = input.slice(1).split(' ');
  return { command: parts[0], args: parts.slice(1) };
}

// Supported commands
// /alerts today
// /cost top-drivers
// /rightsize hotspots
// /explain change last7d
// /adoption opportunities
```

#### How It Functions

1. **Floating Launcher**: Persistent button in bottom-right corner
2. **Chat Interface**: Natural language conversation
3. **Slash Commands**: Quick command access
4. **Alert Integration**: Surface and manage alerts
5. **Runbook Execution**: Trigger automated procedures

#### Components
- `NovaFloatingLauncher` - Entry point button
- `NovaChatPanel` - Main chat interface
- `NovaMessageList` - Message display
- `NovaAlertsTab` - Alert list and actions
- `NovaRunbookDrawer` - Runbook execution UI

---

## 🏗️ Architecture Overview

```
src/
├── assets/           # Static images and icons
├── components/       # Reusable UI components
│   ├── dashboard/    # Dashboard-specific components
│   ├── lena/         # Nova AI assistant components
│   └── ui/           # shadcn/ui base components
├── contexts/         # React context providers
├── hooks/            # Custom React hooks
├── lib/              # Utility libraries
├── pages/            # Route page components
│   └── admin/        # Admin console pages
├── services/         # API service layers
├── types/            # TypeScript type definitions
└── utils/            # Helper utilities
```

---

## 📊 Data Flow

1. **User Interaction** → Component event handler
2. **State Update** → React state or Context update
3. **Service Call** → Async API call (currently mock data)
4. **UI Update** → Re-render with new data

---

## 🎨 Design System

The application uses a comprehensive design system:

- **CSS Variables**: Semantic color tokens in `index.css`
- **Tailwind Config**: Extended theme in `tailwind.config.ts`
- **Component Variants**: shadcn/ui components with custom variants
- **Dark/Light Mode**: Full theme switching support

---

## 📚 Additional Documentation

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) - Technical architecture and diagrams
- [`API_DOCUMENTATION.md`](./API_DOCUMENTATION.md) - Complete API reference

---

## 🔧 Development

```bash
# Development server
npm run dev

# Type checking
npm run typecheck

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📄 License

Proprietary - All rights reserved.

---

## 🔗 Links

- **Project URL**: https://lovable.dev/projects/46b79bf3-9c94-4e1e-83ad-6b701e920511

---

*Last updated: December 2024*
