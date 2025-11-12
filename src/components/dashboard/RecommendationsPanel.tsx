import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { useEffect, useState } from 'react';
import { dashboardApi } from '@/services/dashboardApi';
import { Recommendation } from '@/types/dashboard';
import { DollarSign, Zap, Shield, TrendingUp, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const RecommendationsPanel = () => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await dashboardApi.getRecommendations();
      setRecommendations(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  const getTypeIcon = (type: Recommendation['type']) => {
    switch (type) {
      case 'cost': return <DollarSign className="w-4 h-4" />;
      case 'performance': return <Zap className="w-4 h-4" />;
      case 'compliance': return <Shield className="w-4 h-4" />;
      case 'adoption': return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: Recommendation['type']) => {
    switch (type) {
      case 'cost': return 'bg-success/10 text-success';
      case 'performance': return 'bg-warning/10 text-warning';
      case 'compliance': return 'bg-destructive/10 text-destructive';
      case 'adoption': return 'bg-primary/10 text-primary';
    }
  };

  const handleApply = async (rec: Recommendation) => {
    try {
      await dashboardApi.applyRecommendation(rec.id);
      toast({
        title: 'Recommendation Applied',
        description: `${rec.title} has been queued for execution.`,
      });
      setSelectedRec(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to apply recommendation',
        variant: 'destructive',
      });
    }
  };

  const handleDismiss = (id: string) => {
    setRecommendations(prev => prev.filter(r => r.id !== id));
    toast({
      title: 'Recommendation Dismissed',
      description: 'You can re-enable this suggestion in settings.',
    });
  };

  if (loading) {
    return <div className="h-96 animate-pulse bg-muted rounded-lg" />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recommended Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map(rec => (
            <div
              key={rec.id}
              className="p-4 border border-border rounded-lg hover:border-primary/50 transition-all cursor-pointer"
              onClick={() => setSelectedRec(rec)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded ${getTypeColor(rec.type)}`}>
                    {getTypeIcon(rec.type)}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground">{rec.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  Impact: {rec.impactScore}
                </Badge>
              </div>
              
              {rec.estSavingsMonthly > 0 && (
                <div className="text-xs text-success font-medium">
                  Est. savings: ${rec.estSavingsMonthly.toLocaleString()}/month
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      <Sheet open={!!selectedRec} onOpenChange={() => setSelectedRec(null)}>
        <SheetContent className="w-full sm:max-w-lg">
          {selectedRec && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <div className={`p-2 rounded ${getTypeColor(selectedRec.type)}`}>
                    {getTypeIcon(selectedRec.type)}
                  </div>
                  {selectedRec.title}
                </SheetTitle>
                <SheetDescription>{selectedRec.description}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Why this recommendation?</h4>
                  <p className="text-sm text-muted-foreground">{selectedRec.details}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Impact Score</p>
                    <p className="text-2xl font-bold">{selectedRec.impactScore}</p>
                  </div>
                  {selectedRec.estSavingsMonthly > 0 && (
                    <div className="p-4 bg-success/10 rounded-lg">
                      <p className="text-xs text-muted-foreground">Monthly Savings</p>
                      <p className="text-2xl font-bold text-success">
                        ${selectedRec.estSavingsMonthly.toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button onClick={() => handleApply(selectedRec)} className="flex-1">
                    Apply Recommendation
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(selectedRec.actionLink, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  onClick={() => {
                    handleDismiss(selectedRec.id);
                    setSelectedRec(null);
                  }}
                  className="w-full"
                >
                  Dismiss
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

export default RecommendationsPanel;
