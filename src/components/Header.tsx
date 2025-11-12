import { Activity, Cloud, Leaf, DollarSign, GitBranch, Box, Shield, ShoppingCart, Radio, ExternalLink } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import UserProfileMenu from "@/components/UserProfileMenu";
import lenovoCloudIcon from "@/assets/lenovo-cloud-icon.png";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
              <Cloud className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <div>
                <h1 className="text-xl font-bold text-foreground">XClarity One 2.0</h1>
                <p className="text-xs text-muted-foreground">Intelligent Hybrid Cloud Platform</p>
              </div>
              <button
                onClick={() => navigate('/marketing')}
                className="w-8 h-8 rounded hover:bg-muted/50 transition-colors flex items-center justify-center group"
                title="View Marketing Page"
              >
                <img 
                  src={lenovoCloudIcon} 
                  alt="Lenovo Cloud" 
                  className="w-6 h-6 opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <a 
                href="/" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive('/') ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
              >
                <Activity className="w-4 h-4" />
                Dashboard
              </a>
              <a 
                href="/finops" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive('/finops') ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                FinOps
              </a>
              <a 
                href="/greenops" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive('/greenops') ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
              >
                <Leaf className="w-4 h-4" />
                GreenOps
              </a>
              <a 
                href="/digital-twin" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive('/digital-twin') ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
              >
                <Box className="w-4 h-4" />
                Digital Twin
              </a>
              <a 
                href="/integrations" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive('/integrations') ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
              >
                <GitBranch className="w-4 h-4" />
                Integrations
              </a>
              <a 
                href="/compliance" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive('/compliance') ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
              >
                <Shield className="w-4 h-4" />
                Compliance
              </a>
              <a 
                href="/marketplace" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive('/marketplace') ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                Marketplace
              </a>
              <a 
                href="/edge-management" 
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                  isActive('/edge-management') ? 'text-primary' : 'text-foreground hover:text-primary'
                }`}
              >
                <Radio className="w-4 h-4" />
                Edge & 5G
              </a>
            </nav>
            
            <UserProfileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
