import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Filter, X } from 'lucide-react';
import { useState } from 'react';

interface MapFiltersProps {
  onRegionFilter: (regions: string[]) => void;
  onStatusFilter: (statuses: string[]) => void;
  onTypeFilter: (types: string[]) => void;
  activeRegions: string[];
  activeStatuses: string[];
  activeTypes: string[];
}

const MapFilters = ({
  onRegionFilter,
  onStatusFilter,
  onTypeFilter,
  activeRegions,
  activeStatuses,
  activeTypes,
}: MapFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const regions = ['Americas', 'EMEA', 'APAC'];
  const statuses = ['Healthy', 'Warning', 'Critical', 'Maintenance'];
  const types = ['Compute', 'Storage', 'AI Nodes', 'Edge'];

  const toggleRegion = (region: string) => {
    if (activeRegions.includes(region)) {
      onRegionFilter(activeRegions.filter(r => r !== region));
    } else {
      onRegionFilter([...activeRegions, region]);
    }
  };

  const toggleStatus = (status: string) => {
    if (activeStatuses.includes(status)) {
      onStatusFilter(activeStatuses.filter(s => s !== status));
    } else {
      onStatusFilter([...activeStatuses, status]);
    }
  };

  const toggleType = (type: string) => {
    if (activeTypes.includes(type)) {
      onTypeFilter(activeTypes.filter(t => t !== type));
    } else {
      onTypeFilter([...activeTypes, type]);
    }
  };

  const clearAllFilters = () => {
    onRegionFilter([]);
    onStatusFilter([]);
    onTypeFilter([]);
  };

  const hasActiveFilters = activeRegions.length > 0 || activeStatuses.length > 0 || activeTypes.length > 0;

  return (
    <div className="absolute top-4 right-4 z-20">
      {!isExpanded ? (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsExpanded(true)}
          className="bg-card/90 backdrop-blur-sm border-border shadow-primary"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {hasActiveFilters && (
            <Badge variant="default" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
              {activeRegions.length + activeStatuses.length + activeTypes.length}
            </Badge>
          )}
        </Button>
      ) : (
        <Card className="p-4 min-w-[280px] bg-card/95 backdrop-blur-sm border-border shadow-primary">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filters
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Region Filter */}
          <div className="mb-4">
            <div className="text-xs font-medium text-muted-foreground mb-2">Region</div>
            <div className="flex flex-wrap gap-2">
              {regions.map(region => (
                <Badge
                  key={region}
                  variant={activeRegions.includes(region) ? 'default' : 'outline'}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => toggleRegion(region)}
                >
                  {region}
                </Badge>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="mb-4">
            <div className="text-xs font-medium text-muted-foreground mb-2">Health Status</div>
            <div className="flex flex-wrap gap-2">
              {statuses.map(status => (
                <Badge
                  key={status}
                  variant={activeStatuses.includes(status) ? 'default' : 'outline'}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => toggleStatus(status)}
                  style={{
                    backgroundColor: activeStatuses.includes(status)
                      ? status === 'Healthy' ? 'hsl(142, 70%, 45%)' :
                        status === 'Warning' ? 'hsl(38, 92%, 50%)' :
                        status === 'Critical' ? 'hsl(0, 84%, 60%)' :
                        'hsl(215, 16%, 47%)'
                      : undefined
                  }}
                >
                  {status}
                </Badge>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div className="mb-4">
            <div className="text-xs font-medium text-muted-foreground mb-2">Server Type</div>
            <div className="flex flex-wrap gap-2">
              {types.map(type => (
                <Badge
                  key={type}
                  variant={activeTypes.includes(type) ? 'default' : 'outline'}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => toggleType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearAllFilters}
              className="w-full"
            >
              Clear All Filters
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default MapFilters;
