import { Activity, Cloud, Leaf, DollarSign, Brain, GitBranch } from "lucide-react";
import { useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded flex items-center justify-center">
              <Cloud className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">XClarity One 2.0</h1>
              <p className="text-xs text-muted-foreground">Intelligent Hybrid Cloud Platform</p>
            </div>
          </div>
          
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
              href="/integrations" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isActive('/integrations') ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              Integrations
            </a>
            <a 
              href="/ai-models" 
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isActive('/ai-models') ? 'text-primary' : 'text-foreground hover:text-primary'
              }`}
            >
              <Brain className="w-4 h-4" />
              AI Models
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
