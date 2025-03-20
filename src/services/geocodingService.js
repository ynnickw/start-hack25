import { geocode } from 'opencage-api-client';

const OPENCAGE_API_KEY = process.env.REACT_APP_OPENCAGE_API_KEY;

export const searchLocation = async (query) => {
  if (!query || query.length < 3) return [];

  try {
    const result = await geocode({
      q: query,
      key: OPENCAGE_API_KEY,
      countrycode: 'in', // Restrict to India
      language: 'en', // Get results in English
    });
    
    // Filter results to ensure they are within India
    return result.results
      .filter(item => item.components.country_code === 'in')
      .map(item => ({
        formatted: item.formatted,
        lat: item.geometry.lat,
        lng: item.geometry.lng
      }));
  } catch (error) {
    console.error('Geocoding error:', error);
    return [];
  }
};