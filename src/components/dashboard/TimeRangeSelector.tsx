import { useDashboard } from '@/contexts/DashboardContext';
import { Button } from '@/components/ui/button';

const TimeRangeSelector = () => {
  const { filters, updateFilter } = useDashboard();

  const ranges = [
    { value: '1d', label: 'Today' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
  ] as const;

  return (
    <div className="flex gap-2 bg-muted/30 p-1 rounded-lg">
      {ranges.map(range => (
        <Button
          key={range.value}
          variant={filters.timeRange === range.value ? 'default' : 'ghost'}
          size="sm"
          onClick={() => updateFilter('timeRange', range.value)}
        >
          {range.label}
        </Button>
      ))}
    </div>
  );
};

export default TimeRangeSelector;
