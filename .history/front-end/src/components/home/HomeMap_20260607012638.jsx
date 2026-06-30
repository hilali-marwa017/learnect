// src/components/home/HomeMap.jsx
import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
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

function HomeMap({ enseignants }) {
  const navigate = useNavigate();
  const [position, setPosition] = useState([33.5731, -7.5898]); // Casablanca

  // Coordonnées des villes
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
    'Kenitra': [34.2610, -6.5802],
    'Safi': [32.2994, -9.2372],
    'El Jadida': [33.2316, -8.5007],
    'Nador': [35.1681, -2.9275],
    'Settat': [33.0011, -7.6167],
    'Beni Mellal': [32.3394, -6.3608],
    'Laayoune': [27.1536, -13.2033],
  };

  return (
    <MapContainer
      center={position}
      zoom={7}
      style={{ height: '450px', width: '100%', borderRadius: '20px' }}
    >
      <ChangeView center={position} zoom={7} />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      
      {/* Marqueurs pour les enseignants */}
      {enseignants && enseignants.map((prof, idx) => {
        const city = prof.user?.ville;
        const coords = cityCoordinates[city];
        if (!coords) return null;
        
        return (
          <Marker
            key={idx}
            position={coords}
          >
            <Popup>
              <div style={{ textAlign: 'center', padding: '4px', minWidth: '160px' }}>
                <div style={{
                  width: '40px', height: '40px',
                  borderRadius: '50%',
                  background: '#EFF6FF',
                  display: 'flex', alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 8px',
                  overflow: 'hidden'
                }}>
                  {prof.user?.photo ? (
                    <img 
                      src={`http://localhost:8000/storage/${prof.user.photo}`}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <i className="bi bi-person" style={{ fontSize: '20px', color: '#0d6efd' }}></i>
                  )}
                </div>
                <strong>{prof.user?.prenom} {prof.user?.nom}</strong>
                <br />
                <span style={{ fontSize: '12px', color: '#6B7280' }}>{city}</span>
                <br />
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#0d6efd' }}>
                  {prof.tarifHeure} DH/h
                </span>
                <div style={{ marginTop: '8px' }}>
                  <button
                    onClick={() => navigate(`/teachers/${prof.utilisateur_id}`)}
                    style={{
                      padding: '6px 14px',
                      background: '#0d6efd',
                      color: 'white',
                      border: 'none',
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}
                  >
                    Voir le profil
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}

export default HomeMap;