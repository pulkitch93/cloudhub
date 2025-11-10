import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Star, TrendingUp, Zap, DollarSign, Shield, 
  Cpu, Database, Cloud, Network, CheckCircle2, ArrowRight,
  Sparkles, Award, Filter, X, GitCompare
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import DeploymentTracker from '@/components/DeploymentTracker';

interface Solution {
  id: string;
  name: string;
  vendor: string;
  category: string;
  description: string;
  price: string;
  rating: number;
  deployments: number;
  icon: string;
  features: string[];
  compatibility: string[];
  deploymentTime: string;
  revenueShare: number;
}

const Marketplace = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deployedSolutions, setDeployedSolutions] = useLocalStorage<string[]>('deployed-solutions', []);
  const [usageTelemetry, setUsageTelemetry] = useLocalStorage<any[]>('marketplace-telemetry', []);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [showComparisonDialog, setShowComparisonDialog] = useState(false);
  const [deployingSolution, setDeployingSolution] = useState<Solution | null>(null);

  const solutions: Solution[] = [
    {
      id: '1',
      name: 'ThinkSystem SR650 V3',
      vendor: 'Lenovo',
      category: 'compute',
      description: 'High-performance 2-socket rack server optimized for AI and analytics workloads',
      price: 'Starting at $8,500/month',
      rating: 4.8,
      deployments: 342,
      icon: 'Cpu',
      features: ['Intel Xeon Scalable processors', 'Up to 8TB DDR5 memory', 'NVIDIA GPU support', '24/7 support'],
      compatibility: ['VMware vSphere', 'Nutanix AHV', 'Azure Arc'],
      deploymentTime: '2-4 hours',
      revenueShare: 15
    },
    {
      id: '2',
      name: 'vSphere Enterprise Plus',
      vendor: 'VMware',
      category: 'virtualization',
      description: 'Complete virtualization platform with advanced management and automation',
      price: '$4,995/processor/year',
      rating: 4.9,
      deployments: 1250,
      icon: 'Cloud',
      features: ['Distributed resource scheduler', 'vMotion live migration', 'High availability', 'Fault tolerance'],
      compatibility: ['Lenovo ThinkSystem', 'Nutanix', 'Dell EMC'],
      deploymentTime: '1-2 hours',
      revenueShare: 20
    },
    {
      id: '3',
      name: 'Nutanix Enterprise Cloud',
      vendor: 'Nutanix',
      category: 'hyperconverged',
      description: 'Hyperconverged infrastructure for simplified datacenter operations',
      price: 'Starting at $15,000/node',
      rating: 4.7,
      deployments: 890,
      icon: 'Database',
      features: ['One-click upgrades', 'Built-in DR', 'Multi-cloud ready', 'Self-healing'],
      compatibility: ['Lenovo servers', 'VMware', 'Azure Stack'],
      deploymentTime: '3-6 hours',
      revenueShare: 18
    },
    {
      id: '4',
      name: 'NVIDIA AI Enterprise',
      vendor: 'NVIDIA',
      category: 'ai-ml',
      description: 'End-to-end AI software suite for production ML and AI deployment',
      price: '$4,500/GPU/year',
      rating: 4.9,
      deployments: 567,
      icon: 'Sparkles',
      features: ['RAPIDS acceleration', 'TensorRT optimization', 'Triton inference', 'MLOps tools'],
      compatibility: ['VMware vSphere', 'Kubernetes', 'Lenovo servers'],
      deploymentTime: '2-3 hours',
      revenueShare: 22
    },
    {
      id: '5',
      name: 'ThinkAgile VX Series',
      vendor: 'Lenovo',
      category: 'hyperconverged',
      description: 'Certified VMware vSAN Ready Nodes for rapid deployment',
      price: 'Starting at $12,000/node',
      rating: 4.6,
      deployments: 445,
      icon: 'Database',
      features: ['Pre-configured vSAN', 'Factory integration', 'Single SKU ordering', 'Lenovo support'],
      compatibility: ['VMware vSphere', 'vRealize Suite'],
      deploymentTime: '1-3 hours',
      revenueShare: 16
    },
    {
      id: '6',
      name: 'VMware NSX Data Center',
      vendor: 'VMware',
      category: 'networking',
      description: 'Network virtualization and security platform for modern applications',
      price: '$4,745/processor/year',
      rating: 4.8,
      deployments: 678,
      icon: 'Network',
      features: ['Micro-segmentation', 'Load balancing', 'Distributed firewall', 'VPN services'],
      compatibility: ['vSphere', 'Kubernetes', 'Public clouds'],
      deploymentTime: '2-4 hours',
      revenueShare: 20
    },
    {
      id: '7',
      name: 'Nutanix Kubernetes Platform',
      vendor: 'Nutanix',
      category: 'containers',
      description: 'Enterprise Kubernetes platform with simplified operations',
      price: 'Starting at $3,000/cluster/month',
      rating: 4.7,
      deployments: 334,
      icon: 'Cloud',
      features: ['One-click deployment', 'Auto-scaling', 'Integrated monitoring', 'Multi-cluster management'],
      compatibility: ['Nutanix AHV', 'VMware', 'Bare metal'],
      deploymentTime: '1-2 hours',
      revenueShare: 18
    },
    {
      id: '8',
      name: 'NVIDIA DGX A100',
      vendor: 'NVIDIA',
      category: 'ai-ml',
      description: 'Universal system for AI infrastructure and workloads',
      price: 'Starting at $199,000',
      rating: 5.0,
      deployments: 156,
      icon: 'Cpu',
      features: ['8x A100 GPUs', '5 petaFLOPS AI performance', 'NVIDIA AI software', 'Professional support'],
      compatibility: ['VMware vSphere', 'Kubernetes', 'NVIDIA Base Command'],
      deploymentTime: '4-8 hours',
      revenueShare: 25
    },
    {
      id: '9',
      name: 'ThinkSystem SD650 V3',
      vendor: 'Lenovo',
      category: 'compute',
      description: 'Neptune liquid-cooled server for extreme density and efficiency',
      price: 'Starting at $15,000/node',
      rating: 4.9,
      deployments: 223,
      icon: 'Cpu',
      features: ['Direct liquid cooling', '40% energy savings', 'Dense 2U design', 'Silent operation'],
      compatibility: ['VMware', 'Kubernetes', 'HPC workloads'],
      deploymentTime: '3-6 hours',
      revenueShare: 17
    },
    {
      id: '10',
      name: 'VMware Cloud Foundation',
      vendor: 'VMware',
      category: 'platform',
      description: 'Integrated cloud infrastructure for hybrid and multi-cloud',
      price: 'Starting at $25,000/month',
      rating: 4.8,
      deployments: 512,
      icon: 'Cloud',
      features: ['Full-stack automation', 'Lifecycle management', 'Unified operations', 'Security & compliance'],
      compatibility: ['Lenovo servers', 'Dell EMC', 'Public clouds'],
      deploymentTime: '6-12 hours',
      revenueShare: 21
    },
    {
      id: '11',
      name: 'Nutanix Files',
      vendor: 'Nutanix',
      category: 'storage',
      description: 'Software-defined file storage with enterprise features',
      price: 'Starting at $2,500/TB/year',
      rating: 4.6,
      deployments: 401,
      icon: 'Database',
      features: ['Multi-protocol support', 'Ransomware protection', 'Global deduplication', 'Cloud tiering'],
      compatibility: ['Nutanix AHV', 'VMware', 'Physical servers'],
      deploymentTime: '1-2 hours',
      revenueShare: 17
    },
    {
      id: '12',
      name: 'NVIDIA Networking',
      vendor: 'NVIDIA',
      category: 'networking',
      description: 'High-performance networking for AI and HPC workloads',
      price: 'Starting at $8,000/switch',
      rating: 4.7,
      deployments: 289,
      icon: 'Network',
      features: ['400Gb Ethernet', 'InfiniBand support', 'AI-optimized', 'RDMA over converged ethernet'],
      compatibility: ['NVIDIA DGX', 'Lenovo servers', 'Generic x86'],
      deploymentTime: '2-4 hours',
      revenueShare: 19
    }
  ];

  const categories = [
    { id: 'all', name: 'All Solutions', icon: Star },
    { id: 'compute', name: 'Compute', icon: Cpu },
    { id: 'virtualization', name: 'Virtualization', icon: Cloud },
    { id: 'hyperconverged', name: 'Hyperconverged', icon: Database },
    { id: 'ai-ml', name: 'AI & ML', icon: Sparkles },
    { id: 'networking', name: 'Networking', icon: Network },
    { id: 'storage', name: 'Storage', icon: Database },
    { id: 'containers', name: 'Containers', icon: Cloud },
    { id: 'platform', name: 'Platform', icon: Cloud }
  ];

  // Generate recommendations based on deployed solutions and telemetry
  const getRecommendations = (): Solution[] => {
    const recommendedIds = new Set<string>();
    
    // Rule-based recommendations
    deployedSolutions.forEach(deployedId => {
      const deployed = solutions.find(s => s.id === deployedId);
      if (!deployed) return;

      // Recommend complementary solutions
      if (deployed.vendor === 'Lenovo' && deployed.category === 'compute') {
        // Recommend VMware for virtualization
        const vmware = solutions.find(s => s.vendor === 'VMware' && s.category === 'virtualization');
        if (vmware && !deployedSolutions.includes(vmware.id)) recommendedIds.add(vmware.id);
      }
      
      if (deployed.vendor === 'VMware') {
        // Recommend Nutanix or Lenovo
        const nutanix = solutions.find(s => s.vendor === 'Nutanix');
        if (nutanix && !deployedSolutions.includes(nutanix.id)) recommendedIds.add(nutanix.id);
      }

      if (deployed.category === 'ai-ml') {
        // Recommend NVIDIA if not deployed
        const nvidia = solutions.find(s => s.vendor === 'NVIDIA' && !deployedSolutions.includes(s.id));
        if (nvidia) recommendedIds.add(nvidia.id);
      }
    });

    // Add popular solutions if no recommendations yet
    if (recommendedIds.size < 3) {
      solutions
        .filter(s => !deployedSolutions.includes(s.id))
        .sort((a, b) => b.deployments - a.deployments)
        .slice(0, 3)
        .forEach(s => recommendedIds.add(s.id));
    }

    return solutions.filter(s => recommendedIds.has(s.id)).slice(0, 3);
  };

  const filteredSolutions = solutions.filter(solution => {
    const matchesSearch = solution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         solution.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         solution.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || solution.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeploy = (solutionId: string) => {
    const solution = solutions.find(s => s.id === solutionId);
    if (!solution) return;

    // Track telemetry
    const telemetry = {
      solutionId,
      action: 'deploy',
      timestamp: new Date().toISOString(),
      vendor: solution.vendor,
      category: solution.category
    };
    setUsageTelemetry(prev => [...prev, telemetry]);

    // Open deployment tracker
    setDeployingSolution(solution);
  };

  const handleDeploymentComplete = () => {
    if (!deployingSolution) return;

    setDeployedSolutions(prev => [...prev, deployingSolution.id]);
    toast.success('Solution deployed successfully!', {
      description: `${deployingSolution.name} is now active in your environment`
    });
    
    // Close tracker after a brief delay
    setTimeout(() => {
      setDeployingSolution(null);
    }, 500);
  };

  const handleViewDetails = (solutionId: string) => {
    const telemetry = {
      solutionId,
      action: 'view',
      timestamp: new Date().toISOString()
    };
    setUsageTelemetry(prev => [...prev, telemetry]);
  };

  const getVendorColor = (vendor: string) => {
    switch (vendor) {
      case 'Lenovo': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'VMware': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'Nutanix': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'NVIDIA': return 'bg-green-500/10 text-green-500 border-green-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const recommendations = getRecommendations();

  const toggleComparison = (solutionId: string) => {
    setSelectedForComparison(prev => 
      prev.includes(solutionId)
        ? prev.filter(id => id !== solutionId)
        : [...prev, solutionId]
    );
  };

  const clearComparison = () => {
    setSelectedForComparison([]);
    setShowComparisonDialog(false);
  };

  const comparedSolutions = solutions.filter(s => selectedForComparison.includes(s.id));

  return (
    <div className="min-h-screen bg-background pb-24">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Hybrid Cloud Marketplace</h2>
          <p className="text-muted-foreground">Discover and deploy partner solutions for your hybrid infrastructure</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Available Solutions</p>
                <p className="text-2xl font-bold text-foreground">{solutions.length}</p>
              </div>
              <Star className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Your Deployments</p>
                <p className="text-2xl font-bold text-success">{deployedSolutions.length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Partner Vendors</p>
                <p className="text-2xl font-bold text-foreground">4</p>
              </div>
              <Award className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Avg. Revenue Share</p>
                <p className="text-2xl font-bold text-foreground">19%</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </Card>
        </div>

        {/* Recommended Solutions */}
        {recommendations.length > 0 && (
          <Card className="mb-8 bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recommended for You
              </CardTitle>
              <CardDescription>
                Based on your deployed solutions and usage patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {recommendations.map(solution => (
                  <Card key={solution.id} className="bg-card/80 border-border">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <Badge className={getVendorColor(solution.vendor)}>{solution.vendor}</Badge>
                        <div className="flex items-center gap-1 text-sm">
                          <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                          <span className="font-semibold">{solution.rating}</span>
                        </div>
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">{solution.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{solution.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-primary">{solution.price}</span>
                        <Button size="sm" onClick={() => handleDeploy(solution.id)}>
                          <Zap className="h-3 w-3 mr-1" />
                          Deploy
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search solutions, vendors, or categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="whitespace-nowrap"
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {category.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Solutions Grid */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Solutions ({filteredSolutions.length})</TabsTrigger>
            <TabsTrigger value="lenovo">Lenovo</TabsTrigger>
            <TabsTrigger value="vmware">VMware</TabsTrigger>
            <TabsTrigger value="nutanix">Nutanix</TabsTrigger>
            <TabsTrigger value="nvidia">NVIDIA</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSolutions.map(solution => (
                <Card key={solution.id} className="bg-card border-border hover:border-primary/50 transition-colors relative">
                  <div className="absolute top-3 left-3 z-10">
                    <Checkbox
                      checked={selectedForComparison.includes(solution.id)}
                      onCheckedChange={() => toggleComparison(solution.id)}
                      className="bg-background border-2"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2 ml-8">
                      <Badge className={getVendorColor(solution.vendor)}>{solution.vendor}</Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                        <span className="text-sm font-semibold">{solution.rating}</span>
                      </div>
                    </div>
                    <CardTitle className="text-base">{solution.name}</CardTitle>
                    <CardDescription className="text-xs">{solution.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Price: </span>
                        <span className="font-semibold text-foreground">{solution.price}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{solution.deployments} deployments</span>
                        <span>•</span>
                        <span>{solution.deploymentTime}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-foreground">Key Features:</p>
                      <ul className="space-y-1">
                        {solution.features.slice(0, 3).map((feature, idx) => (
                          <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                            <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-3 border-t border-border space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Revenue Share:</span>
                        <Badge variant="outline" className="text-success border-success/20">
                          {solution.revenueShare}%
                        </Badge>
                      </div>
                      
                      {deployedSolutions.includes(solution.id) ? (
                        <Button className="w-full" variant="outline" disabled>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Deployed
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleViewDetails(solution.id)}
                          >
                            Details
                          </Button>
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleDeploy(solution.id)}
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            Deploy
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {['lenovo', 'vmware', 'nutanix', 'nvidia'].map(vendor => (
            <TabsContent key={vendor} value={vendor} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {solutions
                  .filter(s => s.vendor.toLowerCase() === vendor)
                  .map(solution => (
                    <Card key={solution.id} className="bg-card border-border hover:border-primary/50 transition-colors relative">
                      <div className="absolute top-3 left-3 z-10">
                        <Checkbox
                          checked={selectedForComparison.includes(solution.id)}
                          onCheckedChange={() => toggleComparison(solution.id)}
                          className="bg-background border-2"
                        />
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between mb-2 ml-8">
                          <Badge className={getVendorColor(solution.vendor)}>{solution.vendor}</Badge>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                            <span className="text-sm font-semibold">{solution.rating}</span>
                          </div>
                        </div>
                        <CardTitle className="text-base">{solution.name}</CardTitle>
                        <CardDescription className="text-xs">{solution.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="text-sm">
                            <span className="text-muted-foreground">Price: </span>
                            <span className="font-semibold text-foreground">{solution.price}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{solution.deployments} deployments</span>
                            <span>•</span>
                            <span>{solution.deploymentTime}</span>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-xs font-semibold text-foreground">Key Features:</p>
                          <ul className="space-y-1">
                            {solution.features.slice(0, 3).map((feature, idx) => (
                              <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0 mt-0.5" />
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-3 border-t border-border space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Revenue Share:</span>
                            <Badge variant="outline" className="text-success border-success/20">
                              {solution.revenueShare}%
                            </Badge>
                          </div>
                          
                          {deployedSolutions.includes(solution.id) ? (
                            <Button className="w-full" variant="outline" disabled>
                              <CheckCircle2 className="h-4 w-4 mr-2" />
                              Deployed
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleViewDetails(solution.id)}
                              >
                                Details
                              </Button>
                              <Button 
                                size="sm" 
                                className="flex-1"
                                onClick={() => handleDeploy(solution.id)}
                              >
                                <Zap className="h-3 w-3 mr-1" />
                                Deploy
                              </Button>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>

      {/* Comparison Bar */}
      {selectedForComparison.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <GitCompare className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-semibold text-foreground">
                    {selectedForComparison.length} solution{selectedForComparison.length !== 1 ? 's' : ''} selected
                  </p>
                  <p className="text-xs text-muted-foreground">Select 2-4 solutions to compare</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={clearComparison}>
                  <X className="h-4 w-4 mr-1" />
                  Clear
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setShowComparisonDialog(true)}
                  disabled={selectedForComparison.length < 2}
                >
                  Compare Solutions
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comparison Dialog */}
      <Dialog open={showComparisonDialog} onOpenChange={setShowComparisonDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              Solution Comparison
            </DialogTitle>
            <DialogDescription>
              Compare features, pricing, compatibility, and performance across selected solutions
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6">
            {/* Solution Headers */}
            <div className="grid gap-4 mb-6" style={{ gridTemplateColumns: `200px repeat(${comparedSolutions.length}, 1fr)` }}>
              <div></div>
              {comparedSolutions.map(solution => (
                <Card key={solution.id} className="bg-card border-border">
                  <CardContent className="pt-6 text-center">
                    <Badge className={`${getVendorColor(solution.vendor)} mb-2`}>
                      {solution.vendor}
                    </Badge>
                    <h3 className="font-semibold text-foreground mb-1">{solution.name}</h3>
                    <div className="flex items-center justify-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-semibold">{solution.rating}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pricing */}
            <div className="grid gap-4 mb-4 items-start" style={{ gridTemplateColumns: `200px repeat(${comparedSolutions.length}, 1fr)` }}>
              <div className="font-semibold text-foreground py-3">Pricing</div>
              {comparedSolutions.map(solution => (
                <Card key={solution.id} className="bg-card/50 border-border">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-sm font-semibold text-primary">{solution.price}</p>
                    <p className="text-xs text-muted-foreground mt-1">{solution.revenueShare}% revenue share</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Deployment Time */}
            <div className="grid gap-4 mb-4 items-start" style={{ gridTemplateColumns: `200px repeat(${comparedSolutions.length}, 1fr)` }}>
              <div className="font-semibold text-foreground py-3">Deployment Time</div>
              {comparedSolutions.map(solution => (
                <Card key={solution.id} className="bg-card/50 border-border">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-sm text-foreground">{solution.deploymentTime}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Performance */}
            <div className="grid gap-4 mb-4 items-start" style={{ gridTemplateColumns: `200px repeat(${comparedSolutions.length}, 1fr)` }}>
              <div className="font-semibold text-foreground py-3">Deployments</div>
              {comparedSolutions.map(solution => (
                <Card key={solution.id} className="bg-card/50 border-border">
                  <CardContent className="pt-4 pb-4">
                    <p className="text-sm text-foreground">{solution.deployments.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">total deployments</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Features */}
            <div className="grid gap-4 mb-4 items-start" style={{ gridTemplateColumns: `200px repeat(${comparedSolutions.length}, 1fr)` }}>
              <div className="font-semibold text-foreground py-3">Key Features</div>
              {comparedSolutions.map(solution => (
                <Card key={solution.id} className="bg-card/50 border-border">
                  <CardContent className="pt-4 pb-4">
                    <ul className="space-y-2">
                      {solution.features.map((feature, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                          <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0 mt-0.5" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Compatibility */}
            <div className="grid gap-4 mb-4 items-start" style={{ gridTemplateColumns: `200px repeat(${comparedSolutions.length}, 1fr)` }}>
              <div className="font-semibold text-foreground py-3">Compatibility</div>
              {comparedSolutions.map(solution => (
                <Card key={solution.id} className="bg-card/50 border-border">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex flex-wrap gap-1">
                      {solution.compatibility.map((compat, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {compat}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="grid gap-4 mt-6" style={{ gridTemplateColumns: `200px repeat(${comparedSolutions.length}, 1fr)` }}>
              <div></div>
              {comparedSolutions.map(solution => (
                <div key={solution.id}>
                  {deployedSolutions.includes(solution.id) ? (
                    <Button className="w-full" variant="outline" disabled>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Deployed
                    </Button>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => {
                        handleDeploy(solution.id);
                        setShowComparisonDialog(false);
                      }}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      Deploy
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Deployment Tracker */}
      {deployingSolution && (
        <DeploymentTracker
          isOpen={!!deployingSolution}
          onClose={() => setDeployingSolution(null)}
          solutionName={deployingSolution.name}
          solutionVendor={deployingSolution.vendor}
          estimatedTime={deployingSolution.deploymentTime}
          onComplete={handleDeploymentComplete}
        />
      )}
    </div>
  );
};

export default Marketplace;
