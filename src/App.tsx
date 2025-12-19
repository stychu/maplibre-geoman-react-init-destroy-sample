import { useEffect, useRef, useState } from 'react';
import { Geoman } from '@geoman-io/maplibre-geoman-free';
import '@geoman-io/maplibre-geoman-free/dist/maplibre-geoman.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Map as MapGL } from '@vis.gl/react-maplibre';
import type { Map } from 'maplibre-gl';
import  maplibre from 'maplibre-gl';

const mapStyle = {
  version: 8 as const,
  sources: {
    'osm-tiles': {
      type: 'raster' as const,
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm-tiles',
      type: 'raster' as const,
      source: 'osm-tiles',
    },
  ],
};

function useGeoman(
  map: Map | null,
) {
  const geomanRef = useRef<Geoman | null>(null);

  useEffect(() => {
    if (!map) return;


    geomanRef.current = new Geoman(map, {});

    return () => {
      geomanRef.current?.destroy({ removeSources: true });
      geomanRef.current = null;
    };
  }, [map]);

  return geomanRef.current;
}

function MapInstance() {
  const mapRef = useRef<{ getMap: () => Map } | null>(null);
  const [map, setMap] = useState<Map | null>(null);

  useGeoman(map);
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '300px' }}>  
      <MapGL
        ref={mapRef}
        mapStyle={mapStyle}
        initialViewState={{ longitude: Math.random() * 20 - 10, latitude: 51, zoom: 5 }}
        style={{ width: '100%', height: '100%' }}
        onLoad={() => {
          setMap(mapRef.current?.getMap() ?? null)

          mapRef.current?.getMap().addControl(
            new maplibre.NavigationControl(),
            "top-left"
          );
        }}
      />
    </div>
  );
}

export default function App() {

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      <MapInstance />
    </div>
  );
}
