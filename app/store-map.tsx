'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Adicione esta declaração no topo do arquivo, após os imports
declare module 'leaflet' {
  interface Icon {
    _getIconUrl?: string;
  }
}

interface MapProps {
  stores: {
    id: number;
    name: string;
    lat: number;
    lng: number;
    address: string;
  }[];
  userLocation: [number, number];
  setLocation: (location: { lat: number; lng: number }) => void;
}

interface DraggableMarkerProps {
  location: [number, number];
  setLocation: (location: { lat: number; lng: number }) => void;
}

function DraggableMarker({ location, setLocation }: DraggableMarkerProps) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location[0], location[1]], 13);
    }
  }, [location, map]);

  return location ? (
    <Marker
      draggable={true}
      position={[location[0], location[1]]}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          setLocation({ lat: position.lat, lng: position.lng });
        },
      }}
    />
  ) : null;
}

const StoreMap: React.FC<MapProps> = ({ stores, userLocation, setLocation }) => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      });
    }
  }, []);

  // Exibe um carregamento se `location` for nulo
  if (!userLocation) {
    return <div>Loading map...</div>;
  }

  return (
    <MapContainer
      center={[userLocation[0], userLocation[1]]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <DraggableMarker location={userLocation} setLocation={setLocation} />
    </MapContainer>
  );
}

export default StoreMap;
