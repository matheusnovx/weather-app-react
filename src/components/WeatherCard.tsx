import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { CurrentWeather, LocationData } from '../services/WeatherRepository';

interface WeatherCardProps {
  current: CurrentWeather;
  location: LocationData;
  date: string;
}

export const WeatherCard = ({ current, location, date }: WeatherCardProps) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.8}
      onPress={() => router.push({ pathname: '/details/[date]', params: { date } })}
    >
      <Text style={styles.locationText}>{location.name}, {location.region}</Text>
      <View style={styles.mainInfo}>
        <Image
          source={{ uri: `https:${current.condition.icon}` }}
          style={styles.icon}
        />
        <Text style={styles.tempText}>{current.temp_c}°C</Text>
      </View>
      <Text style={styles.conditionText}>{current.condition.text}</Text>

      <View style={styles.detailsContainer}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Humidity</Text>
          <Text style={styles.detailValue}>{current.humidity}%</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 10,
    width: '100%',
    marginBottom: 24,
  },
  locationText: {
    color: '#94A3B8',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  icon: {
    width: 80,
    height: 80,
  },
  tempText: {
    color: '#F8FAFC',
    fontSize: 64,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  conditionText: {
    color: '#E2E8F0',
    fontSize: 22,
    fontWeight: '500',
    marginBottom: 24,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#334155',
    paddingTop: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    color: '#94A3B8',
    fontSize: 14,
    marginBottom: 4,
  },
  detailValue: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
