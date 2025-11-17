import { useState } from "react";
import { MessageSquare, Send, X, Minimize2, GraduationCap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface LearningAssistantProps {
  mode?: "assist" | "teach";
}

const LearningAssistant = ({ mode = "teach" }: LearningAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: mode === "teach" 
        ? "Hello! I'm your AI Learning Assistant. I can help you understand concepts, find courses, and guide you through tutorials. What would you like to learn today?"
        : "Hi! I'm here to help you with platform features and answer questions. How can I assist you?",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages([...messages, { role: "user", content: userMessage }]);
    
    // Simulate AI response based on common learning queries
    setTimeout(() => {
      let response = "";
      
      const lowerInput = userMessage.toLowerCase();
      
      if (lowerInput.includes("vmware") || lowerInput.includes("aria")) {
        response = "To integrate VMware Aria with TruScale, you'll need to:\n\n1. Configure API credentials in the Integrations page\n2. Set up data collection intervals\n3. Map your VMware resources to TruScale entities\n\nI recommend starting with the 'VMware Aria Integration Fundamentals' course. Would you like me to open it for you?";
      } else if (lowerInput.includes("truscale") || lowerInput.includes("billing")) {
        response = "TruScale billing optimization involves:\n\n• Understanding usage patterns\n• Setting up cost allocation rules\n• Configuring automated alerts\n• Right-sizing resources\n\nThe 'TruScale Billing Optimization' course covers all these topics. I can also show you the FinOps dashboard where you can practice these concepts.";
      } else if (lowerInput.includes("certificate") || lowerInput.includes("certification")) {
        response = "You can earn certificates by completing courses and passing assessments. Your current progress:\n\n✓ VMware Aria Integration - 65% complete\n○ TruScale Billing - Not started\n✓ Nutanix HCI Best Practices - 100% (Certificate earned!)\n\nComplete 2 more courses to unlock the 'XClarity Expert' certification.";
      } else if (lowerInput.includes("partner") || lowerInput.includes("nutanix") || lowerInput.includes("azure")) {
        response = "Our partner ecosystem includes comprehensive resources from leading vendors. I can help you navigate documentation from:\n\n• VMware - vSphere, Aria, Tanzu\n• Microsoft Azure - Hybrid Cloud, Arc\n• Nutanix - HCI, Cloud Platform\n• NVIDIA - GPU Computing, AI\n\nWhich partner's resources would you like to explore?";
      } else if (lowerInput.includes("expert") || lowerInput.includes("help") || lowerInput.includes("support")) {
        response = "I can connect you with experts in several ways:\n\n1. Schedule a 1-on-1 session (avg. wait: <30 min)\n2. Join community discussions\n3. Chat with a specialist now\n\nWe have 8 experts online right now. Would you like to connect with someone?";
      } else {
        response = "I understand you're interested in learning more about that topic. I can:\n\n• Recommend relevant courses based on your role\n• Provide step-by-step tutorials\n• Connect you with community experts\n• Find documentation and best practices\n\nCould you tell me more about what you'd like to achieve? Or I can suggest a personalized learning path based on your current progress.";
      }
      
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: response,
        },
      ]);
    }, 1000);

    setInput("");
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 relative group"
          size="icon"
        >
          <GraduationCap className="h-6 w-6 transition-transform group-hover:scale-110" />
          <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-400 animate-pulse" />
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-6 right-6 w-[480px] h-[600px] shadow-2xl border-border bg-card flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/5 to-purple-500/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Learning Assistant</h3>
            <p className="text-xs text-muted-foreground">
              {mode === "teach" ? "Teach Me Mode" : "Assist Me Mode"}
            </p>
          </div>
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

      {/* Quick Suggestions */}
      <div className="px-4 py-2 border-b border-border bg-secondary/30">
        <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
        <div className="flex flex-wrap gap-2">
          {[
            "How do I integrate VMware Aria?",
            "Show me billing optimization tips",
            "Connect with an expert"
          ].map((suggestion, i) => (
            <Badge
              key={i}
              variant="outline"
              className="cursor-pointer hover:bg-primary/10 hover:border-primary/50 transition-colors text-xs"
              onClick={() => {
                setInput(suggestion);
                setTimeout(() => handleSend(), 100);
              }}
            >
              {suggestion}
            </Badge>
          ))}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-gradient-to-br from-primary to-purple-600 text-white"
                    : "bg-secondary text-foreground border border-border"
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-border bg-secondary/30">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask me anything about learning..."
            className="bg-background border-border"
          />
          <Button 
            onClick={handleSend} 
            size="icon" 
            className="bg-gradient-to-br from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default LearningAssistant;
