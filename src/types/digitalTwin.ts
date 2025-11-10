export interface Server {
  id: string;
  name: string;
  rack: string;
  position: { x: number; y: number; z: number };
  status: 'healthy' | 'warning' | 'critical' | 'maintenance';
  telemetry: {
    cpu: number;
    memory: number;
    temperature: number;
    powerUsage: number;
    networkTraffic: number;
  };
  workloads: string[];
}

export interface Rack {
  id: string;
  name: string;
  location: string;
  position: { x: number; y: number; z: number };
  capacity: number;
  used: number;
  coolingEfficiency: number;
  powerDraw: number;
}

export interface Scenario {
  id: string;
  name: string;
  type: 'growth' | 'migration' | 'sustainability';
  description: string;
  impact: {
    capacity: string;
    cost: string;
    carbon: string;
    performance: string;
  };
}

export const mockRacks: Rack[] = [
  {
    id: 'rack-1',
    name: 'Rack A-1',
    location: 'Data Center East',
    position: { x: -3, y: 0, z: -2 },
    capacity: 42,
    used: 38,
    coolingEfficiency: 92,
    powerDraw: 8.5,
  },
  {
    id: 'rack-2',
    name: 'Rack A-2',
    location: 'Data Center East',
    position: { x: 0, y: 0, z: -2 },
    capacity: 42,
    used: 35,
    coolingEfficiency: 88,
    powerDraw: 7.8,
  },
  {
    id: 'rack-3',
    name: 'Rack B-1',
    location: 'Data Center West',
    position: { x: 3, y: 0, z: -2 },
    capacity: 42,
    used: 29,
    coolingEfficiency: 95,
    powerDraw: 6.2,
  },
];

export const mockServers: Server[] = [
  {
    id: 'srv-001',
    name: 'WEB-PROD-01',
    rack: 'rack-1',
    position: { x: -3, y: 1.5, z: -2 },
    status: 'healthy',
    telemetry: {
      cpu: 45,
      memory: 68,
      temperature: 42,
      powerUsage: 285,
      networkTraffic: 1250,
    },
    workloads: ['Web Server', 'Load Balancer'],
  },
  {
    id: 'srv-002',
    name: 'DB-PROD-01',
    rack: 'rack-1',
    position: { x: -3, y: 0.5, z: -2 },
    status: 'warning',
    telemetry: {
      cpu: 78,
      memory: 89,
      temperature: 58,
      powerUsage: 420,
      networkTraffic: 3400,
    },
    workloads: ['PostgreSQL', 'Redis Cache'],
  },
  {
    id: 'srv-003',
    name: 'APP-PROD-01',
    rack: 'rack-2',
    position: { x: 0, y: 1.5, z: -2 },
    status: 'healthy',
    telemetry: {
      cpu: 52,
      memory: 71,
      temperature: 45,
      powerUsage: 310,
      networkTraffic: 1800,
    },
    workloads: ['Application Server', 'API Gateway'],
  },
  {
    id: 'srv-004',
    name: 'ML-PROD-01',
    rack: 'rack-2',
    position: { x: 0, y: 0.5, z: -2 },
    status: 'healthy',
    telemetry: {
      cpu: 65,
      memory: 82,
      temperature: 51,
      powerUsage: 580,
      networkTraffic: 2200,
    },
    workloads: ['ML Training', 'Inference'],
  },
  {
    id: 'srv-005',
    name: 'BACKUP-01',
    rack: 'rack-3',
    position: { x: 3, y: 1.5, z: -2 },
    status: 'maintenance',
    telemetry: {
      cpu: 15,
      memory: 25,
      temperature: 35,
      powerUsage: 120,
      networkTraffic: 450,
    },
    workloads: ['Backup Server'],
  },
  {
    id: 'srv-006',
    name: 'STORAGE-01',
    rack: 'rack-3',
    position: { x: 3, y: 0.5, z: -2 },
    status: 'critical',
    telemetry: {
      cpu: 92,
      memory: 95,
      temperature: 68,
      powerUsage: 450,
      networkTraffic: 5200,
    },
    workloads: ['Object Storage', 'File System'],
  },
];

export const scenarios: Scenario[] = [
  {
    id: 'growth',
    name: 'Growth Scenario',
    type: 'growth',
    description: 'Simulate 50% capacity increase over 6 months',
    impact: {
      capacity: '+21 servers required',
      cost: '+$125K annual',
      carbon: '+8.5T CO₂/year',
      performance: '+45% throughput',
    },
  },
  {
    id: 'migration',
    name: 'Cloud Migration',
    type: 'migration',
    description: 'Move 40% of workloads to hybrid cloud',
    impact: {
      capacity: '-15 servers needed',
      cost: '-$89K annual',
      carbon: '-5.2T CO₂/year',
      performance: '+12% latency reduction',
    },
  },
  {
    id: 'sustainability',
    name: 'Green Computing',
    type: 'sustainability',
    description: 'Optimize for carbon neutrality with renewable energy',
    impact: {
      capacity: 'Same capacity',
      cost: '-$45K annual',
      carbon: '-22T CO₂/year (95% reduction)',
      performance: 'Maintained',
    },
  },
];
