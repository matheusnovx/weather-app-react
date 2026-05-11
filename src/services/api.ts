import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.weatherapi.com/v1',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
  if (apiKey) {
    config.params = {
      ...config.params,
      key: apiKey,
    };
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;
