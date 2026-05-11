import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import Home from '../index';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import MockAdapter from 'axios-mock-adapter';
import api from '../../src/services/api';

// Mock Expo Router
jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
  Stack: { Screen: () => null },
  useFocusEffect: jest.fn((cb) => cb()),
}));

jest.mock('../../src/services/LocationService', () => ({
  LocationService: {
    getCurrentLocation: jest.fn().mockResolvedValue({ latitude: -23.5505, longitude: -46.6333 }),
  },
}));

const mockApi = new MockAdapter(api);

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

const renderWithClient = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient();
  return render(<QueryClientProvider client={testQueryClient}>{ui}</QueryClientProvider>);
};

const mockData = {
  location: { name: 'New York', region: 'NY', country: 'USA' },
  current: { temp_c: 25, humidity: 60, condition: { text: 'Sunny', icon: '//cdn.weatherapi.com/weather/64x64/day/113.png', code: 1000 } },
  forecast: {
    forecastday: [
      { date: '2026-05-10', day: { maxtemp_c: 28, mintemp_c: 20, avghumidity: 50, condition: { text: 'Sunny', icon: '', code: 1000 } }, hour: [] },
      { date: '2026-05-11', day: { maxtemp_c: 27, mintemp_c: 19, avghumidity: 55, condition: { text: 'Cloudy', icon: '', code: 1003 } }, hour: [] }
    ]
  },
  lastUpdated: Date.now() - 60000,
};

describe('Home Screen', () => {
  beforeEach(() => {
    mockApi.reset();
    jest.clearAllMocks();
  });

  it('renders loading state correctly initially', () => {
    mockApi.onGet('/forecast.json').reply(200, mockData);

    const { queryByPlaceholderText } = renderWithClient(<Home />);
    expect(queryByPlaceholderText('Search for a city...')).toBeTruthy();
  });

  it('renders error state correctly on network failure', async () => {
    mockApi.onGet('/forecast.json').networkError();

    const { findByText, getByText } = renderWithClient(<Home />);

    expect(await findByText("We couldn't fetch the weather data. Please check your connection and try again.")).toBeTruthy();
    expect(getByText('Try Again')).toBeTruthy();
  });

  it('renders success state with weather data', async () => {
    mockApi.onGet('/forecast.json').reply(200, mockData);

    const { findByText, getByText } = renderWithClient(<Home />);

    expect(await findByText('New York, NY')).toBeTruthy();
    expect(getByText('25°C')).toBeTruthy();
    expect(getByText('Sunny')).toBeTruthy();
    expect(getByText('60%')).toBeTruthy();

    expect(getByText('Next 2 Days')).toBeTruthy();

    expect(getByText('27°')).toBeTruthy();
  });
});
