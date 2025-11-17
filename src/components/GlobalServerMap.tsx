import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Server } from '@/types/digitalTwin';
import { Badge } from './ui/badge';
import { Card } from './ui/card';
import { Server as ServerIcon, Database, Zap } from 'lucide-react';

interface GlobalServerMapProps {
  servers: Server[];
  onServerSelect?: (server: Server) => void;
}

// Server locations mapped to real-world coordinates
const serverLocations: Record<string, { lat: number; lng: number; city: string; region: string }> = {
  'US-East': { lat: 40.7128, lng: -74.0060, city: 'New York', region: 'US East' },
  'US-West': { lat: 37.7749, lng: -122.4194, city: 'San Francisco', region: 'US West' },
  'EU-Central': { lat: 50.1109, lng: 8.6821, city: 'Frankfurt', region: 'EU Central' },
  'AP-Southeast': { lat: 1.3521, lng: 103.8198, city: 'Singapore', region: 'AP Southeast' },
  'UK-South': { lat: 51.5074, lng: -0.1278, city: 'London', region: 'UK South' },
  'AU-East': { lat: -33.8688, lng: 151.2093, city: 'Sydney', region: 'AU East' },
};

const GlobalServerMap = ({ servers, onServerSelect }: GlobalServerMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState('');

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    // Initialize map
    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      projection: 'globe' as any,
      zoom: 1.5,
      center: [30, 20],
    });

    // Add navigation controls
    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add atmosphere and fog effects
    map.current.on('style.load', () => {
      map.current?.setFog({
        color: 'rgb(30, 40, 50)',
        'high-color': 'rgb(50, 60, 80)',
        'horizon-blend': 0.4,
      });
    });

    // Cleanup
    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [mapboxToken]);

  // Update markers when servers change
  useEffect(() => {
    if (!map.current || !mapboxToken) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Create individual markers for each server with slight offset for same location
    const locationOffsets: Record<string, number> = {};
    
    servers.forEach(server => {
      const location = server.location || 'US-East';
      const coords = serverLocations[location] || serverLocations['US-East'];
      
      // Calculate offset for servers in same location
      if (!locationOffsets[location]) {
        locationOffsets[location] = 0;
      }
      const offsetIndex = locationOffsets[location];
      locationOffsets[location]++;
      
      // Apply small random offset to prevent exact overlap
      const offsetLat = coords.lat + (Math.random() - 0.5) * 0.3 + (offsetIndex * 0.1);
      const offsetLng = coords.lng + (Math.random() - 0.5) * 0.3 + (offsetIndex * 0.1);

      // Determine status color
      const statusColor = 
        server.status === 'critical' ? '#ef4444' :
        server.status === 'warning' ? '#f59e0b' :
        server.status === 'maintenance' ? '#94a3b8' :
        '#10b981';
      
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '32px';
      el.style.height = '32px';
      el.style.cursor = 'pointer';
      
      el.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          background: ${statusColor};
          border: 2px solid rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px ${statusColor}80;
          transition: all 0.2s;
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
            <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
            <line x1="6" y1="6" x2="6.01" y2="6"></line>
            <line x1="6" y1="18" x2="6.01" y2="18"></line>
          </svg>
        </div>
      `;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.3)';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.style.padding = '8px';
      popupContent.innerHTML = `
        <div style="min-width: 220px;">
          <h3 style="font-weight: bold; font-size: 15px; margin-bottom: 4px; color: #f1f5f9;">${server.name}</h3>
          <p style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">${coords.city}, ${coords.region}</p>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 12px; color: #cbd5e1;">Status:</span>
              <span style="font-weight: bold; color: ${statusColor}; text-transform: capitalize;">${server.status}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 12px; color: #cbd5e1;">CPU:</span>
              <span style="font-weight: bold; color: #f1f5f9;">${server.telemetry.cpu}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 12px; color: #cbd5e1;">Memory:</span>
              <span style="font-weight: bold; color: #f1f5f9;">${server.telemetry.memory}%</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 12px; color: #cbd5e1;">Temp:</span>
              <span style="font-weight: bold; color: #f1f5f9;">${server.telemetry.temperature}°C</span>
            </div>
          </div>
          <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #334155;">
            <p style="font-size: 11px; color: #64748b; text-align: center;">Click for detailed telemetry</p>
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ 
        offset: 20,
        className: 'custom-popup'
      }).setDOMContent(popupContent);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([offsetLng, offsetLat])
        .setPopup(popup)
        .addTo(map.current!);

      el.addEventListener('click', () => {
        if (onServerSelect) {
          onServerSelect(server);
        }
      });

      markersRef.current.push(marker);
    });
  }, [servers, onServerSelect, mapboxToken]);

  if (!mapboxToken) {
    return (
      <Card className="p-8">
        <div className="text-center space-y-4">
          <ServerIcon className="w-16 h-16 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Mapbox Token Required</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Enter your Mapbox public token to view the global server map
            </p>
            <input
              type="text"
              placeholder="pk.eyJ1..."
              className="w-full max-w-md px-4 py-2 bg-input border border-border rounded-lg text-foreground"
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Get your token at{' '}
              <a
                href="https://mapbox.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-[600px] rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
      <div className="absolute top-4 left-4 space-y-2 pointer-events-none">
        <Badge className="bg-card/90 backdrop-blur-sm border-border pointer-events-auto">
          <ServerIcon className="w-3 h-3 mr-1" />
          Global Server Distribution
        </Badge>
      </div>
      <style>{`
        .custom-popup .mapboxgl-popup-content {
          background: hsl(222 47% 11%);
          border: 1px solid hsl(215 30% 20%);
          border-radius: 8px;
          padding: 0;
          box-shadow: 0 10px 40px -10px hsl(187 85% 48% / 0.3);
        }
        .custom-popup .mapboxgl-popup-tip {
          border-top-color: hsl(222 47% 11%);
        }
        .mapboxgl-ctrl-group {
          background: hsl(222 47% 11%);
          border: 1px solid hsl(215 30% 20%);
        }
        .mapboxgl-ctrl button {
          background-color: transparent;
        }
        .mapboxgl-ctrl button:hover {
          background-color: hsl(215 25% 18%);
        }
      `}</style>
    </div>
  );
};

export default GlobalServerMap;
