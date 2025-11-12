import React, { createContext, useContext, useState, ReactNode } from 'react';
import { DashboardFilters, AppRole } from '@/types/dashboard';

interface DashboardContextType {
  filters: DashboardFilters;
  setFilters: (filters: DashboardFilters) => void;
  updateFilter: (key: keyof DashboardFilters, value: any) => void;
  role: AppRole;
  setRole: (role: AppRole) => void;
  resetFilters: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const defaultFilters: DashboardFilters = {
  timeRange: '30d',
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<DashboardFilters>(defaultFilters);
  const [role, setRole] = useState<AppRole>('executive');

  const updateFilter = (key: keyof DashboardFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <DashboardContext.Provider
      value={{
        filters,
        setFilters,
        updateFilter,
        role,
        setRole,
        resetFilters,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within DashboardProvider');
  }
  return context;
};
