import { useState } from 'react';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Shield, FileText, AlertTriangle, CheckCircle2, Download, 
  Play, Settings, MapPin, Clock, TrendingUp, Database, Plus
} from 'lucide-react';
import { toast } from 'sonner';

const Compliance = () => {
  const [complianceScore] = useState(87);
  
  const policyTemplates = [
    {
      id: '1',
      name: 'GDPR Data Protection',
      framework: 'GDPR',
      description: 'EU General Data Protection Regulation compliance',
      controls: 42,
      status: 'deployed',
      coverage: 94
    },
    {
      id: '2',
      name: 'HIPAA Healthcare',
      framework: 'HIPAA',
      description: 'Health Insurance Portability and Accountability Act',
      controls: 38,
      status: 'deployed',
      coverage: 89
    },
    {
      id: '3',
      name: 'NIST Cybersecurity Framework',
      framework: 'NIST',
      description: 'National Institute of Standards and Technology',
      controls: 108,
      status: 'draft',
      coverage: 65
    },
    {
      id: '4',
      name: 'SOC 2 Type II',
      framework: 'SOC 2',
      description: 'Service Organization Control 2',
      controls: 64,
      status: 'deployed',
      coverage: 91
    },
    {
      id: '5',
      name: 'ISO 27001',
      framework: 'ISO',
      description: 'Information Security Management',
      controls: 114,
      status: 'pending',
      coverage: 0
    }
  ];

  const driftAlerts = [
    {
      id: '1',
      resource: 'S3 Bucket: customer-data-prod',
      policy: 'GDPR Data Protection',
      drift: 'Encryption at rest disabled',
      severity: 'critical',
      detectedAt: '2 minutes ago',
      remediation: 'Enable AES-256 encryption on S3 bucket',
      autoFixAvailable: true
    },
    {
      id: '2',
      resource: 'EC2 Instance: web-server-03',
      policy: 'NIST Cybersecurity',
      drift: 'Security group allows unrestricted SSH access',
      severity: 'high',
      detectedAt: '15 minutes ago',
      remediation: 'Restrict SSH access to corporate IP ranges only',
      autoFixAvailable: true
    },
    {
      id: '3',
      resource: 'RDS Database: patient-records',
      policy: 'HIPAA Healthcare',
      drift: 'Audit logging not enabled',
      severity: 'high',
      detectedAt: '45 minutes ago',
      remediation: 'Enable CloudWatch Logs for RDS audit events',
      autoFixAvailable: false
    }
  ];

  const regionalCompliance = [
    { region: 'US-East-1', score: 92, services: 45, issues: 3 },
    { region: 'EU-West-1', score: 88, services: 38, issues: 5 },
    { region: 'AP-Southeast-1', score: 85, services: 32, issues: 7 },
    { region: 'US-West-2', score: 90, services: 41, issues: 4 }
  ];

  const handleDeployPolicy = (policyId: string) => {
    const policy = policyTemplates.find(p => p.id === policyId);
    toast.info(`Deploying ${policy?.name}...`, {
      description: 'Applying policy controls across infrastructure'
    });

    setTimeout(() => {
      toast.success('Policy deployed successfully', {
        description: `${policy?.controls} controls are now active`
      });
    }, 2000);
  };

  const handleAutoRemediate = (alertId: string) => {
    const alert = driftAlerts.find(a => a.id === alertId);
    toast.info('Applying auto-remediation...', {
      description: alert?.remediation
    });

    setTimeout(() => {
      toast.success('Remediation applied', {
        description: 'Resource is now compliant with policy'
      });
    }, 1500);
  };

  const handleExportReport = () => {
    toast.info('Generating compliance report...', {
      description: 'Preparing PDF export'
    });

    setTimeout(() => {
      toast.success('Report generated', {
        description: 'Compliance scorecard downloaded successfully'
      });
    }, 1000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 75) return 'text-primary';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getProgressColor = (score: number) => {
    if (score >= 90) return 'bg-success';
    if (score >= 75) return 'bg-primary';
    if (score >= 60) return 'bg-warning';
    return 'bg-destructive';
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Critical</Badge>;
      case 'high':
        return <Badge className="bg-warning/10 text-warning border-warning/20">High</Badge>;
      case 'medium':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Medium</Badge>;
      default:
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'deployed':
        return <Badge className="bg-success/10 text-success border-success/20">Deployed</Badge>;
      case 'draft':
        return <Badge className="bg-warning/10 text-warning border-warning/20">Draft</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Unified Policy & Compliance Hub</h2>
          <p className="text-muted-foreground">Simplify global governance across hybrid clouds</p>
        </div>

        {/* Compliance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4 bg-card border-border col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs text-muted-foreground">Overall Compliance Score</p>
                <p className={`text-4xl font-bold ${getScoreColor(complianceScore)}`}>{complianceScore}%</p>
              </div>
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <div className="relative">
              <Progress value={complianceScore} className="h-3" />
              <div 
                className={`absolute inset-0 h-3 rounded-full ${getProgressColor(complianceScore)}`}
                style={{ width: `${complianceScore}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">Last updated: Today at 6:00 AM</p>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Active Policies</p>
                <p className="text-2xl font-bold text-foreground">
                  {policyTemplates.filter(p => p.status === 'deployed').length}
                </p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </Card>

          <Card className="p-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Drift Alerts</p>
                <p className="text-2xl font-bold text-warning">{driftAlerts.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-warning" />
            </div>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="policies" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="policies">Policy Templates</TabsTrigger>
            <TabsTrigger value="drift">Drift Detection</TabsTrigger>
            <TabsTrigger value="scorecard">Compliance Scorecard</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
          </TabsList>

          {/* Policy Templates */}
          <TabsContent value="policies" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Policy-as-Code Templates</h3>
              <Button>
                <Plus className="h-4 w-4 mr-1" />
                Create Custom Policy
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {policyTemplates.map((policy) => (
                <Card key={policy.id} className="bg-card/50 border-border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-base">{policy.name}</CardTitle>
                        <CardDescription className="text-xs mt-1">{policy.description}</CardDescription>
                      </div>
                      {getStatusBadge(policy.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Framework:</span>
                        <p className="font-semibold text-foreground">{policy.framework}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Controls:</span>
                        <p className="font-semibold text-foreground">{policy.controls}</p>
                      </div>
                    </div>

                    {policy.status === 'deployed' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Coverage</span>
                          <span className="font-mono">{policy.coverage}%</span>
                        </div>
                        <div className="relative">
                          <Progress value={policy.coverage} className="h-2" />
                          <div 
                            className={`absolute inset-0 h-2 rounded-full ${getProgressColor(policy.coverage)}`}
                            style={{ width: `${policy.coverage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2 pt-2 border-t border-border">
                      {policy.status !== 'deployed' && (
                        <Button
                          size="sm"
                          onClick={() => handleDeployPolicy(policy.id)}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          Deploy Policy
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <Settings className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      {policy.status === 'deployed' && (
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Drift Detection */}
          <TabsContent value="drift" className="space-y-4">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold text-foreground mb-1">AI-Based Drift Detection Active</div>
                  <p className="text-sm text-muted-foreground">
                    Continuously monitoring infrastructure for policy violations. 
                    Alerts appear within 1 minute of detection with automated remediation steps.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {driftAlerts.map((alert) => (
                <Card key={alert.id} className="bg-card/50 border-border">
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getSeverityBadge(alert.severity)}
                          <span className="text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {alert.detectedAt}
                          </span>
                        </div>
                        <h4 className="font-semibold text-foreground mb-1">{alert.resource}</h4>
                        <p className="text-sm text-muted-foreground mb-2">Policy: {alert.policy}</p>
                      </div>
                    </div>

                    <div className="p-3 rounded-lg bg-destructive/5 border border-destructive/20">
                      <div className="text-xs font-semibold text-destructive mb-1">Drift Detected:</div>
                      <p className="text-sm text-foreground">{alert.drift}</p>
                    </div>

                    <div className="p-3 rounded-lg bg-success/5 border border-success/20">
                      <div className="text-xs font-semibold text-success mb-1">Remediation Steps:</div>
                      <p className="text-sm text-foreground">{alert.remediation}</p>
                    </div>

                    <div className="flex gap-2 pt-2 border-t border-border">
                      {alert.autoFixAvailable && (
                        <Button
                          size="sm"
                          onClick={() => handleAutoRemediate(alert.id)}
                        >
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Auto-Remediate
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      <Button size="sm" variant="ghost">
                        Dismiss
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Compliance Scorecard */}
          <TabsContent value="scorecard" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Regional Compliance Scorecard</h3>
              <Button onClick={handleExportReport}>
                <Download className="h-4 w-4 mr-1" />
                Export Report
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regionalCompliance.map((region) => (
                <Card key={region.region} className="bg-card/50 border-border">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-primary" />
                        <CardTitle className="text-base">{region.region}</CardTitle>
                      </div>
                      <span className={`text-2xl font-bold ${getScoreColor(region.score)}`}>
                        {region.score}%
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <Progress value={region.score} className="h-3" />
                      <div 
                        className={`absolute inset-0 h-3 rounded-full ${getProgressColor(region.score)}`}
                        style={{ width: `${region.score}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="text-muted-foreground">Services Monitored:</span>
                        <p className="font-semibold text-foreground">{region.services}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Open Issues:</span>
                        <p className="font-semibold text-warning">{region.issues}</p>
                      </div>
                    </div>

                    <Button size="sm" variant="outline" className="w-full">
                      View Regional Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-card/50 border-border mt-6">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Compliance Trend (Last 30 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Database className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Compliance trend chart visualization</p>
                    <p className="text-xs">Daily scorecard updates with historical comparison</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations */}
          <TabsContent value="integrations" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="text-base">ServiceNow</CardTitle>
                  <CardDescription>Incident & change management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Badge className="bg-success/10 text-success border-success/20">Connected</Badge>
                  <p className="text-xs text-muted-foreground">
                    Automatically sync compliance violations and create incidents
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Configure
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="text-base">Terraform Cloud</CardTitle>
                  <CardDescription>Infrastructure as Code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Badge className="bg-success/10 text-success border-success/20">Connected</Badge>
                  <p className="text-xs text-muted-foreground">
                    Policy-as-code validation in Terraform runs
                  </p>
                  <Button size="sm" variant="outline" className="w-full">
                    Configure
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/50 border-border">
                <CardHeader>
                  <CardTitle className="text-base">Azure Arc</CardTitle>
                  <CardDescription>Hybrid cloud management</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Badge variant="outline">Not Connected</Badge>
                  <p className="text-xs text-muted-foreground">
                    Extend compliance policies to on-premises resources
                  </p>
                  <Button size="sm" className="w-full">
                    Connect
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Compliance;
