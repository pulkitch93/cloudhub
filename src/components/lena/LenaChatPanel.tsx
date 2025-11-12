import { useState, useRef, useEffect } from 'react';
import { X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import LenaAlertsTab from './LenaAlertsTab';
import LenaMessageList from './LenaMessageList';
import { LenaMessage, LenaContext } from '@/types/lenaAI';
import { useLocation } from 'react-router-dom';
import { lenaAiService } from '@/services/lenaAiService';

interface LenaChatPanelProps {
  onClose: () => void;
}

const LenaChatPanel = ({ onClose }: LenaChatPanelProps) => {
  const [messages, setMessages] = useState<LenaMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm Lena, your AI copilot. I can help you with alerts, cost optimization, rightsizing, and more. Try asking a question or use slash commands like `/alerts today` or `/cost top-drivers 30d`.",
      timestamp: new Date(),
      type: 'text',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('chat');
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Quick action chips
  const quickChips = [
    "Show today's alerts",
    "Top cost drivers",
    "Rightsize hotspots",
    "Explain a spike",
  ];

  // Build context for AI
  const getContext = (): LenaContext => ({
    currentPage: location.pathname,
    filters: {
      timeRange: '30d', // Default fallback
    },
    recentAlerts: 3,
    healthSignals: {
      costSpike: true,
      performanceIssue: false,
      lowAdoption: true,
    },
  });

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: LenaMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
      type: 'text',
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Check if it's a slash command
      const slashCmd = lenaAiService.parseSlashCommand(input);
      let responseContent: string;

      if (slashCmd) {
        responseContent = await lenaAiService.handleSlashCommand(
          slashCmd.command,
          slashCmd.args,
          getContext()
        );
      } else {
        // TODO: Call Lovable AI edge function for general queries
        // For now, use a mock response
        await new Promise(resolve => setTimeout(resolve, 1000));
        responseContent = `I received your question: "${input}". I'm analyzing the context and will provide insights based on your current page (${location.pathname}).`;
      }

      const assistantMessage: LenaMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        type: 'text',
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: LenaMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error processing your request. Please try again.',
        timestamp: new Date(),
        type: 'text',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickChip = (chip: string) => {
    setInput(chip);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Keyboard shortcut to open (Cmd/Ctrl + /)
  useEffect(() => {
    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyboardShortcut);
    return () => window.removeEventListener('keydown', handleKeyboardShortcut);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 w-[400px] h-[600px] bg-card border border-border rounded-lg shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-lg font-bold text-primary">L</span>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-card" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">Lena AI</h3>
            <p className="text-xs text-muted-foreground">Online • Just now</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="chat" className="flex-1">Chat</TabsTrigger>
          <TabsTrigger value="alerts" className="flex-1">
            Alerts
            <Badge variant="destructive" className="ml-2">3</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col p-4 m-0 overflow-hidden">
          {/* Messages */}
          <ScrollArea ref={scrollRef} className="flex-1 pr-4">
            <LenaMessageList messages={messages} />
          </ScrollArea>

          {/* Quick Chips */}
          <div className="flex flex-wrap gap-2 my-3">
            {quickChips.map(chip => (
              <button
                key={chip}
                onClick={() => handleQuickChip(chip)}
                className="px-3 py-1 text-xs bg-muted hover:bg-muted/80 rounded-full transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything or use /commands..."
              className="min-h-[60px] max-h-[120px] resize-none"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSend} 
              disabled={!input.trim() || isLoading}
              size="icon"
              className="h-[60px] w-[60px]"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="flex-1 m-0 overflow-hidden">
          <LenaAlertsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LenaChatPanel;
