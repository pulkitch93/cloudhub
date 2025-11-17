import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  Cloud,
  Zap,
  Shield,
  TrendingUp,
  Globe,
  Lock,
  BarChart3,
  Cpu,
  Network,
  Database,
  Settings,
  Users,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

const Marketing = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Cloud,
      title: 'Multi-Cloud Management',
      description: 'Unified control across AWS, Azure, GCP, and IBM Cloud with intelligent workload placement',
      badge: 'Core Service',
    },
    {
      icon: Cpu,
      title: 'Infrastructure Orchestration',
      description: 'Automated provisioning and scaling with AI-driven capacity planning',
      badge: 'Featured',
    },
    {
      icon: Shield,
      title: 'Security & Compliance',
      description: 'End-to-end security with continuous compliance monitoring and automated remediation',
      badge: 'Enterprise',
    },
    {
      icon: BarChart3,
      title: 'FinOps & Cost Intelligence',
      description: 'Real-time cost tracking, optimization recommendations, and predictive budgeting',
      badge: 'Popular',
    },
    {
      icon: TrendingUp,
      title: 'GreenOps Sustainability',
      description: 'Carbon footprint tracking, renewable energy optimization, and ESG reporting',
      badge: 'New',
    },
    {
      icon: Network,
      title: 'Edge & 5G Computing',
      description: 'Low-latency edge deployments with intelligent traffic routing',
      badge: 'Advanced',
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Unified data platform with backup, disaster recovery, and data governance',
      badge: 'Core Service',
    },
    {
      icon: Settings,
      title: 'Digital Twin Technology',
      description: '3D infrastructure visualization and predictive maintenance with AR support',
      badge: 'Innovation',
    },
    {
      icon: Users,
      title: 'Multi-Tenant Platform',
      description: 'Isolated tenant environments with granular RBAC and white-label support',
      badge: 'Enterprise',
    },
  ];

  const benefits = [
    'Reduce cloud costs by up to 40% with AI-powered optimization',
    'Achieve 99.99% uptime with predictive failure analysis',
    'Cut carbon emissions by 35% with intelligent workload placement',
    'Deploy 5x faster with automated provisioning',
    'Unified visibility across all cloud providers',
    'Enterprise-grade security and compliance',
  ];

  const features = [
    {
      title: 'AI Copilot - Lena',
      description: 'Your intelligent assistant for troubleshooting, optimization, and guided remediation',
      icon: Sparkles,
    },
    {
      title: 'Real-Time Analytics',
      description: 'Live dashboards with customizable KPIs and role-based views',
      icon: BarChart3,
    },
    {
      title: 'Automated Workflows',
      description: 'One-click runbooks for common operations and incident response',
      icon: Zap,
    },
    {
      title: 'Global Infrastructure',
      description: 'Deploy across 20+ regions with intelligent geo-routing',
      icon: Globe,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Cloud className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Lenovo Hybrid Cloud</h1>
                <p className="text-xs text-muted-foreground">Next-Gen Operations Platform</p>
              </div>
            </div>
            <Button onClick={() => navigate('/')} size="lg" className="gap-2">
              Launch TruScale 2.0
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLXdpZHRoPSIxIiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
        
        <div className="container mx-auto px-6 py-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6" variant="outline">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by AI & Automation
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              The Future of Hybrid Cloud Operations
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Transform your infrastructure with Lenovo's next-generation platform. 
              Unify operations, optimize costs, and accelerate innovation across any cloud.
            </p>

            <div className="flex gap-4 justify-center mb-12">
              <Button onClick={() => navigate('/')} size="lg" className="gap-2">
                Get Started with TruScale 2.0
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button onClick={() => navigate('/')} variant="outline" size="lg">
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">99.99%</div>
                <div className="text-sm text-muted-foreground">Platform Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">40%</div>
                <div className="text-sm text-muted-foreground">Cost Reduction</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">5x</div>
                <div className="text-sm text-muted-foreground">Faster Deployment</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">247</div>
                <div className="text-sm text-muted-foreground">Active Tenants</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4">Complete Platform</Badge>
            <h2 className="text-4xl font-bold mb-4">Comprehensive Cloud Services</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need to build, deploy, and manage your hybrid cloud infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, idx) => (
              <Card key={idx} className="hover:border-primary/50 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <service.icon className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="outline">{service.badge}</Badge>
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4">Key Capabilities</Badge>
            <h2 className="text-4xl font-bold mb-4">Built for Modern Operations</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              AI-powered automation and intelligent insights at every layer
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="text-center hover:border-primary/50 transition-all">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">Why Choose Lenovo</Badge>
              <h2 className="text-4xl font-bold mb-6">
                Transform Your Infrastructure, Accelerate Innovation
              </h2>
              <p className="text-muted-foreground mb-8">
                Lenovo Hybrid Cloud Platform delivers enterprise-grade capabilities with the agility 
                and efficiency modern businesses demand. From startups to Fortune 500 companies, 
                we power mission-critical workloads at scale.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-sm">{benefit}</p>
                  </div>
                ))}
              </div>

              <Button onClick={() => navigate('/')} size="lg" className="mt-8 gap-2">
                Start Your Journey
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl blur-3xl" />
              <Card className="relative bg-card/50 backdrop-blur-sm border-primary/20">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Enterprise Security</h4>
                        <p className="text-sm text-muted-foreground">SOC 2, ISO 27001, HIPAA compliant</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                        <Globe className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Global Reach</h4>
                        <p className="text-sm text-muted-foreground">20+ regions, 99.99% SLA guarantee</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-warning" />
                      </div>
                      <div>
                        <h4 className="font-semibold">AI-Powered</h4>
                        <p className="text-sm text-muted-foreground">Lena AI copilot for guided operations</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
        <div className="container mx-auto px-6 relative">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-6">Ready to Get Started?</Badge>
            <h2 className="text-4xl font-bold mb-6">
              Experience TruScale 2.0 Today
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of organizations transforming their cloud operations with Lenovo's 
              next-generation platform. Start your free trial or schedule a personalized demo.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/')} size="lg" className="gap-2">
                Launch Platform
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="lg">
                Schedule Demo
              </Button>
              <Button variant="outline" size="lg">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => navigate('/')} className="hover:text-foreground transition-colors">TruScale 2.0</button></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">FinOps</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">GreenOps</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Edge Computing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Digital Twin</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Customers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Partners</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2025 Lenovo. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Security</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Marketing;
