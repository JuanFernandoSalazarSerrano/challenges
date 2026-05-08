const OPENCAGE_API_KEY = 'YOUR_OPENCAGE_API_KEY';

export interface Place {
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
}

export const placesService = {
  getNearestPlaces: async (
    latitude: number,
    longitude: number,
    radius: number = 5000
  ): Promise<Place[]> => {
    try {
      if (OPENCAGE_API_KEY === 'YOUR_OPENCAGE_API_KEY') {
        console.warn('OpenCage API key not configured');
        return [];
      }

      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/reverse?key=${OPENCAGE_API_KEY}&q=${latitude}+${longitude}&limit=10`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch places');
      }

      const data = await response.json();
      return data.results.map((result: any) => ({
        name: result.formatted,
        latitude: result.geometry.lat,
        longitude: result.geometry.lng,
        distance: calculateDistance(latitude, longitude, result.geometry.lat, result.geometry.lng),
      }));
    } catch (error) {
      console.error('Error fetching places:', error);
      return [];
    }
  },

  searchAddress: async (latitude: number, longitude: number): Promise<string> => {
    try {
      if (OPENCAGE_API_KEY === 'YOUR_OPENCAGE_API_KEY') {
        return `${latitude}, ${longitude}`;
      }

      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/reverse?key=${OPENCAGE_API_KEY}&q=${latitude}+${longitude}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }

      const data = await response.json();
      return data.results[0]?.formatted || `${latitude}, ${longitude}`;
    } catch (error) {
      console.error('Error fetching address:', error);
      return `${latitude}, ${longitude}`;
    }
  },
};

const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 1000);
};
