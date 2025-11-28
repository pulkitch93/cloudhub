import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NovaChatPanel from './LenaChatPanel';
import { useLocation } from 'react-router-dom';

const NovaFloatingLauncher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const location = useLocation();

  // Don't show on Learning Hub
  if (location.pathname.startsWith('/learning-hub')) {
    return null;
  }

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <Button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:scale-110 transition-transform z-50"
          aria-label="Open Nova AI Assistant"
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      )}

      {/* Chat Panel */}
      {isOpen && <NovaChatPanel onClose={handleClose} />}

      {/* Keyboard shortcut hint */}
      {!isOpen && (
        <div className="fixed bottom-24 right-6 text-xs text-muted-foreground bg-card/80 backdrop-blur-sm px-2 py-1 rounded border border-border z-40 opacity-0 hover:opacity-100 transition-opacity">
          Press <kbd className="px-1 py-0.5 bg-muted rounded">Cmd</kbd>+<kbd className="px-1 py-0.5 bg-muted rounded">/</kbd> to open
        </div>
      )}
    </>
  );
};

export default NovaFloatingLauncher;
