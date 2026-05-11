import AsyncStorage from '@react-native-async-storage/async-storage';

const CITY_KEY = '@weather_selected_city';

export class StorageService {
  static async saveSelectedCity(query: string): Promise<void> {
    try {
      await AsyncStorage.setItem(CITY_KEY, query);
    } catch (e) {
      console.error('Error saving city to storage', e);
    }
  }

  static async getSelectedCity(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(CITY_KEY);
    } catch (e) {
      console.error('Error reading city from storage', e);
      return null;
    }
  }

  static async clearSelectedCity(): Promise<void> {
    try {
      await AsyncStorage.removeItem(CITY_KEY);
    } catch (e) {
      console.error('Error clearing city from storage', e);
    }
  }

  static async saveWeatherData(query: string, data: any): Promise<void> {
    try {
      const key = `@weather_cache_${query.toLowerCase()}`;
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Error saving weather data to storage', e);
    }
  }

  static async getWeatherData(query: string): Promise<any | null> {
    try {
      const key = `@weather_cache_${query.toLowerCase()}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading weather data from storage', e);
      return null;
    }
  }
}
