// Convertir coordonnées en nom de ville (Reverse Geocoding)
export const getCityFromCoordinates = (lat, lng) => {
  return fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=fr`)
    .then(response => response.json())
    .then(data => {
      const city = data.address?.city || data.address?.town || data.address?.village || data.address?.county || '';
      return city;
    })
    .catch(err => {
      console.error('Erreur geocoding:', err);
      return '';
    });
};

// Convertir nom de ville en coordonnées (Forward Geocoding)
export const getCoordinatesFromCity = (city) => {
  return fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}&limit=1&accept-language=fr`)
    .then(response => response.json())
    .then(data => {
      if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
      }
      return null;
    })
    .catch(err => {
      console.error('Erreur recherche ville:', err);
      return null;
    });
};

// Coordonnées par défaut (Casablanca)
export const DEFAULT_POSITION = [33.5731, -7.5898];