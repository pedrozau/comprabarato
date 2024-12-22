import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for marker icons in Leaflet with Next.js
declare module 'leaflet' {
  interface Icon {
    _getIconUrl?: string;
  }
}

interface Store {
  id: number;
  name: string;
  lat: number;
  lng: number;
  address: string;
}

interface MapProps {
  stores: Store[];
  userLocation: number[];
  setLocation: () => void;
}

const StoreMap: React.FC<MapProps> = ({ stores, userLocation, setLocation }) => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/leaflet/marker-icon-2x.png',
        iconUrl: '/leaflet/marker-icon.png',
        shadowUrl: '/leaflet/marker-shadow.png',
      });
    }
  }, []);

  if (!stores.length) {
    return <div>Loading map...</div>;
  }

  const center: [number, number] = [stores[0].lat, stores[0].lng]; // Center map around the first store

  return (
    <MapContainer
      center={center}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {stores.map((store) => (
        <Marker
          key={store.id}
          position={[store.lat, store.lng]}
          title={store.name}
        >
          <Popup>
            <div>
              <strong>{store.name}</strong>
              <br />
              {store.address}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default StoreMap;
