import { Activity, Cloud, Leaf, DollarSign } from "lucide-react";

const Header = () => {
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
            <a href="#aiops" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
              <Activity className="w-4 h-4" />
              AIOps
            </a>
            <a href="#finops" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
              <DollarSign className="w-4 h-4" />
              FinOps
            </a>
            <a href="#greenops" className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors">
              <Leaf className="w-4 h-4" />
              GreenOps
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
