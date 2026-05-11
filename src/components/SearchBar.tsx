import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { WeatherRepository, SearchResult } from '../services/WeatherRepository';
import { useDebounce } from '../hooks/useDebounce';
import { useLocationStore } from '../store/useLocationStore';
import { useFocusEffect } from 'expo-router';
export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const debouncedQuery = useDebounce(query, 500);
  const selectedCityQuery = useLocationStore((state) => state.selectedCityQuery);
  const setSelectedCity = useLocationStore((state) => state.setSelectedCity);
  const clearSelectedCity = useLocationStore((state) => state.clearSelectedCity);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setQuery('');
        setResults([]);
        setIsFocused(false);
      };
    }, [])
  );

  useEffect(() => {
    let isStale = false;

    const fetchLocations = async () => {
      if (debouncedQuery.length < 3) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const data = await WeatherRepository.searchLocations(debouncedQuery);
        if (!isStale) {
          setResults(data);
        }
      } catch (error: any) {
        if (!isStale) {
          console.log('Error fetching locations:', error);
        }
      } finally {
        if (!isStale) {
          setIsLoading(false);
        }
      }
    };

    fetchLocations();

    return () => {
      isStale = true;
    };
  }, [debouncedQuery]);

  const handleSelect = (item: SearchResult) => {
    setSelectedCity(`${item.lat},${item.lon}`);
    setQuery('');
    setResults([]);
    setIsFocused(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search for a city..."
            placeholderTextColor="#94A3B8"
            value={query}
            onChangeText={setQuery}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setTimeout(() => setIsFocused(false), 200);
            }}
          />
          {isLoading && (
            <ActivityIndicator style={styles.loader} color="#3B82F6" />
          )}
        </View>

        {selectedCityQuery && (
          <TouchableOpacity style={styles.locationButton} onPress={clearSelectedCity} activeOpacity={0.8}>
            <Text style={styles.locationIcon}>📍</Text>
          </TouchableOpacity>
        )}
      </View>

      {isFocused && query.length >= 3 && !isLoading && results.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No cities found.</Text>
        </View>
      )}

      {isFocused && results.length > 0 && (
        <View style={styles.resultsContainer}>
          <FlatList
            data={results}
            keyExtractor={(item) => item.id.toString()}
            keyboardShouldPersistTaps="handled"
            style={{ maxHeight: 250 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.resultItem} onPress={() => handleSelect(item)}>
                <Text style={styles.resultName}>{item.name}</Text>
                <Text style={styles.resultRegion}>{item.region}, {item.country}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    zIndex: 10,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    width: '100%',
  },
  inputContainer: {
    flex: 1,
    position: 'relative',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  locationButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    height: 54,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  locationIcon: {
    fontSize: 18,
  },
  loader: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  resultsContainer: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    maxHeight: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  resultItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  resultName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0F172A',
  },
  resultRegion: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  emptyState: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  emptyText: {
    color: '#64748B',
  },
});
