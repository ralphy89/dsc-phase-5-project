import { useState, useEffect } from 'react';
import API_BASE_URL from '../config/api';

// Hook personnalisé pour gérer la configuration API dynamique
export const useAPI = () => {
  const [apiUrl, setApiUrl] = useState(API_BASE_URL);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setApiUrl(API_BASE_URL);
  }, []);

  return { apiUrl, isLoading, error };
};

export default useAPI;
