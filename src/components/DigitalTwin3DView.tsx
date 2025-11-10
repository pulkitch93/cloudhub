import { Canvas } from '@react-three/fiber';
import { OrbitControls, Box, Text } from '@react-three/drei';
import { Server, Rack } from '@/types/digitalTwin';
import { useState } from 'react';

interface ServerMeshProps {
  server: Server;
  onClick: (server: Server) => void;
}

const ServerMesh = ({ server, onClick }: ServerMeshProps) => {
  const [hovered, setHovered] = useState(false);
  
  const getColor = () => {
    switch (server.status) {
      case 'healthy': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      case 'maintenance': return '#6b7280';
      default: return '#10b981';
    }
  };

  return (
    <group position={[server.position.x, server.position.y, server.position.z]}>
      <Box
        args={[0.8, 0.3, 0.6]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => onClick(server)}
      >
        <meshStandardMaterial
          color={getColor()}
          emissive={getColor()}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.8}
          roughness={0.2}
        />
      </Box>
      {hovered && (
        <Text
          position={[0, 0.5, 0]}
          fontSize={0.15}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {server.name}
        </Text>
      )}
    </group>
  );
};

interface RackMeshProps {
  rack: Rack;
}

const RackMesh = ({ rack }: RackMeshProps) => {
  const utilizationColor = rack.used / rack.capacity > 0.9 ? '#ef4444' : 
                           rack.used / rack.capacity > 0.7 ? '#f59e0b' : '#3b82f6';

  return (
    <group position={[rack.position.x, rack.position.y, rack.position.z]}>
      <Box args={[1.2, 2, 0.8]}>
        <meshStandardMaterial
          color={utilizationColor}
          transparent
          opacity={0.2}
          wireframe
        />
      </Box>
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.12}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {rack.name}
      </Text>
    </group>
  );
};

interface DigitalTwin3DViewProps {
  servers: Server[];
  racks: Rack[];
  onServerClick: (server: Server) => void;
}

const DigitalTwin3DView = ({ servers, racks, onServerClick }: DigitalTwin3DViewProps) => {
  return (
    <div className="h-full w-full">
      <Canvas camera={{ position: [8, 6, 8], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
        
        {racks.map((rack) => (
          <RackMesh key={rack.id} rack={rack} />
        ))}
        
        {servers.map((server) => (
          <ServerMesh key={server.id} server={server} onClick={onServerClick} />
        ))}
        
        {/* Floor grid */}
        <gridHelper args={[20, 20, '#1e293b', '#334155']} position={[0, -1, 0]} />
        
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          minDistance={5}
          maxDistance={20}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
};

export default DigitalTwin3DView;
