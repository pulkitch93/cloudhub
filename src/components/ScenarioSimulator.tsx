import { useState } from 'react';
import { Scenario } from '@/types/digitalTwin';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, CloudCog, Leaf, PlayCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ScenarioSimulatorProps {
  scenarios: Scenario[];
}

const ScenarioSimulator = ({ scenarios }: ScenarioSimulatorProps) => {
  const [activeScenario, setActiveScenario] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  const getIcon = (type: Scenario['type']) => {
    switch (type) {
      case 'growth': return <TrendingUp className="h-4 w-4" />;
      case 'migration': return <CloudCog className="h-4 w-4" />;
      case 'sustainability': return <Leaf className="h-4 w-4" />;
    }
  };

  const handleSimulate = (scenario: Scenario) => {
    setIsSimulating(true);
    setActiveScenario(scenario.id);
    
    toast.success(`Simulating ${scenario.name}...`, {
      description: 'Real-time calculations in progress',
    });

    // Simulate processing
    setTimeout(() => {
      setIsSimulating(false);
      toast.success('Simulation Complete', {
        description: `${scenario.name} results are ready`,
      });
    }, 2000);
  };

  const handleClearSimulation = () => {
    setActiveScenario(null);
    setIsSimulating(false);
    toast.info('Simulation cleared');
  };

  return (
    <Card className="bg-card/90 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle className="text-sm flex items-center justify-between">
          <span>Scenario Simulator</span>
          {activeScenario && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSimulation}
              disabled={isSimulating}
            >
              <XCircle className="h-4 w-4" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {scenarios.map((scenario) => (
          <div
            key={scenario.id}
            className={`p-3 rounded-lg border transition-all ${
              activeScenario === scenario.id
                ? 'border-primary bg-primary/5'
                : 'border-border bg-background/50'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getIcon(scenario.type)}
                <div>
                  <h4 className="text-sm font-semibold">{scenario.name}</h4>
                  <p className="text-xs text-muted-foreground">{scenario.description}</p>
                </div>
              </div>
              <Button
                size="sm"
                variant={activeScenario === scenario.id ? "default" : "outline"}
                onClick={() => handleSimulate(scenario)}
                disabled={isSimulating}
              >
                <PlayCircle className="h-3 w-3" />
              </Button>
            </div>

            {activeScenario === scenario.id && (
              <div className="mt-3 pt-3 border-t border-border space-y-2">
                <h5 className="text-xs font-semibold text-foreground">Predicted Impact:</h5>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-muted-foreground">Capacity:</span>
                    <p className="font-mono text-foreground">{scenario.impact.capacity}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Cost:</span>
                    <p className="font-mono text-foreground">{scenario.impact.cost}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Carbon:</span>
                    <p className="font-mono text-foreground">{scenario.impact.carbon}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Performance:</span>
                    <p className="font-mono text-foreground">{scenario.impact.performance}</p>
                  </div>
                </div>
                {isSimulating && (
                  <div className="flex items-center gap-2 text-xs text-primary">
                    <div className="h-1 w-full bg-primary/20 rounded-full overflow-hidden">
                      <div className="h-full bg-primary animate-pulse" style={{ width: '60%' }} />
                    </div>
                    <span>Calculating...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ScenarioSimulator;
