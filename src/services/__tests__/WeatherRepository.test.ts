import { WeatherRepository } from '../WeatherRepository';
import api from '../api';

jest.mock('../api');

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

  it('should fetch forecast and append lastUpdated timestamp', async () => {
    const mockForecast = { location: { name: 'London' }, current: {}, forecast: { forecastday: [] } };
    (api.get as jest.Mock).mockResolvedValueOnce({ data: mockForecast });

    const before = Date.now();
    const result = await WeatherRepository.getForecast('London', 3);
    const after = Date.now();

    expect(api.get).toHaveBeenCalledWith('/forecast.json', {
      params: {
        q: 'London',
        days: 3,
        aqi: 'no',
        alerts: 'no'
      }
    });
    
    expect(result.location.name).toBe('London');
    expect(result.lastUpdated).toBeGreaterThanOrEqual(before);
    expect(result.lastUpdated).toBeLessThanOrEqual(after);
  });

  it('should propagate errors from the api directly', async () => {
    const networkError = new Error('Network error');
    (api.get as jest.Mock).mockRejectedValueOnce(networkError);

    await expect(WeatherRepository.getForecast('London', 3)).rejects.toThrow('Network error');
  });
});
