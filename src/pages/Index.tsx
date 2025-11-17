import { Activity, DollarSign, Leaf, Server } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import KPICard from "@/components/KPICard";
import InfrastructureGlobe from "@/components/InfrastructureGlobe";
import AICopilot from "@/components/AICopilot";
import IncidentsList from "@/components/IncidentsList";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Hybrid Cloud Overview</h2>
          <p className="text-muted-foreground">Real-time insights across your infrastructure</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KPICard
            title="System Uptime"
            value="99.97%"
            trend="↑ 0.02% from last month"
            icon={Server}
            trendUp={true}
          />
          <KPICard
            title="Infrastructure Cost"
            value="$847K"
            trend="↓ 12% cost reduction"
            icon={DollarSign}
            trendUp={true}
          />
          <KPICard
            title="Carbon Footprint"
            value="2.4T CO₂"
            trend="↓ 18% this quarter"
            icon={Leaf}
            trendUp={true}
          />
          <KPICard
            title="Active Incidents"
            value="2"
            trend="↓ 5 resolved today"
            icon={Activity}
            trendUp={true}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <InfrastructureGlobe />
          <IncidentsList />
        </div>
      </main>

      <AICopilot />
      <Footer />
    </div>
  );
};

export default Index;
