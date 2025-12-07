# CloudHub 2.0 - Hybrid Cloud Management Platform

A comprehensive enterprise-grade hybrid cloud management platform built with React, TypeScript, and modern web technologies. CloudHub 2.0 provides AI-powered operations, cost optimization, sustainability tracking, and unified infrastructure management.

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

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **State Management**: React Context + TanStack Query
- **Routing**: React Router v6
- **Charts & Visualization**: Recharts, Three.js (3D)
- **Form Handling**: React Hook Form + Zod validation
- **Notifications**: Sonner toast library

---

## 📦 Modules & Features

### 1. Dashboard (`/`)

The main command center providing a unified view of hybrid cloud operations.

**Features:**
- **Role-Based Views**: Toggle between Executive, Operations, and Default views with customized KPI visibility
- **Key Performance Indicators (KPIs)**:
  - Active Tenants count with trend indicators
  - Active Workloads monitoring
  - Current Month Spend tracking
  - Open Alerts (24h) with severity breakdown
  - Feature Adoption percentage
- **Time Range Selector**: Filter data by 24h, 7d, 30d, or custom ranges
- **Usage & Cost Trends**: Interactive line/area charts showing historical patterns
- **Workload Distribution**: Visual breakdown of workload allocation
- **Recommendations Panel**: AI-generated optimization suggestions
- **Alerts Panel**: Prioritized action items requiring attention
- **Export & Share**: Dashboard data export and sharing capabilities

---

### 2. AIOps Command Center (`/aiops`)

AI-powered operations center with global infrastructure visibility and intelligent automation.

**Features:**

#### Location View
- **Global Server Map**: Interactive world map displaying server locations with real-time status
- **Server Status Overview**: Healthy/Warning/Critical counts with color-coded badges
- **Real-Time Telemetry**: CPU, memory, temperature, power usage, network traffic (4-second refresh)
- **Scenario Simulator**: Run what-if scenarios on infrastructure

#### Topology View
- **Infrastructure Topology**: Visual representation of network and server relationships
- **Connection Mapping**: Understand dependencies between components

#### Time Machine
- **Historical Playback**: Review past infrastructure states
- **Timeline Navigation**: Jump to specific points in time for analysis

#### AI Prediction
- **Predictive Failure Analysis**: ML-based forecasting of potential issues
- **Risk Scoring**: Probability-based assessment of failure likelihood
- **Recommended Actions**: AI-suggested preventive measures

#### Capacity Heatmap
- **Resource Utilization Visualization**: Heat-based display of capacity usage
- **Hotspot Identification**: Quickly identify overloaded resources

#### Auto-Remediation
- **Automated Remediation Engine**: Self-healing capabilities for common issues
- **Remediation History**: Track automated fixes applied
- **Manual Override Options**: Human-in-the-loop controls

#### Workload Optimizer
- **Workload Recommendation Engine**: AI-driven placement suggestions
- **Cost/Performance Trade-offs**: Balance between efficiency and spending
- **Migration Recommendations**: Optimal workload redistribution

#### Collaboration
- **Collaboration Canvas**: Team workspace for incident response
- **Ticketing Integration**: Connect with ServiceNow, Jira, and other ITSM tools

#### AR Maintenance
- **AR Guided Maintenance**: Augmented reality assistance for physical maintenance tasks
- **Step-by-Step Procedures**: Visual guides for hardware operations

---

### 3. Edge & 5G Management (`/edge-management`)

Comprehensive edge computing and 5G infrastructure management.

**Features:**

#### Device Health Dashboard
- **Edge Device Inventory**: Track 5G nodes, IoT gateways, and edge servers
- **Health Metrics**: Latency, CPU, memory, security scores per device
- **Uptime Monitoring**: Individual device availability tracking
- **Status Badges**: Online/Warning/Offline visual indicators

#### Live Alerts
- **Edge Alert Monitor**: Real-time alerts from edge infrastructure
- **Alert Severity Classification**: Critical/High/Medium/Low prioritization
- **Alert Acknowledgment**: Track alert lifecycle

#### Network Traffic
- **Network Traffic Visualizer**: Real-time traffic flow visualization
- **Bandwidth Monitoring**: Track network capacity utilization
- **Traffic Patterns**: Historical traffic analysis

#### Predictive Maintenance
- **ML-Based Maintenance Predictions**: Forecast maintenance needs
- **Failure Probability Scores**: Risk assessment per device
- **Maintenance Scheduling**: Optimize maintenance windows

#### Multi-Region Management
- **Cross-Region Orchestration**: Manage edge across geographic regions
- **Regional Health Dashboards**: Per-region status overview
- **Failover Management**: Handle regional incidents

#### Topology Map
- **Edge Topology Visualization**: Geographic device placement
- **Connection Links**: Visualize inter-device communication
- **Status Overlay**: Real-time health on topology

#### Incident Response
- **Edge Incident Response**: Dedicated incident management for edge
- **Runbook Execution**: Automated response procedures
- **Escalation Workflows**: Multi-tier escalation

#### Configuration Management
- **Edge Config Management**: Centralized configuration control
- **Version Control**: Track configuration changes
- **Bulk Operations**: Apply configs across multiple devices

#### Zero-Touch Provisioning
- **Automated Device Onboarding**: <10 minute provisioning
- **Progress Tracking**: Step-by-step provisioning status
- **Device Discovery**: Automatic new device detection
- **Security Validation**: Ensure compliance during onboarding

#### Latency-Based Routing
- **Smart Traffic Routing**: Route based on real-time latency
- **SLA Monitoring**: Track latency against thresholds
- **Route Optimization**: Automatic path selection

#### Predictive Scaling
- **AI-Based Scaling**: Predict and pre-scale resources
- **Capacity Planning**: Forecast future capacity needs
- **Auto-Scaling Rules**: Configure scaling policies

---

### 4. FinOps Dashboard (`/finops`)

AI-powered financial operations for cloud cost management.

**Features:**
- **Cost Overview KPIs**:
  - Current Monthly Cost with month-over-month comparison
  - Forecasted Spending with confidence intervals
  - Potential Savings identification
  - Active Cost Anomalies count
- **Cost Trend & Forecast Chart**: Actual vs. Forecast vs. Optimized projection lines
- **Cost by Cloud Provider**: Pie chart breakdown (CloudHub, AWS, Azure, GCP)
- **Cost by Service Category**: Compute, Storage, Network, Database with trend indicators
- **AI-Powered Recommendations**:
  - Right-sizing suggestions with annual savings estimates
  - Spot instance migration opportunities
  - Cold storage archival recommendations
  - Reserved capacity optimization
- **Anomaly Detection**: Real-time cost spike alerts
- **One-Click Optimization**: Apply recommended changes instantly

---

### 5. GreenOps Dashboard (`/greenops`)

Sustainability tracking and carbon footprint optimization.

**Features:**
- **Sustainability KPIs**:
  - Current Carbon Footprint (tons CO₂)
  - Renewable Energy Percentage
  - Potential Carbon Reduction
  - Carbon Credits Balance
- **Carbon Emissions Trend Chart**: Historical and forecasted emissions
- **Renewable Energy by Region**: Stacked bar chart showing renewable vs. fossil mix
- **Carbon Emissions by Service**: Breakdown by Compute, Storage, Network, Database
- **Carbon Credit Marketplace**: 
  - Browse and purchase carbon offsets
  - Track offset portfolio
  - Credit verification and certification
- **AI Sustainability Recommendations**:
  - Workload geographic shifting for greener grids
  - Solar-peak batch job scheduling
  - Cool storage tiering suggestions
  - Green network routing optimization

---

### 6. Compliance Hub (`/compliance`)

Unified policy and compliance management across hybrid cloud.

**Features:**

#### Policy Templates
- **Pre-built Framework Templates**: GDPR, HIPAA, NIST, SOC 2, ISO 27001
- **Policy-as-Code**: Infrastructure compliance as code
- **Coverage Tracking**: Percentage of controls implemented
- **One-Click Deployment**: Deploy policies across infrastructure

#### Drift Detection
- **AI-Based Drift Detection**: Continuous monitoring for policy violations
- **Resource-Level Alerts**: Specific resource compliance status
- **Severity Classification**: Critical/High/Medium/Low
- **Auto-Remediation**: One-click fixes for common drifts
- **Remediation Steps**: Guided manual remediation

#### Compliance Scorecard
- **Overall Compliance Score**: Aggregate compliance health
- **Regional Compliance**: Per-region compliance status
- **Service Coverage**: Compliance by service type

#### Custom Policies
- **Policy Template Builder**: Create custom compliance rules
- **Control Mapping**: Map controls to regulations
- **Version Control**: Track policy changes

#### Violations Log
- **Real-Time Violation Tracking**: Continuous monitoring
- **Historical Violations**: Audit trail of past issues
- **Violation Trends**: Analyze compliance patterns

#### Export & Reporting
- **PDF Compliance Reports**: Generate executive summaries
- **Detailed Findings**: Technical violation details
- **Audit-Ready Documentation**: Prepare for auditors

---

### 7. Integrations Hub (`/integrations`)

Manage connections to cloud platforms, AI models, and enterprise tools.

**Features:**

#### Data Sources
- InfraMonitor infrastructure monitoring
- CloudHub Telemetry metrics
- AWS CloudWatch integration
- Azure Monitor integration
- Sustainability Data connectors

#### AI Models
- Predictive Failure (LSTM) - 94.2% accuracy
- Cost Forecaster - 1.2K predictions/day
- Carbon Optimizer - 18% savings
- Anomaly Detection (Transformer)
- NVIDIA NIM inference integration

#### External Integrations
- VMware Aria
- Azure Arc
- ServiceNow
- Jira
- Terraform Cloud

#### InfraMonitor Deep Integration
- **Configuration Panel**: Connection settings and credentials
- **Real-Time Monitoring**: Node status and metrics
- **Alert Management**: Centralized alert configuration
- **Data Validation**: Conflict resolution for data inconsistencies

---

### 8. AI Models Dashboard (`/ai-models`)

Monitor and manage AI/ML models powering intelligent operations.

**Features:**
- **Model Inventory**:
  - Predictive Failure Model (LSTM) - 72-hour advance predictions
  - Cost Forecaster (Transformer) - Spending predictions
  - Carbon Optimizer (Multi-objective RL) - Sustainability optimization
  - Anomaly Detection (Transformer) - Pattern detection
  - Workload Predictor (LSTM+CNN) - Resource demand forecasting
- **Model Metrics**:
  - Accuracy percentages with progress bars
  - Daily prediction volumes
  - Status (Active/Training/Idle)
  - Architecture details
- **Aggregate Statistics**:
  - Active model count
  - Average accuracy across models
  - Total daily predictions

---

### 9. Marketplace (`/marketplace`)

Discover and deploy partner solutions for hybrid infrastructure.

**Features:**
- **Solution Catalog**: 12+ enterprise solutions from partners
- **Vendor Categories**: Hardware, VMware, Nutanix, NVIDIA
- **Category Filters**: Compute, Virtualization, HCI, AI/ML, Networking, Storage, Containers, Platform
- **AI-Powered Recommendations**: Suggestions based on deployed solutions
- **Solution Comparison**: Side-by-side feature comparison
- **Deployment Tracker**: Real-time deployment progress
- **Revenue Share Visibility**: Partner revenue percentages
- **Solution Details**:
  - Features list
  - Compatibility matrix
  - Deployment time estimates
  - Pricing information
  - User ratings and deployment counts

---

### 10. Learning Hub (`/learning-hub`)

Personalized learning paths and expert resources.

**Features:**

#### My Courses
- **Course Catalog**: Videos, labs, and articles
- **Progress Tracking**: Per-course completion percentage
- **Level Classification**: Beginner/Intermediate/Advanced
- **Provider Filtering**: VMware, Platform, Nutanix, Microsoft, NVIDIA
- **Role-Based Filtering**: IT Admin, FinOps Lead, Sustainability Manager, Developer
- **AI Recommendations**: Personalized course suggestions

#### Partner Resources
- **Partner Knowledge Portal**: Curated partner documentation
- **Unified Search**: Search across all partner resources
- **Resource Types**: Docs, Videos, Certifications, Support

#### Community
- **Trending Discussions**: Popular community topics
- **Expert Contributors**: Featured community experts
- **Discussion Threads**: Q&A and knowledge sharing

#### Help Center
- **Learning Assistant**: AI-powered help chatbot
- **FAQ Database**: Common questions and answers
- **Support Ticket Integration**: Escalate to human support

#### Certificates
- **Certificate Generator**: Generate completion certificates
- **Verification System**: QR code verification
- **PDF Download**: Shareable certificate documents

---

### 11. Partner Analytics (`/partner-analytics`)

Track revenue, deployments, and partner performance metrics.

**Features:**
- Revenue tracking per partner
- Deployment metrics
- Performance scorecards
- Trend analysis

---

### 12. Admin Console (`/admin`)

Multi-tenant administration and management.

**Features:**

#### Admin Dashboard (`/admin`)
- **Quick Navigation**: Access to all admin functions
- **Quick Stats**: Total tenants, active deployments, monthly revenue, satisfaction scores

#### Tenant Directory (`/admin/tenant-directory`)
- **Organization List**: All customer organizations
- **Health Indicators**: Per-tenant status
- **Quick Actions**: View, Edit, Provision

#### Client View (`/admin/client-view/:tenantId`)
- **Tenant Details**: Comprehensive customer information
- **License Management**: Subscription and licensing
- **Usage Metrics**: Resource consumption
- **Support History**: Ticket history

#### Provisioning (`/admin/provisioning/:tenantId`)
- **Deployment Tasks**: Implementation checklist
- **Progress Tracking**: Visual progress indicators
- **WebSocket Updates**: Real-time status updates

#### Create Organization (`/admin/create-organization`)
- **Organization Setup**: New tenant onboarding
- **Plan Selection**: CloudHub, Standard, Enterprise
- **Configuration Wizard**: Step-by-step setup

#### Audit Log (`/admin/audit-log`)
- **Activity History**: All administrative actions
- **Filtering**: By user, action type, date range
- **Export**: Audit report generation

---

### 13. Profile & Settings

#### Profile (`/profile`)
- **User Information**: Name, email, role
- **Department & Location**: Organizational info
- **Certifications**: Skill badges and certifications
- **Activity History**: Recent actions

#### Settings (`/settings`)
- **Notification Preferences**: Email, SMS, push settings
- **Theme Settings**: Dark/Light mode
- **API Access**: API key management
- **Integration Settings**: Connected services

---

### 14. Nova AI Assistant

Floating AI copilot available throughout the application.

**Features:**
- **Chat Interface**: Natural language interaction
- **Context-Aware Responses**: Understands current page context
- **Alert Integration**: Surface critical alerts
- **Runbook Execution**: Trigger automated procedures
- **Learning Integration**: Access training resources
- **Multi-Tab Interface**: Chat, Alerts, Actions tabs

---

## 🎨 Design System

The application uses a comprehensive design system with:

- **Semantic Color Tokens**: Primary, secondary, accent, success, warning, destructive
- **Dark/Light Mode Support**: Full theme switching capability
- **Consistent Component Library**: shadcn/ui components with custom variants
- **Responsive Design**: Mobile-first approach with breakpoints
- **Animation System**: Tailwind CSS animations and Framer Motion

---

## 📁 Project Structure

```
src/
├── assets/           # Static assets (images, icons)
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

## 🔧 Configuration Files

- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS configuration with custom theme
- `tsconfig.json` - TypeScript configuration
- `components.json` - shadcn/ui component configuration

---

## 📄 License

Proprietary - All rights reserved.

---

## 🔗 Links

- **Project URL**: https://lovable.dev/projects/46b79bf3-9c94-4e1e-83ad-6b701e920511
- **Documentation**: See `ARCHITECTURE.md` for technical architecture details
