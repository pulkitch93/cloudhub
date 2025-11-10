import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface KPICardProps {
  title: string;
  value: string;
  trend: string;
  icon: LucideIcon;
  trendUp?: boolean;
}

const KPICard = ({ title, value, trend, icon: Icon, trendUp = true }: KPICardProps) => {
  return (
    <Card className="bg-card border-border hover:border-primary/50 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-3xl font-bold text-foreground">{value}</h3>
            <p className={`text-xs ${trendUp ? 'text-success' : 'text-destructive'}`}>
              {trend}
            </p>
          </div>
          <div className="p-3 rounded-lg bg-primary/10">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KPICard;
