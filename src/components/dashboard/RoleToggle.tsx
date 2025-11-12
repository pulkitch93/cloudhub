import { AppRole } from '@/types/dashboard';
import { useDashboard } from '@/contexts/DashboardContext';
import { Button } from '@/components/ui/button';
import { Briefcase, Settings, Users } from 'lucide-react';

const RoleToggle = () => {
  const { role, setRole } = useDashboard();

  const roles: { value: AppRole; label: string; icon: React.ReactNode }[] = [
    { value: 'executive', label: 'Executive', icon: <Briefcase className="w-4 h-4" /> },
    { value: 'operations', label: 'Operations', icon: <Settings className="w-4 h-4" /> },
    { value: 'product', label: 'Product', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="flex gap-2 bg-muted/30 p-1 rounded-lg">
      {roles.map(r => (
        <Button
          key={r.value}
          variant={role === r.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setRole(r.value)}
          className="gap-2"
        >
          {r.icon}
          {r.label}
        </Button>
      ))}
    </div>
  );
};

export default RoleToggle;
