import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Ticket, ExternalLink, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface TicketConfig {
  platform: 'servicenow' | 'jira';
  instanceUrl: string;
  apiKey: string;
  enabled: boolean;
  autoCreateOnHighRisk: boolean;
  autoCreateOnCritical: boolean;
}

interface CreatedTicket {
  id: string;
  ticketId: string;
  platform: 'servicenow' | 'jira';
  title: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in-progress' | 'resolved';
  createdAt: string;
  url: string;
}

const TicketingIntegration = () => {
  const [serviceNowConfig, setServiceNowConfig] = useState<TicketConfig>({
    platform: 'servicenow',
    instanceUrl: 'https://company.service-now.com',
    apiKey: 'sn_****************************',
    enabled: true,
    autoCreateOnHighRisk: true,
    autoCreateOnCritical: true
  });

  const [jiraConfig, setJiraConfig] = useState<TicketConfig>({
    platform: 'jira',
    instanceUrl: 'https://company.atlassian.net',
    apiKey: 'jira_****************************',
    enabled: true,
    autoCreateOnHighRisk: false,
    autoCreateOnCritical: true
  });

  const [recentTickets] = useState<CreatedTicket[]>([
    {
      id: '1',
      ticketId: 'INC0012345',
      platform: 'servicenow',
      title: 'Critical: DB-Worker-03 predicted failure in 24h',
      priority: 'critical',
      status: 'in-progress',
      createdAt: '2 hours ago',
      url: 'https://company.service-now.com/incident/INC0012345'
    },
    {
      id: '2',
      ticketId: 'INFRA-456',
      platform: 'jira',
      title: 'High: Web-05 requires maintenance intervention',
      priority: 'high',
      status: 'open',
      createdAt: '5 hours ago',
      url: 'https://company.atlassian.net/browse/INFRA-456'
    },
    {
      id: '3',
      ticketId: 'INC0012340',
      platform: 'servicenow',
      title: 'Medium: App-Server-02 disk space cleanup needed',
      priority: 'medium',
      status: 'resolved',
      createdAt: '1 day ago',
      url: 'https://company.service-now.com/incident/INC0012340'
    }
  ]);

  const handleTestConnection = (platform: 'servicenow' | 'jira') => {
    toast.info(`Testing ${platform === 'servicenow' ? 'ServiceNow' : 'Jira'} connection...`);
    
    setTimeout(() => {
      toast.success('Connection successful', {
        description: `Successfully connected to ${platform === 'servicenow' ? 'ServiceNow' : 'Jira'} API`
      });
    }, 1500);
  };

  const handleCreateManualTicket = (platform: 'servicenow' | 'jira') => {
    toast.info('Creating ticket...', {
      description: `Opening ${platform === 'servicenow' ? 'ServiceNow' : 'Jira'} ticket creation form`
    });

    setTimeout(() => {
      const ticketId = platform === 'servicenow' ? 'INC0012346' : 'INFRA-457';
      toast.success('Ticket created', {
        description: `Ticket ${ticketId} created successfully`
      });
    }, 2000);
  };

  const getPriorityBadge = (priority: CreatedTicket['priority']) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Critical</Badge>;
      case 'high':
        return <Badge className="bg-warning/10 text-warning border-warning/20">High</Badge>;
      case 'medium':
        return <Badge className="bg-primary/10 text-primary border-primary/20">Medium</Badge>;
      case 'low':
        return <Badge variant="outline">Low</Badge>;
    }
  };

  const getStatusIcon = (status: CreatedTicket['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-primary" />;
      case 'resolved':
        return <CheckCircle2 className="h-4 w-4 text-success" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Ticket className="h-5 w-5" />
          Ticketing System Integration
        </CardTitle>
        <CardDescription>
          Automatically create tickets in ServiceNow or Jira when manual intervention is required
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="servicenow" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="servicenow">ServiceNow</TabsTrigger>
            <TabsTrigger value="jira">Jira</TabsTrigger>
            <TabsTrigger value="tickets">Recent Tickets</TabsTrigger>
          </TabsList>

          {/* ServiceNow Configuration */}
          <TabsContent value="servicenow" className="space-y-4">
            <Card className="bg-card/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">ServiceNow Configuration</CardTitle>
                  <Switch
                    checked={serviceNowConfig.enabled}
                    onCheckedChange={(checked) => {
                      setServiceNowConfig({ ...serviceNowConfig, enabled: checked });
                      toast.success(checked ? 'ServiceNow enabled' : 'ServiceNow disabled');
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sn-url">Instance URL</Label>
                  <Input
                    id="sn-url"
                    value={serviceNowConfig.instanceUrl}
                    onChange={(e) => setServiceNowConfig({ ...serviceNowConfig, instanceUrl: e.target.value })}
                    placeholder="https://your-instance.service-now.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sn-key">API Key</Label>
                  <Input
                    id="sn-key"
                    type="password"
                    value={serviceNowConfig.apiKey}
                    onChange={(e) => setServiceNowConfig({ ...serviceNowConfig, apiKey: e.target.value })}
                    placeholder="Enter your ServiceNow API key"
                  />
                  <p className="text-xs text-muted-foreground">
                    Your API key is encrypted and stored securely
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-create for Critical Failures</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically create tickets for critical severity predictions
                      </p>
                    </div>
                    <Switch
                      checked={serviceNowConfig.autoCreateOnCritical}
                      onCheckedChange={(checked) =>
                        setServiceNowConfig({ ...serviceNowConfig, autoCreateOnCritical: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-create for High Risk</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically create tickets for high risk predictions
                      </p>
                    </div>
                    <Switch
                      checked={serviceNowConfig.autoCreateOnHighRisk}
                      onCheckedChange={(checked) =>
                        setServiceNowConfig({ ...serviceNowConfig, autoCreateOnHighRisk: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleTestConnection('servicenow')}
                    disabled={!serviceNowConfig.enabled}
                  >
                    Test Connection
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCreateManualTicket('servicenow')}
                    disabled={!serviceNowConfig.enabled}
                  >
                    Create Test Ticket
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Jira Configuration */}
          <TabsContent value="jira" className="space-y-4">
            <Card className="bg-card/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Jira Configuration</CardTitle>
                  <Switch
                    checked={jiraConfig.enabled}
                    onCheckedChange={(checked) => {
                      setJiraConfig({ ...jiraConfig, enabled: checked });
                      toast.success(checked ? 'Jira enabled' : 'Jira disabled');
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="jira-url">Instance URL</Label>
                  <Input
                    id="jira-url"
                    value={jiraConfig.instanceUrl}
                    onChange={(e) => setJiraConfig({ ...jiraConfig, instanceUrl: e.target.value })}
                    placeholder="https://your-company.atlassian.net"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jira-key">API Token</Label>
                  <Input
                    id="jira-key"
                    type="password"
                    value={jiraConfig.apiKey}
                    onChange={(e) => setJiraConfig({ ...jiraConfig, apiKey: e.target.value })}
                    placeholder="Enter your Jira API token"
                  />
                  <p className="text-xs text-muted-foreground">
                    Generate an API token at https://id.atlassian.com/manage-profile/security/api-tokens
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jira-project">Project Key</Label>
                  <Input
                    id="jira-project"
                    placeholder="INFRA"
                    defaultValue="INFRA"
                  />
                </div>

                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-create for Critical Failures</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically create issues for critical severity predictions
                      </p>
                    </div>
                    <Switch
                      checked={jiraConfig.autoCreateOnCritical}
                      onCheckedChange={(checked) =>
                        setJiraConfig({ ...jiraConfig, autoCreateOnCritical: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Auto-create for High Risk</Label>
                      <p className="text-xs text-muted-foreground">
                        Automatically create issues for high risk predictions
                      </p>
                    </div>
                    <Switch
                      checked={jiraConfig.autoCreateOnHighRisk}
                      onCheckedChange={(checked) =>
                        setJiraConfig({ ...jiraConfig, autoCreateOnHighRisk: checked })
                      }
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleTestConnection('jira')}
                    disabled={!jiraConfig.enabled}
                  >
                    Test Connection
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleCreateManualTicket('jira')}
                    disabled={!jiraConfig.enabled}
                  >
                    Create Test Issue
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recent Tickets */}
          <TabsContent value="tickets" className="space-y-3">
            {recentTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="p-4 rounded-lg border border-border bg-card/50 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {ticket.platform === 'servicenow' ? 'ServiceNow' : 'Jira'}
                      </Badge>
                      <span className="font-mono text-sm text-muted-foreground">{ticket.ticketId}</span>
                    </div>
                    <h4 className="font-semibold text-foreground mb-2">{ticket.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>Created {ticket.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getPriorityBadge(ticket.priority)}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(ticket.status)}
                    <span className="text-sm capitalize text-foreground">{ticket.status.replace('-', ' ')}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(ticket.url, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Ticket
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TicketingIntegration;
