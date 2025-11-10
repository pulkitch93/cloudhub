import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  CheckCircle2, Circle, Loader2, AlertCircle, 
  Package, Settings, Rocket, Shield, X
} from 'lucide-react';

interface DeploymentStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  duration?: number;
  details?: string[];
}

interface DeploymentTrackerProps {
  isOpen: boolean;
  onClose: () => void;
  solutionName: string;
  solutionVendor: string;
  estimatedTime: string;
  onComplete: () => void;
}

const DeploymentTracker = ({
  isOpen,
  onClose,
  solutionName,
  solutionVendor,
  estimatedTime,
  onComplete
}: DeploymentTrackerProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [deploymentFailed, setDeploymentFailed] = useState(false);
  
  const [steps, setSteps] = useState<DeploymentStep[]>([
    {
      id: 'preparation',
      name: 'Preparation',
      description: 'Validating requirements and allocating resources',
      status: 'in-progress',
      details: [
        'Checking system compatibility',
        'Validating license keys',
        'Allocating compute resources',
        'Preparing storage volumes'
      ]
    },
    {
      id: 'configuration',
      name: 'Configuration',
      description: 'Setting up environment and dependencies',
      status: 'pending',
      details: [
        'Installing base packages',
        'Configuring network settings',
        'Setting up security policies',
        'Initializing databases'
      ]
    },
    {
      id: 'deployment',
      name: 'Deployment',
      description: 'Deploying solution components',
      status: 'pending',
      details: [
        'Deploying core services',
        'Configuring load balancers',
        'Setting up monitoring agents',
        'Applying configurations'
      ]
    },
    {
      id: 'validation',
      name: 'Validation',
      description: 'Running post-deployment checks',
      status: 'pending',
      details: [
        'Health check verification',
        'Performance baseline test',
        'Security scan',
        'Integration test'
      ]
    }
  ]);

  useEffect(() => {
    if (!isOpen) {
      // Reset state when dialog closes
      setCurrentStepIndex(0);
      setProgress(0);
      setDeploymentFailed(false);
      setSteps(steps.map((step, idx) => ({
        ...step,
        status: idx === 0 ? 'in-progress' : 'pending'
      })));
      return;
    }

    // Simulate deployment progress
    const stepDuration = 3000; // 3 seconds per step
    const progressInterval = 30; // Update every 30ms

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const increment = (100 / steps.length) / (stepDuration / progressInterval);
        const newProgress = Math.min(prev + increment, (currentStepIndex + 1) * (100 / steps.length));
        return newProgress;
      });
    }, progressInterval);

    const stepTimer = setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        // Complete current step and move to next
        setSteps(prev => prev.map((step, idx) => {
          if (idx === currentStepIndex) {
            return { ...step, status: 'completed', duration: stepDuration };
          } else if (idx === currentStepIndex + 1) {
            return { ...step, status: 'in-progress' };
          }
          return step;
        }));
        setCurrentStepIndex(prev => prev + 1);
      } else {
        // Complete final step
        setSteps(prev => prev.map((step, idx) => 
          idx === currentStepIndex 
            ? { ...step, status: 'completed', duration: stepDuration }
            : step
        ));
        setProgress(100);
        // Trigger completion callback
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }, stepDuration);

    return () => {
      clearInterval(progressTimer);
      clearTimeout(stepTimer);
    };
  }, [isOpen, currentStepIndex, steps.length, onComplete]);

  const getStepIcon = (step: DeploymentStep) => {
    switch (step.status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'in-progress':
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Circle className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStageIcon = (stepId: string) => {
    switch (stepId) {
      case 'preparation':
        return <Package className="h-4 w-4" />;
      case 'configuration':
        return <Settings className="h-4 w-4" />;
      case 'deployment':
        return <Rocket className="h-4 w-4" />;
      case 'validation':
        return <Shield className="h-4 w-4" />;
      default:
        return <Circle className="h-4 w-4" />;
    }
  };

  const isDeploymentComplete = steps.every(step => step.status === 'completed');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-primary" />
                Deploying {solutionName}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {solutionVendor} • Estimated time: {estimatedTime}
              </DialogDescription>
            </div>
            {!isDeploymentComplete && (
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-6">
          {/* Overall Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-semibold text-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Deployment Steps */}
          <div className="space-y-4">
            {steps.map((step, index) => (
              <Card 
                key={step.id} 
                className={`border transition-all ${
                  step.status === 'in-progress' 
                    ? 'border-primary bg-primary/5' 
                    : step.status === 'completed'
                    ? 'border-success/50 bg-success/5'
                    : step.status === 'failed'
                    ? 'border-destructive bg-destructive/5'
                    : 'border-border bg-card'
                }`}
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-4">
                    {/* Step Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getStepIcon(step)}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getStageIcon(step.id)}
                        <h4 className="font-semibold text-foreground">{step.name}</h4>
                        {step.status === 'in-progress' && (
                          <Badge variant="outline" className="ml-auto text-primary border-primary/30">
                            In Progress
                          </Badge>
                        )}
                        {step.status === 'completed' && step.duration && (
                          <Badge variant="outline" className="ml-auto text-success border-success/30">
                            {(step.duration / 1000).toFixed(1)}s
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{step.description}</p>

                      {/* Step Details */}
                      {step.status !== 'pending' && (
                        <div className="space-y-1.5 pl-4 border-l-2 border-border">
                          {step.details?.map((detail, idx) => (
                            <div 
                              key={idx} 
                              className={`text-xs flex items-center gap-2 transition-opacity ${
                                step.status === 'in-progress' && idx > 0 ? 'opacity-50' : 'opacity-100'
                              }`}
                            >
                              {step.status === 'completed' ? (
                                <CheckCircle2 className="h-3 w-3 text-success flex-shrink-0" />
                              ) : step.status === 'in-progress' && idx === 0 ? (
                                <Loader2 className="h-3 w-3 text-primary animate-spin flex-shrink-0" />
                              ) : (
                                <Circle className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                              )}
                              <span className="text-muted-foreground">{detail}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Completion Message */}
          {isDeploymentComplete && (
            <Card className="bg-success/10 border-success/20">
              <CardContent className="pt-6 pb-6 text-center">
                <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
                <h3 className="font-semibold text-foreground mb-1">Deployment Successful!</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {solutionName} has been successfully deployed and validated.
                </p>
                <Button onClick={onClose}>
                  View in Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeploymentTracker;
