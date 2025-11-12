import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface DashboardKPICardProps {
  title: string;
  value: string | number;
  delta: number;
  trend: number[];
  icon: LucideIcon;
  format?: 'number' | 'currency' | 'percent';
}

const DashboardKPICard = ({ title, value, delta, trend, icon: Icon, format = 'number' }: DashboardKPICardProps) => {
  const isPositive = delta >= 0;
  const trendData = trend.map((val, idx) => ({ value: val, index: idx }));

  const formatValue = (val: string | number) => {
    if (format === 'currency') {
      return typeof val === 'number' ? `$${(val / 1000).toFixed(0)}K` : val;
    }
    if (format === 'percent') {
      return `${val}%`;
    }
    return val;
  };

  return (
    <Card className="hover:border-primary/50 transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-foreground">{formatValue(value)}</h3>
          </div>
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            {isPositive ? (
              <TrendingUp className="w-4 h-4 text-success" />
            ) : (
              <TrendingDown className="w-4 h-4 text-destructive" />
            )}
            <span className={`text-sm font-medium ${isPositive ? 'text-success' : 'text-destructive'}`}>
              {Math.abs(delta).toFixed(1)}%
            </span>
          </div>
          
          <div className="w-20 h-8">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={isPositive ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                  fill={isPositive ? 'hsl(var(--success) / 0.2)' : 'hsl(var(--destructive) / 0.2)'}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardKPICard;
