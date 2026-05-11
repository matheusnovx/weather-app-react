import { WeatherRepository } from '../WeatherRepository';
import { StorageService } from '../StorageService';
import api from '../api';

jest.mock('../api');
jest.mock('../StorageService');

describe('WeatherRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch locations from search service', async () => {
    const mockData = [{ id: 1, name: 'London', region: 'London', country: 'UK', lat: 51.52, lon: -0.11, url: 'london-uk' }];
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockData });

    const result = await WeatherRepository.searchLocations('London');

    expect(api.get).toHaveBeenCalledWith('/search.json', { params: { q: 'London' } });
    expect(result).toEqual(mockData);
  });

  it('should save data to cache on successful forecast fetch', async () => {
    const mockForecast = { location: { name: 'London' }, current: {}, forecast: { forecastday: [] } };
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockForecast });

    const result = await WeatherRepository.getForecast('London', 3);

    expect(api.get).toHaveBeenCalledWith('/forecast.json', expect.anything());
    expect(StorageService.saveWeatherData).toHaveBeenCalledWith('London', expect.objectContaining({ location: { name: 'London' } }));
    expect(result.location.name).toBe('London');
  });

  it('should fallback to cache on network failure', async () => {
    const mockCachedForecast = { location: { name: 'London Cached' }, current: {}, forecast: { forecastday: [] } };
    
    // Simulate network failure
    (api.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    // Simulate cache hit
    (StorageService.getWeatherData as jest.Mock).mockResolvedValueOnce(mockCachedForecast);

    const result = await WeatherRepository.getForecast('London', 3);

    expect(api.get).toHaveBeenCalled();
    expect(StorageService.getWeatherData).toHaveBeenCalledWith('London');
    expect(result).toEqual(mockCachedForecast);
  });

  it('should throw error if network fails and cache is empty', async () => {
    // Simulate network failure
    (api.get as jest.Mock).mockRejectedValueOnce(new Error('Network error'));
    
    // Simulate cache miss
    (StorageService.getWeatherData as jest.Mock).mockResolvedValueOnce(null);

    await expect(WeatherRepository.getForecast('London', 3)).rejects.toThrow('Network error');
  });
});
