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

    // Group servers by location
    const serversByLocation: Record<string, Server[]> = {};
    servers.forEach(server => {
      const location = server.location || 'US-East';
      if (!serversByLocation[location]) {
        serversByLocation[location] = [];
      }
      serversByLocation[location].push(server);
    });

    // Create markers for each location
    Object.entries(serversByLocation).forEach(([location, locationServers]) => {
      const coords = serverLocations[location] || serverLocations['US-East'];
      
      const healthyCount = locationServers.filter(s => s.status === 'healthy').length;
      const warningCount = locationServers.filter(s => s.status === 'warning').length;
      const criticalCount = locationServers.filter(s => s.status === 'critical').length;

      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.cursor = 'pointer';
      
      const statusColor = criticalCount > 0 ? '#ef4444' : warningCount > 0 ? '#f59e0b' : '#10b981';
      
      el.innerHTML = `
        <div style="
          width: 100%;
          height: 100%;
          background: ${statusColor};
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 14px;
          color: white;
          box-shadow: 0 0 20px ${statusColor}80;
          transition: transform 0.2s;
        ">
          ${locationServers.length}
        </div>
      `;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.style.padding = '8px';
      popupContent.innerHTML = `
        <div style="min-width: 200px;">
          <h3 style="font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #f1f5f9;">${coords.city}</h3>
          <p style="font-size: 12px; color: #94a3b8; margin-bottom: 12px;">${coords.region}</p>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 13px; color: #cbd5e1;">Total Servers:</span>
              <span style="font-weight: bold; color: #f1f5f9;">${locationServers.length}</span>
            </div>
            ${healthyCount > 0 ? `
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px; color: #10b981;">Healthy:</span>
                <span style="font-weight: bold; color: #10b981;">${healthyCount}</span>
              </div>
            ` : ''}
            ${warningCount > 0 ? `
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px; color: #f59e0b;">Warning:</span>
                <span style="font-weight: bold; color: #f59e0b;">${warningCount}</span>
              </div>
            ` : ''}
            ${criticalCount > 0 ? `
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 13px; color: #ef4444;">Critical:</span>
                <span style="font-weight: bold; color: #ef4444;">${criticalCount}</span>
              </div>
            ` : ''}
          </div>
        </div>
      `;

      const popup = new mapboxgl.Popup({ 
        offset: 25,
        className: 'custom-popup'
      }).setDOMContent(popupContent);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([coords.lng, coords.lat])
        .setPopup(popup)
        .addTo(map.current!);

      el.addEventListener('click', () => {
        if (onServerSelect && locationServers.length > 0) {
          onServerSelect(locationServers[0]);
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
