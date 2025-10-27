// Configuration dynamique de l'API
const getAPIUrl = () => {
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // Si on est sur localhost, on utilise localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:5050';
    }
    
    // Sinon, on utilise l'hostname (qui sera l'IP locale)
    return `http://${hostname}:5050`;
  }
  
  // Fallback pour le serveur
  return 'http://localhost:5050';
};

// Configuration de l'API avec détection automatique
const API_BASE_URL = getAPIUrl();

export default API_BASE_URL;
