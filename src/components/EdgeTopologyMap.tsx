import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface EdgeNode {
  id: string;
  name: string;
  coordinates: [number, number];
  status: 'online' | 'warning' | 'offline';
  type: '5G' | 'IoT' | 'Edge';
  connections: string[];
}

interface EdgeTopologyMapProps {
  nodes: EdgeNode[];
}

const EdgeTopologyMap = ({ nodes }: EdgeTopologyMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [0, 20],
        zoom: 1.5,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setIsMapReady(true);

        // Add nodes as markers
        nodes.forEach((node) => {
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.width = '20px';
          el.style.height = '20px';
          el.style.borderRadius = '50%';
          el.style.border = '2px solid white';
          el.style.cursor = 'pointer';
          el.style.backgroundColor = 
            node.status === 'online' ? '#22c55e' :
            node.status === 'warning' ? '#eab308' : '#ef4444';

          const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
            `<div style="color: black; padding: 8px;">
              <h3 style="font-weight: bold; margin-bottom: 4px;">${node.name}</h3>
              <p style="font-size: 12px; margin-bottom: 2px;">Type: ${node.type}</p>
              <p style="font-size: 12px;">Status: ${node.status}</p>
            </div>`
          );

          new mapboxgl.Marker(el)
            .setLngLat(node.coordinates)
            .setPopup(popup)
            .addTo(map.current!);
        });

        // Add connection lines
        const lineFeatures = nodes.flatMap((node) =>
          node.connections.map((targetId) => {
            const target = nodes.find((n) => n.id === targetId);
            if (!target) return null;
            return {
              type: 'Feature' as const,
              geometry: {
                type: 'LineString' as const,
                coordinates: [node.coordinates, target.coordinates],
              },
              properties: {
                source: node.id,
                target: targetId,
              },
            };
          }).filter(Boolean)
        );

        if (map.current?.getSource('connections')) {
          (map.current.getSource('connections') as mapboxgl.GeoJSONSource).setData({
            type: 'FeatureCollection',
            features: lineFeatures as any[],
          });
        } else {
          map.current?.addSource('connections', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: lineFeatures as any[],
            },
          });

          map.current?.addLayer({
            id: 'connections',
            type: 'line',
            source: 'connections',
            paint: {
              'line-color': '#3b82f6',
              'line-width': 2,
              'line-opacity': 0.6,
            },
          });
        }
      });

      return () => {
        map.current?.remove();
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [mapboxToken, nodes]);

  if (!mapboxToken) {
    return (
      <Card className="bg-card border-border p-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Edge Topology Map</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your Mapbox public token to view the geographic distribution of edge nodes.
              Get your token at{' '}
              <a
                href="https://mapbox.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
          <Input
            type="text"
            placeholder="pk.eyJ1..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="max-w-md"
          />
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border overflow-hidden">
      <div ref={mapContainer} className="w-full h-[500px]" />
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-sm text-muted-foreground">Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-muted-foreground">Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-muted-foreground">Offline</span>
          </div>
          <Badge variant="outline" className="ml-auto">
            {nodes.length} Nodes
          </Badge>
        </div>
      </div>
    </Card>
  );
};

export default EdgeTopologyMap;
