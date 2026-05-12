import api from './api';

export interface WeatherHour {
  time_epoch: number;
  time: string;
  temp_c: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
}

export interface WeatherDay {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    avgtemp_c: number;
    avghumidity: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
  };
  hour: WeatherHour[];
}

export interface CurrentWeather {
  temp_c: number;
  humidity: number;
  condition: {
    text: string;
    icon: string;
    code: number;
  };
}

export interface LocationData {
  name: string;
  region: string;
  country: string;
}

export interface ForecastResponse {
  location: LocationData;
  current: CurrentWeather;
  forecast: {
    forecastday: WeatherDay[];
  };
  lastUpdated: number;
}

export interface SearchResult {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

export class WeatherRepository {
  static async getForecast(query: string, days: number = 3): Promise<ForecastResponse> {
    const response = await api.get<ForecastResponse>('/forecast.json', {
      params: {
        q: query,
        days,
        aqi: 'no',
        alerts: 'no',
      },
    });
    const data = response.data;
    data.lastUpdated = Date.now();
    return data;
  }

  static async searchLocations(query: string): Promise<SearchResult[]> {
    const response = await api.get<SearchResult[]>('/search.json', {
      params: {
        q: query,
      },
    });
    return response.data;
  }
}
