import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { WeatherDay } from '../services/WeatherRepository';

interface Props {
  forecastDays: WeatherDay[];
}

export function ForecastList({ forecastDays }: Props) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Next 2 Days</Text>
      <View style={styles.listContainer}>
        {forecastDays.map((item) => {
          const dateObj = new Date(item.date);
          const dateLocal = new Date(dateObj.getTime() + Math.abs(dateObj.getTimezoneOffset() * 60000));
          const dayName = dateLocal.toLocaleDateString('en-US', { weekday: 'short' });

          return (
            <TouchableOpacity
              key={item.date}
              style={styles.itemContainer}
              onPress={() => router.push(`/details/${item.date}` as any)}
            >
              <Text style={styles.dayText}>{dayName}</Text>
              <Image
                source={{ uri: `https:${item.day.condition.icon}` }}
                style={styles.icon}
              />
              <View style={styles.tempContainer}>
                <Text style={styles.maxTemp}>{item.day.maxtemp_c}°</Text>
                <Text style={styles.minTemp}>{item.day.mintemp_c}°</Text>
              </View>
              <Text style={styles.humidityText}>💧 {item.day.avghumidity}%</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  listContainer: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  itemContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
  },
  icon: {
    width: 50,
    height: 50,
    marginBottom: 8,
  },
  tempContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  maxTemp: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  minTemp: {
    fontSize: 16,
    fontWeight: '500',
    color: '#94A3B8',
  },
  humidityText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
});
