import { Canvas } from '@react-three/fiber';
import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Card } from '@/components/ui/card';

const Globe = () => {
  return (
    <mesh>
      <Sphere args={[1, 64, 64]}>
        <MeshDistortMaterial
          color="#E2231A"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.4}
        />
      </Sphere>
    </mesh>
  );
};

const InfrastructureGlobe = () => {
  return (
    <Card className="bg-card border-border h-[400px] overflow-hidden">
      <div className="h-full w-full">
        <Canvas camera={{ position: [0, 0, 3] }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <Globe />
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm p-3 rounded-lg border border-border">
        <p className="text-xs text-muted-foreground">Infrastructure Nodes</p>
        <p className="text-lg font-bold text-foreground">247 Active</p>
      </div>
    </Card>
  );
};

export default InfrastructureGlobe;
