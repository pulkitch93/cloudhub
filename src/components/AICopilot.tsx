import { useState, useEffect } from "react";
import { MessageSquare, Send, X, Minimize2, Bell, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnomalyAlert from "@/components/AnomalyAlert";
import { mockAnomalies, Anomaly } from "@/types/anomaly";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const AICopilot = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI Ops Copilot. I can help with incident analysis, capacity planning, and infrastructure optimization. What would you like to know?",
    },
  ]);
  const [input, setInput] = useState("");
  const [anomalies, setAnomalies] = useState<Anomaly[]>(mockAnomalies.filter(a => a.status === "active"));
  const [hasNewAlerts, setHasNewAlerts] = useState(true);

  useEffect(() => {
    // Simulate new anomaly detection
    const interval = setInterval(() => {
      const activeAnomalies = mockAnomalies.filter(a => a.status === "active");
      if (activeAnomalies.length > 0 && !isOpen) {
        setHasNewAlerts(true);
        
        // Show toast notification for new anomaly
        const latestAnomaly = activeAnomalies[0];
        toast({
          title: "🚨 Anomaly Detected",
          description: latestAnomaly.title,
          variant: latestAnomaly.severity === "critical" ? "destructive" : "default",
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [isOpen, toast]);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages([...messages, { role: "user", content: input }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I've analyzed your query. Based on current infrastructure metrics, I recommend scaling up your east-coast cluster by 20% to handle the projected load increase. Would you like me to generate a detailed capacity plan?",
        },
      ]);
    }, 1000);

    setInput("");
  };

  const handleResolveAnomaly = (anomalyId: string) => {
    setAnomalies(prev => prev.filter(a => a.id !== anomalyId));
    
    toast({
      title: "✅ Anomaly Resolved",
      description: "Automated remediation has been applied successfully.",
    });

    // Add resolution message to chat
    setMessages(prev => [
      ...prev,
      {
        role: "assistant",
        content: `I've automatically resolved the anomaly (${anomalyId}). All remediation steps have been executed successfully. Your infrastructure is now optimized.`,
      },
    ]);
  };

  const handleDismissAnomaly = (anomalyId: string) => {
    setAnomalies(prev => prev.filter(a => a.id !== anomalyId));
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => {
            setIsOpen(true);
            setHasNewAlerts(false);
          }}
          className="h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 relative"
          size="icon"
        >
          <MessageSquare className="h-6 w-6" />
          {hasNewAlerts && anomalies.length > 0 && (
            <Badge className="absolute -top-1 -right-1 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-destructive text-destructive-foreground animate-pulse">
              {anomalies.length}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-[480px] h-[600px] shadow-2xl border-border bg-card flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">AI Ops Copilot</h3>
          {anomalies.length > 0 && (
            <Badge className="bg-destructive/10 text-destructive border-destructive/20">
              {anomalies.length} alerts
            </Badge>
          )}
        </div>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <Minimize2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-2 grid w-auto grid-cols-2">
          <TabsTrigger value="chat" className="text-xs">
            <MessageSquare className="h-3 w-3 mr-1" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="alerts" className="text-xs relative">
            <Bell className="h-3 w-3 mr-1" />
            Alerts
            {anomalies.length > 0 && (
              <Badge className="ml-1 h-4 px-1 text-xs bg-destructive text-destructive-foreground">
                {anomalies.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask about your infrastructure..."
                className="bg-secondary border-border"
              />
              <Button onClick={handleSend} size="icon" className="bg-primary hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="flex-1 mt-0 p-0">
          <ScrollArea className="h-[440px]">
            <div className="p-4 space-y-4">
              {anomalies.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">No active anomalies detected</p>
                  <p className="text-xs text-muted-foreground mt-1">Your infrastructure is running smoothly</p>
                </div>
              ) : (
                anomalies.map((anomaly) => (
                  <AnomalyAlert
                    key={anomaly.id}
                    anomaly={anomaly}
                    onDismiss={() => handleDismissAnomaly(anomaly.id)}
                    onResolve={() => handleResolveAnomaly(anomaly.id)}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default AICopilot;
