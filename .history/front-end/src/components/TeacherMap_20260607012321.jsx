// src/components/TeacherMap.jsx
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fixer l'icône Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function TeacherMap({ enseignants, selectedCity, onCitySelect }) {
  const [position, setPosition] = useState([33.5731, -7.5898]); // Casablanca par défaut

  // Coordonnées des villes principales
  const cityCoordinates = {
    'Casablanca': [33.5731, -7.5898],
    'Rabat': [34.0209, -6.8416],
    'Marrakech': [31.6295, -7.9811],
    'Tanger': [35.7595, -5.8340],
    'Fès': [34.0331, -5.0003],
    'Agadir': [30.4278, -9.5981],
    'Meknès': [33.8935, -5.5547],
    'Oujda': [34.6861, -1.9114],
    'Tétouan': [35.5785, -5.3754],
    'Laayoune': [27.1536, -13.2033],
    'Kenitra': [34.2610, -6.5802],
    'Safi': [32.2994, -9.2372],
    'En ligne': [33.5731, -7.5898],
  };

  useEffect(() => {
    if (selectedCity && cityCoordinates[selectedCity]) {
      setPosition(cityCoordinates[selectedCity]);
    }
  }, [selectedCity]);

  return (
    <MapContainer
      center={position}
      zoom={8}
      style={{ height: '400px', width: '100%', borderRadius: '16px' }}
    >
      <ChangeView center={position} zoom={8} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      {/* Marqueurs pour les villes des enseignants */}
      {enseignants && enseignants.map((prof, idx) => {
        const city = prof.user?.ville;
        const coords = cityCoordinates[city];
        if (!coords) return null;
        
        return (
          <Marker
            key={idx}
            position={coords}
            eventHandlers={{
              click: () => onCitySelect(city)
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>{prof.user?.prenom} {prof.user?.nom}</strong>
                <br />
                <span style={{ fontSize: '12px' }}>{city}</span>
                <br />
                <span style={{ fontSize: '12px', color: '#0d6efd' }}>{prof.tarifHeure} DH/h</span>
                <br />
                <button
                  onClick={() => window.location.href = `/teachers/${prof.utilisateur_id}`}
                  style={{
                    marginTop: '8px',
                    padding: '4px 12px',
                    background: '#0d6efd',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '11px'
                  }}
                >
                  Voir le profil
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default TeacherMap;