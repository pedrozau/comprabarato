'use client';

import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

interface MapProps {
  location: { lat: number; lng: number } | null;
  setLocation: (location: { lat: number; lng: number }) => void;
}

function DraggableMarker({ location, setLocation }: MapProps) {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location.lat, location.lng], 13);
    }
  }, [location, map]);

  return location ? (
    <Marker
      draggable={true}
      position={[location.lat, location.lng]}
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

export default function Map({ location, setLocation }: MapProps) {
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
  if (!location) {
    return <div>Loading map...</div>;
  }

  return (
    <MapContainer
      center={[location.lat, location.lng]}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <DraggableMarker location={location} setLocation={setLocation} />
    </MapContainer>
  );
}
