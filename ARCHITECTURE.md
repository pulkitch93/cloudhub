# CloudHub 2.0 - Technical Architecture

This document provides a comprehensive technical overview of the CloudHub 2.0 platform architecture.

---

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CloudHub 2.0 Platform                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         Presentation Layer                           │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐   │   │
│  │  │Dashboard│ │  AIOps  │ │  Edge   │ │ FinOps  │ │  GreenOps   │   │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────────┘   │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────────┐   │   │
│  │  │Compliance│ │Marketplace│ │Learning│ │  Admin  │ │ Nova AI    │   │   │
│  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────▼───────────────────────────────────┐   │
│  │                        State Management Layer                        │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │   │
│  │  │ React Context│  │TanStack Query│  │ Local Storage Hooks      │  │   │
│  │  │  (Dashboard) │  │  (API Cache) │  │ (Persistence)            │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────▼───────────────────────────────────┐   │
│  │                         Service Layer                                │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────────┐  │   │
│  │  │ Dashboard API│  │ Nova AI Svc  │  │ WebSocket Service        │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                        │
│  ┌─────────────────────────────────▼───────────────────────────────────┐   │
│  │                      External Integrations                           │   │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐            │   │
│  │  │  AWS   │ │ Azure  │ │ VMware │ │Nutanix │ │ NVIDIA │            │   │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Component Architecture

### Core Application Structure

```
App.tsx
├── QueryClientProvider (TanStack Query)
│   └── TooltipProvider (Radix UI)
│       ├── Toaster (shadcn/ui)
│       ├── Sonner (Toast notifications)
│       └── BrowserRouter (React Router)
│           ├── Routes
│           │   ├── / → NewDashboard
│           │   ├── /aiops → AIOps
│           │   ├── /edge-management → EdgeManagement
│           │   ├── /finops → FinOps
│           │   ├── /greenops → GreenOps
│           │   ├── /compliance → Compliance
│           │   ├── /integrations → Integrations
│           │   ├── /ai-models → AIModels
│           │   ├── /marketplace → Marketplace
│           │   ├── /learning-hub → LearningHub
│           │   ├── /partner-analytics → PartnerAnalytics
│           │   ├── /profile → Profile
│           │   ├── /settings → Settings
│           │   ├── /admin/* → Admin Routes
│           │   └── * → NotFound
│           └── NovaFloatingLauncher (Global AI Assistant)
```

---

## 📂 Directory Structure

```
src/
├── assets/                    # Static assets
│   ├── lenovo-cloud-icon.png
│   └── world-map.jpg
│
├── components/                # Reusable components
│   ├── dashboard/             # Dashboard-specific
│   │   ├── AlertsPanel.tsx
│   │   ├── DashboardKPICard.tsx
│   │   ├── RecommendationsPanel.tsx
│   │   ├── RoleToggle.tsx
│   │   ├── TimeRangeSelector.tsx
│   │   ├── TrendCharts.tsx
│   │   └── WorkloadDistribution.tsx
│   │
│   ├── lena/                  # Nova AI Assistant
│   │   ├── LenaAlertsTab.tsx
│   │   ├── LenaChatPanel.tsx
│   │   ├── LenaFloatingLauncher.tsx
│   │   ├── LenaMessageList.tsx
│   │   └── LenaRunbookDrawer.tsx
│   │
│   ├── ui/                    # shadcn/ui components
│   │   ├── accordion.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── tabs.tsx
│   │   └── ... (40+ components)
│   │
│   ├── AICopilot.tsx
│   ├── ARGuidedMaintenance.tsx
│   ├── AnomalyAlert.tsx
│   ├── AutomatedRemediation.tsx
│   ├── CapacityHeatmap.tsx
│   ├── CarbonCreditMarketplace.tsx
│   ├── CertificateGenerator.tsx
│   ├── CollaborationCanvas.tsx
│   ├── DeploymentTracker.tsx
│   ├── DigitalTwin3DView.tsx
│   ├── EdgeAlertMonitor.tsx
│   ├── EdgeConfigManagement.tsx
│   ├── EdgeIncidentResponse.tsx
│   ├── EdgeTopologyMap.tsx
│   ├── Footer.tsx
│   ├── GlobalServerMap.tsx
│   ├── Header.tsx
│   ├── IncidentsList.tsx
│   ├── InfrastructureGlobe.tsx
│   ├── InfrastructureTopology.tsx
│   ├── KPICard.tsx
│   ├── LearningAssistant.tsx
│   ├── MapFilters.tsx
│   ├── MultiRegionManagement.tsx
│   ├── NavLink.tsx
│   ├── NetworkTrafficVisualizer.tsx
│   ├── PolicyTemplateBuilder.tsx
│   ├── PredictiveFailureAnalysis.tsx
│   ├── PredictiveMaintenanceML.tsx
│   ├── ScenarioSimulator.tsx
│   ├── TelemetryOverlay.tsx
│   ├── TicketingIntegration.tsx
│   ├── TimeMachine.tsx
│   ├── UserProfileMenu.tsx
│   ├── WorkloadRecommendationEngine.tsx
│   ├── XClarityAlerts.tsx
│   ├── XClarityConfig.tsx
│   ├── XClarityConflictResolution.tsx
│   └── XClarityMonitoring.tsx
│
├── contexts/                  # React Context providers
│   └── DashboardContext.tsx   # Dashboard state management
│
├── hooks/                     # Custom React hooks
│   ├── use-mobile.tsx         # Mobile detection
│   ├── use-toast.ts           # Toast notifications
│   ├── useLocalStorage.ts     # Persistent storage
│   └── useUserRole.ts         # User role management
│
├── lib/                       # Utility libraries
│   └── utils.ts               # Common utilities (cn, etc.)
│
├── pages/                     # Route page components
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   ├── AuditLog.tsx
│   │   ├── ClientView.tsx
│   │   ├── CreateOrganization.tsx
│   │   ├── Provisioning.tsx
│   │   └── TenantDirectory.tsx
│   ├── AIModels.tsx
│   ├── AIOps.tsx
│   ├── Compliance.tsx
│   ├── DigitalTwin.tsx
│   ├── EdgeManagement.tsx
│   ├── FinOps.tsx
│   ├── GreenOps.tsx
│   ├── Index.tsx
│   ├── Integrations.tsx
│   ├── LearningHub.tsx
│   ├── Marketing.tsx
│   ├── Marketplace.tsx
│   ├── NewDashboard.tsx
│   ├── NotFound.tsx
│   ├── PartnerAnalytics.tsx
│   ├── Profile.tsx
│   └── Settings.tsx
│
├── services/                  # API service layers
│   ├── dashboardApi.ts        # Dashboard data fetching
│   └── lenaAiService.ts       # Nova AI service
│
├── types/                     # TypeScript definitions
│   ├── anomaly.ts             # Anomaly detection types
│   ├── dashboard.ts           # Dashboard types
│   ├── digitalTwin.ts         # Digital twin types
│   └── lenaAI.ts              # Nova AI types
│
├── utils/                     # Helper utilities
│   ├── analyticsExport.ts     # Analytics export functions
│   ├── pdfExport.ts           # PDF generation
│   └── provisioningWebSocket.ts # WebSocket utilities
│
├── App.tsx                    # Root application component
├── App.css                    # Global application styles
├── index.css                  # Tailwind CSS entry + design tokens
├── main.tsx                   # Application entry point
└── vite-env.d.ts              # Vite type definitions
```

---

## 🔄 State Management

### 1. Dashboard Context

```typescript
// contexts/DashboardContext.tsx
interface DashboardContextType {
  role: 'executive' | 'operations' | 'default';
  setRole: (role: Role) => void;
  filters: DashboardFilters;
  setFilters: (filters: DashboardFilters) => void;
  resetFilters: () => void;
}
```

**Usage:**
- Role-based view switching
- Time range filtering
- Filter state persistence

### 2. TanStack Query

```typescript
// For API data fetching and caching
const queryClient = new QueryClient();

// Usage in components
const { data, isLoading, error } = useQuery({
  queryKey: ['dashboardKPIs'],
  queryFn: () => dashboardApi.getKPIData(),
});
```

### 3. Local Storage Hooks

```typescript
// hooks/useLocalStorage.ts
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void]
```

**Used for:**
- User preferences persistence
- Deployed solutions tracking
- Compliance policy state
- Custom templates

---

## 🎨 Design System Architecture

### Tailwind Configuration

```typescript
// tailwind.config.ts
{
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        // ... semantic color tokens
      },
    },
  },
}
```

### CSS Variables (index.css)

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 222.2 47.4% 11.2%;
  --secondary: 210 40% 96.1%;
  --muted: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --success: 142.1 76.2% 36.3%;
  --warning: 38 92% 50%;
  /* ... more tokens */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... dark mode overrides */
}
```

---

## 📊 Data Flow Architecture

### Dashboard Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   User      │────>│ RoleToggle  │────>│  Context    │
│ Interaction │     │             │     │  Update     │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Render    │<────│  Dashboard  │<────│  useEffect  │
│   Update    │     │  Components │     │  Trigger    │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Real-Time Data Flow (AIOps)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  setInterval│────>│   Update    │────>│   State     │
│  (4 seconds)│     │  Telemetry  │     │   Update    │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  UI Update  │<────│   Component │<────│   Re-render │
│             │     │   Refresh   │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

---

## 🔌 Integration Points

### External Service Integrations

| Service | Type | Purpose |
|---------|------|---------|
| InfraMonitor | Infrastructure | Server monitoring & management |
| CloudHub Telemetry | Metrics | Platform telemetry collection |
| AWS CloudWatch | Cloud | AWS monitoring integration |
| Azure Monitor | Cloud | Azure monitoring integration |
| VMware Aria | Virtualization | VMware management |
| Nutanix | HCI | Hyperconverged infrastructure |
| NVIDIA NIM | AI | GPU inference optimization |
| ServiceNow | ITSM | Ticketing integration |
| Jira | ITSM | Issue tracking |
| Terraform Cloud | IaC | Infrastructure as code |

### AI Model Integrations

| Model | Architecture | Purpose |
|-------|--------------|---------|
| Predictive Failure | LSTM (3-layer) | Hardware failure prediction |
| Cost Forecaster | Transformer | Spending prediction |
| Carbon Optimizer | PPO (RL) | Sustainability optimization |
| Anomaly Detection | Transformer | Pattern anomaly detection |
| Workload Predictor | LSTM+CNN | Resource demand forecasting |

---

## 📱 Responsive Design Breakpoints

```css
/* Tailwind default breakpoints */
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X Extra large devices */
```

### Component Responsiveness

- **Dashboard KPIs**: 5 columns (lg) → 2 columns (md) → 1 column (sm)
- **Navigation**: Full menu (md+) → Hamburger menu (sm)
- **Charts**: Full width, height adjusts based on viewport
- **Cards**: Grid layouts with responsive column counts

---

## 🔐 Security Considerations

### Client-Side Security

1. **Input Validation**: Zod schemas for form validation
2. **XSS Prevention**: React's built-in escaping
3. **Sensitive Data**: No credentials stored client-side
4. **Local Storage**: Non-sensitive preferences only

### Future Backend Integration

When integrating with a backend:
- JWT token authentication
- Secure API endpoints
- Role-based access control (RBAC)
- Audit logging
- Rate limiting

---

## 📈 Performance Optimizations

### Current Optimizations

1. **Code Splitting**: React.lazy() for route-based splitting
2. **Memoization**: useMemo/useCallback for expensive operations
3. **Virtual Lists**: For large data sets (planned)
4. **Image Optimization**: WebP format, lazy loading
5. **Bundle Size**: Tree shaking via Vite

### Monitoring Points

- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Cumulative Layout Shift (CLS)

---

## 🧪 Testing Strategy

### Recommended Testing Approach

```
├── Unit Tests (Vitest)
│   ├── Utility functions
│   ├── Custom hooks
│   └── Component logic
│
├── Integration Tests
│   ├── Component interactions
│   ├── Context providers
│   └── API integrations
│
└── E2E Tests (Playwright/Cypress)
    ├── User flows
    ├── Navigation
    └── Form submissions
```

---

## 🚀 Deployment Architecture

### Build Process

```bash
npm run build
# Outputs to: dist/
```

### Deployment Options

1. **Static Hosting**: Vercel, Netlify, Cloudflare Pages
2. **Container**: Docker with nginx
3. **CDN**: Global edge deployment

### Environment Variables

```env
VITE_API_URL=https://api.cloudhub.example.com
VITE_WS_URL=wss://ws.cloudhub.example.com
VITE_ANALYTICS_ID=UA-XXXXX-X
```

---

## 📚 Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.1 | UI library |
| react-router-dom | ^6.30.1 | Client-side routing |
| @tanstack/react-query | ^5.83.0 | Server state management |
| recharts | ^2.15.4 | Data visualization |
| three | ^0.160.1 | 3D graphics |
| @react-three/fiber | ^8.18.0 | React Three.js wrapper |
| tailwindcss | (via config) | Utility-first CSS |
| shadcn/ui | (components) | UI component library |
| sonner | ^1.7.4 | Toast notifications |
| zod | ^3.25.76 | Schema validation |
| jspdf | ^3.0.3 | PDF generation |
| date-fns | ^3.6.0 | Date utilities |
| lucide-react | ^0.462.0 | Icon library |

---

## 🔮 Future Architecture Considerations

### Planned Enhancements

1. **Backend Integration**: Supabase/Lovable Cloud for persistence
2. **Real-Time Updates**: WebSocket for live data
3. **Offline Support**: Service Worker + IndexedDB
4. **Micro-Frontends**: Module federation for team scaling
5. **GraphQL**: Unified API layer
6. **Feature Flags**: Gradual rollout system

### Scalability Path

```
Current (SPA)
    │
    ▼
Add Backend (Supabase)
    │
    ▼
Edge Functions (Serverless)
    │
    ▼
Global CDN + Edge Compute
    │
    ▼
Multi-Region Deployment
```

---

## 📖 Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query)
- [Recharts](https://recharts.org/)
