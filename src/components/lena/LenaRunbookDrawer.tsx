import { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { PrescriptiveAction, RunbookStep } from '@/types/lenaAI';
import { CheckCircle2, Circle, Loader2, AlertCircle, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { novaAiService } from '@/services/lenaAiService';

interface NovaRunbookDrawerProps {
  action: PrescriptiveAction;
  onClose: () => void;
  onComplete: () => void;
}

const NovaRunbookDrawer = ({ action, onClose, onComplete }: NovaRunbookDrawerProps) => {
  const [steps, setSteps] = useState<RunbookStep[]>(action.steps);
  const [isExecuting, setIsExecuting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const { toast } = useToast();

  const completedSteps = steps.filter(s => s.status === 'completed').length;
  const progressPercentage = (completedSteps / steps.length) * 100;

  const getStepIcon = (status: RunbookStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'in-progress':
        return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-destructive" />;
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />;
    }
  };

  const getTypeColor = (type: PrescriptiveAction['type']) => {
    switch (type) {
      case 'rightsize': return 'bg-success/10 text-success';
      case 'migrate': return 'bg-warning/10 text-warning';
      case 'scale': return 'bg-primary/10 text-primary';
      case 'reduce-egress': return 'bg-info/10 text-info';
      case 'adoption': return 'bg-purple-500/10 text-purple-500';
      case 'ticket': return 'bg-orange-500/10 text-orange-500';
    }
  };

  const executeRunbook = async () => {
    setIsExecuting(true);

    // Simulate step-by-step execution
    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      
      // Update step to in-progress
      setSteps(prev => prev.map((step, idx) => 
        idx === i ? { ...step, status: 'in-progress' as const } : step
      ));

      // Simulate execution time
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Update step to completed
      setSteps(prev => prev.map((step, idx) => 
        idx === i ? { 
          ...step, 
          status: 'completed' as const,
          validationMsg: 'Step completed successfully'
        } : step
      ));
    }

    setCurrentStepIndex(-1);

    // Execute the final action
    try {
      const result = await novaAiService.executeRunbook(action.id);
      
      toast({
        title: 'Runbook Executed Successfully',
        description: result.message,
      });

      // Wait a bit before calling onComplete
      await new Promise(resolve => setTimeout(resolve, 1000));
      onComplete();
    } catch (error) {
      toast({
        title: 'Execution Error',
        description: 'Failed to complete runbook execution',
        variant: 'destructive',
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Badge className={getTypeColor(action.type)}>
              {action.type}
            </Badge>
            {action.title}
          </SheetTitle>
          <SheetDescription>{action.description}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Impact & Savings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Impact</p>
              <p className="text-sm font-medium">{action.impact}</p>
            </div>
            {action.estimatedSavings && (
              <div className="p-4 bg-success/10 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Est. Savings</p>
                <p className="text-lg font-bold text-success flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  {action.estimatedSavings.toLocaleString()}/mo
                </p>
              </div>
            )}
          </div>

          {/* Progress */}
          {isExecuting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Executing runbook...</span>
                <span>{completedSteps}/{steps.length} steps</span>
              </div>
              <Progress value={progressPercentage} />
            </div>
          )}

          {/* Steps */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm">Execution Steps</h4>
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className={`p-3 border rounded-lg transition-all ${
                  step.status === 'in-progress'
                    ? 'border-primary bg-primary/5'
                    : step.status === 'completed'
                    ? 'border-success/50 bg-success/5'
                    : step.status === 'failed'
                    ? 'border-destructive/50 bg-destructive/5'
                    : 'border-border'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getStepIcon(step.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-medium text-sm mb-1">
                      {idx + 1}. {step.title}
                    </h5>
                    <p className="text-xs text-muted-foreground">{step.description}</p>
                    {step.validationMsg && step.status === 'completed' && (
                      <p className="text-xs text-success mt-2">{step.validationMsg}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={executeRunbook}
              disabled={isExecuting || completedSteps === steps.length}
              className="flex-1"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Executing...
                </>
              ) : completedSteps === steps.length ? (
                'Completed'
              ) : (
                action.cta
              )}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isExecuting}
            >
              {isExecuting ? 'Wait...' : 'Cancel'}
            </Button>
          </div>

          {/* Info */}
          <div className="p-3 bg-muted/30 rounded text-xs text-muted-foreground">
            <p>
              This runbook will execute the steps above with validation at each stage. 
              You can cancel anytime before execution starts.
            </p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NovaRunbookDrawer;
