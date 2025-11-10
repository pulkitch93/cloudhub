import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, MessageSquare, Pencil, MousePointer2, Server } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

interface CollaboratorCursor {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

interface Annotation {
  id: string;
  userId: string;
  userName: string;
  userColor: string;
  text: string;
  x: number;
  y: number;
  timestamp: string;
}

const CollaborationCanvas = () => {
  const [collaborators] = useState([
    { id: '1', name: 'Sarah Chen', initials: 'SC', color: '#3b82f6', active: true },
    { id: '2', name: 'Mike Johnson', initials: 'MJ', color: '#10b981', active: true },
    { id: '3', name: 'Alex Kumar', initials: 'AK', color: '#f59e0b', active: false }
  ]);

  const [cursors, setCursors] = useState<CollaboratorCursor[]>([
    { id: '1', name: 'Sarah Chen', color: '#3b82f6', x: 150, y: 200 },
    { id: '2', name: 'Mike Johnson', color: '#10b981', x: 450, y: 350 }
  ]);

  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: '1',
      userId: '1',
      userName: 'Sarah Chen',
      userColor: '#3b82f6',
      text: 'We should migrate this workload first - highest risk',
      x: 200,
      y: 180,
      timestamp: '2 minutes ago'
    },
    {
      id: '2',
      userId: '2',
      userName: 'Mike Johnson',
      userColor: '#10b981',
      text: 'Agreed. I\'ll prepare the failover plan',
      x: 500,
      y: 320,
      timestamp: '1 minute ago'
    }
  ]);

  const [newAnnotation, setNewAnnotation] = useState('');
  const [isAddingAnnotation, setIsAddingAnnotation] = useState(false);

  // Simulate cursor movements
  useEffect(() => {
    const interval = setInterval(() => {
      setCursors(prev => prev.map(cursor => ({
        ...cursor,
        x: Math.max(50, Math.min(750, cursor.x + (Math.random() - 0.5) * 50)),
        y: Math.max(50, Math.min(450, cursor.y + (Math.random() - 0.5) * 50))
      })));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleAddAnnotation = (x: number, y: number) => {
    if (!newAnnotation.trim()) return;

    const annotation: Annotation = {
      id: Date.now().toString(),
      userId: 'current',
      userName: 'You',
      userColor: '#8b5cf6',
      text: newAnnotation,
      x,
      y,
      timestamp: 'Just now'
    };

    setAnnotations([...annotations, annotation]);
    setNewAnnotation('');
    setIsAddingAnnotation(false);
    
    toast.success('Annotation added', {
      description: 'Your team members can see this annotation'
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Real-Time Collaboration
            </CardTitle>
            <CardDescription>
              Plan infrastructure changes together with live cursor tracking and annotations
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-success/10 text-success border-success/20">
              {collaborators.filter(c => c.active).length} Active
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Active Collaborators */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border">
          <span className="text-sm font-medium text-foreground">Active Now:</span>
          <div className="flex items-center gap-2">
            {collaborators.filter(c => c.active).map((collab) => (
              <div key={collab.id} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/50">
                <Avatar className="h-6 w-6" style={{ borderColor: collab.color, borderWidth: 2 }}>
                  <AvatarFallback style={{ backgroundColor: collab.color + '20', color: collab.color }}>
                    {collab.initials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-foreground">{collab.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Collaboration Canvas */}
        <div className="relative w-full h-[500px] rounded-lg border border-border bg-gradient-to-br from-background via-card/50 to-background overflow-hidden">
          {/* Infrastructure Visualization Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground text-sm">
            <div className="text-center space-y-2">
              <Server className="h-16 w-16 mx-auto opacity-20" />
              <p>Infrastructure topology visualization</p>
              <p className="text-xs">Team members can interact and annotate here</p>
            </div>
          </div>

          {/* Collaborative Cursors */}
          {cursors.map((cursor) => (
            <div
              key={cursor.id}
              className="absolute pointer-events-none transition-all duration-500 ease-out"
              style={{ 
                left: cursor.x, 
                top: cursor.y,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <MousePointer2 
                className="h-6 w-6" 
                style={{ color: cursor.color }}
                fill={cursor.color}
              />
              <div 
                className="absolute top-6 left-6 px-2 py-1 rounded text-xs whitespace-nowrap text-white font-medium"
                style={{ backgroundColor: cursor.color }}
              >
                {cursor.name}
              </div>
            </div>
          ))}

          {/* Annotations */}
          {annotations.map((annotation) => (
            <div
              key={annotation.id}
              className="absolute"
              style={{ left: annotation.x, top: annotation.y }}
            >
              <div 
                className="relative p-3 rounded-lg shadow-lg max-w-[200px] border-2"
                style={{ 
                  backgroundColor: 'hsl(var(--card))',
                  borderColor: annotation.userColor
                }}
              >
                {/* Pointer */}
                <div 
                  className="absolute w-3 h-3 rotate-45 -top-1.5 left-4"
                  style={{ backgroundColor: annotation.userColor }}
                />
                
                <div className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: annotation.userColor }}
                    />
                    <span className="text-xs font-semibold text-foreground">{annotation.userName}</span>
                  </div>
                  <p className="text-xs text-foreground mb-1">{annotation.text}</p>
                  <span className="text-[10px] text-muted-foreground">{annotation.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Click to Add Annotation */}
          {isAddingAnnotation && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-80 p-3 rounded-lg bg-card border border-border shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">Add Annotation</span>
              </div>
              <div className="flex gap-2">
                <Input
                  value={newAnnotation}
                  onChange={(e) => setNewAnnotation(e.target.value)}
                  placeholder="Type your comment..."
                  className="flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleAddAnnotation(400, 250);
                    }
                  }}
                />
                <Button 
                  size="sm"
                  onClick={() => handleAddAnnotation(400, 250)}
                >
                  Add
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Collaboration Tools */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={isAddingAnnotation ? "default" : "outline"}
              onClick={() => setIsAddingAnnotation(!isAddingAnnotation)}
            >
              <Pencil className="h-4 w-4 mr-1" />
              Annotate
            </Button>
            <Button size="sm" variant="outline">
              <MessageSquare className="h-4 w-4 mr-1" />
              Chat ({annotations.length})
            </Button>
          </div>
          
          <Button size="sm">
            Invite Team Members
          </Button>
        </div>

        {/* Info Banner */}
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-xs">
          <div className="flex items-start gap-2">
            <Users className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-muted-foreground">
              <span className="font-semibold text-foreground">Real-time collaboration is active.</span> All team members can see each other's cursors, annotations, and changes instantly. Changes are synced across all connected sessions.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CollaborationCanvas;
