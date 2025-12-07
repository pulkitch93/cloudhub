/**
 * @fileoverview Digital Twin type definitions for infrastructure visualization.
 * Contains interfaces for servers, racks, and simulation scenarios.
 * @module types/digitalTwin
 * @version 1.0.0
 */

/**
 * Represents a physical or virtual server in the infrastructure.
 * @interface Server
 * @property {string} id - Unique server identifier
 * @property {string} name - Display name (e.g., "WEB-PROD-01")
 * @property {string} rack - Reference to parent rack ID
 * @property {string} location - Geographic location or region
 * @property {Position3D} position - 3D position for visualization
 * @property {'healthy' | 'warning' | 'critical' | 'maintenance'} status - Current health status
 * @property {ServerTelemetry} telemetry - Real-time telemetry data
 * @property {string[]} workloads - List of workloads running on server
 * @property {'Compute' | 'Storage' | 'AI Nodes' | 'Edge'} [serverType] - Server classification
 * @property {'Americas' | 'EMEA' | 'APAC'} [region] - Geographic region
 * @property {number} [uptime] - Uptime percentage (0-100)
 * @property {string} [lastIncident] - Description of last incident
 * @property {number} [latency] - Network latency in milliseconds
 * @property {number} [packetLoss] - Packet loss percentage
 * @example
 * const server: Server = {
 *   id: 'srv-001',
 *   name: 'WEB-PROD-01',
 *   rack: 'rack-1',
 *   location: 'US-East',
 *   position: { x: -3, y: 1.5, z: -2 },
 *   status: 'healthy',
 *   telemetry: { cpu: 45, memory: 68, temperature: 42, powerUsage: 285, networkTraffic: 1250 },
 *   workloads: ['Web Server', 'Load Balancer']
 * };
 */
export interface Server {
  id: string;
  name: string;
  rack: string;
  location: string;
  position: { x: number; y: number; z: number };
  status: 'healthy' | 'warning' | 'critical' | 'maintenance';
  telemetry: {
    /**
     * CPU utilization percentage (0-100)
     */
    cpu: number;
    /**
     * Memory utilization percentage (0-100)
     */
    memory: number;
    /**
     * Temperature in Celsius
     */
    temperature: number;
    /**
     * Power consumption in Watts
     */
    powerUsage: number;
    /**
     * Network traffic in Mbps
     */
    networkTraffic: number;
  };
  workloads: string[];
  serverType?: 'Compute' | 'Storage' | 'AI Nodes' | 'Edge';
  region?: 'Americas' | 'EMEA' | 'APAC';
  uptime?: number;
  lastIncident?: string;
  latency?: number;
  packetLoss?: number;
}

/**
 * Represents a server rack in the data center.
 * @interface Rack
 * @property {string} id - Unique rack identifier
 * @property {string} name - Display name (e.g., "Rack A-1")
 * @property {string} location - Data center location
 * @property {Position3D} position - 3D position for visualization
 * @property {number} capacity - Total rack units (U) available
 * @property {number} used - Rack units currently in use
 * @property {number} coolingEfficiency - Cooling efficiency percentage (0-100)
 * @property {number} powerDraw - Total power draw in kW
 * @example
 * const rack: Rack = {
 *   id: 'rack-1',
 *   name: 'Rack A-1',
 *   location: 'Data Center East',
 *   position: { x: -3, y: 0, z: -2 },
 *   capacity: 42,
 *   used: 38,
 *   coolingEfficiency: 92,
 *   powerDraw: 8.5
 * };
 */
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

/**
 * Represents a what-if simulation scenario for capacity planning.
 * @interface Scenario
 * @property {string} id - Unique scenario identifier
 * @property {string} name - Display name for the scenario
 * @property {'growth' | 'migration' | 'sustainability'} type - Scenario category
 * @property {string} description - Detailed description of the scenario
 * @property {ScenarioImpact} impact - Projected impact metrics
 * @example
 * const scenario: Scenario = {
 *   id: 'growth',
 *   name: 'Growth Scenario',
 *   type: 'growth',
 *   description: 'Simulate 50% capacity increase over 6 months',
 *   impact: {
 *     capacity: '+21 servers required',
 *     cost: '+$125K annual',
 *     carbon: '+8.5T CO₂/year',
 *     performance: '+45% throughput'
 *   }
 * };
 */
export interface Scenario {
  id: string;
  name: string;
  type: 'growth' | 'migration' | 'sustainability';
  description: string;
  impact: {
    /**
     * Impact on infrastructure capacity
     */
    capacity: string;
    /**
     * Cost impact (annual)
     */
    cost: string;
    /**
     * Carbon footprint impact
     */
    carbon: string;
    /**
     * Performance impact
     */
    performance: string;
  };
}

/**
 * Mock rack data for demonstration and testing.
 * @constant {Rack[]}
 */
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

/**
 * Mock server data for demonstration and testing.
 * Includes servers across multiple racks with various status states.
 * @constant {Server[]}
 */
export const mockServers: Server[] = [
  {
    id: 'srv-001',
    name: 'WEB-PROD-01',
    rack: 'rack-1',
    location: 'US-East',
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
    location: 'US-East',
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
    location: 'US-West',
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
    location: 'EU-Central',
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
    location: 'AP-Southeast',
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
    location: 'UK-South',
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

/**
 * Predefined simulation scenarios for capacity planning.
 * @constant {Scenario[]}
 */
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
