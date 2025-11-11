import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Integrations from "./pages/Integrations";
import AIModels from "./pages/AIModels";
import FinOps from "./pages/FinOps";
import GreenOps from "./pages/GreenOps";
import DigitalTwin from "./pages/DigitalTwin";
import Compliance from "./pages/Compliance";
import Marketplace from "./pages/Marketplace";
import PartnerAnalytics from "./pages/PartnerAnalytics";
import EdgeManagement from "./pages/EdgeManagement";
import LearningHub from "./pages/LearningHub";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import TenantDirectory from "./pages/admin/TenantDirectory";
import ClientView from "./pages/admin/ClientView";
import Provisioning from "./pages/admin/Provisioning";
import CreateOrganization from "./pages/admin/CreateOrganization";
import AuditLog from "./pages/admin/AuditLog";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/finops" element={<FinOps />} />
          <Route path="/greenops" element={<GreenOps />} />
          <Route path="/digital-twin" element={<DigitalTwin />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/ai-models" element={<AIModels />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/marketplace" element={<Marketplace />} />
          <Route path="/partner-analytics" element={<PartnerAnalytics />} />
          <Route path="/edge-management" element={<EdgeManagement />} />
          <Route path="/learning-hub" element={<LearningHub />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin/tenant-directory" element={<TenantDirectory />} />
          <Route path="/admin/client-view/:tenantId" element={<ClientView />} />
          <Route path="/admin/provisioning/:tenantId" element={<Provisioning />} />
          <Route path="/admin/create-organization" element={<CreateOrganization />} />
          <Route path="/admin/partner-insights" element={<PartnerAnalytics />} />
          <Route path="/admin/audit-log" element={<AuditLog />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
