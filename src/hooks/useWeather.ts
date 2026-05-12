import { useQuery } from '@tanstack/react-query';
import { WeatherRepository } from '../services/WeatherRepository';
import { LocationService } from '../services/LocationService';
import { useLocationStore } from '../store/useLocationStore';

export function useWeather() {
  const selectedCityQuery = useLocationStore((state) => state.selectedCityQuery);

  return useQuery({
    queryKey: ['weather', selectedCityQuery],
    queryFn: async () => {
      try {
        if (selectedCityQuery) {
          return await WeatherRepository.getForecast(selectedCityQuery, 3);
        }

        const coords = await LocationService.getCurrentLocation();
        if (coords) {
          const query = `${coords.latitude},${coords.longitude}`;
          return await WeatherRepository.getForecast(query, 3);
        }
      } catch (error: any) {
        // Fallback to SP
        console.log('Location unavailable, falling back to default city. Error:', error.message);
        return await WeatherRepository.getForecast('São Paulo', 3);
      }
    },
    retry: false,
  });
}
