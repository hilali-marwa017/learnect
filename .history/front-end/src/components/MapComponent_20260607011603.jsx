// src/components/MapComponent.jsx
import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fixer l'icône par défaut Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Composant pour centrer la carte
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

function MapComponent({ position, onPositionChange, height = '250px' }) {
  const handleClick = (e) => {
    const { lat, lng } = e.latlng;
    onPositionChange([lat, lng]);
  };

  const handleDragEnd = (e) => {
    const { lat, lng } = e.target.getLatLng();
    onPositionChange([lat, lng]);
  };

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: height, width: '100%', borderRadius: '12px', marginBottom: '15px' }}
      onClick={handleClick}
    >
      <ChangeView center={position} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker
        position={position}
        draggable={true}
        eventHandlers={{ dragend: handleDragEnd }}
      />
    </MapContainer>
  );
}

export default MapComponent;