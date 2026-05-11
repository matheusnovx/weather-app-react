import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, StatusBar, RefreshControl, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useWeather } from '../src/hooks/useWeather';
import { WeatherCard } from '../src/components/WeatherCard';
import { ForecastList } from '../src/components/ForecastList';
import { SkeletonLoader } from '../src/components/SkeletonLoader';
import { ErrorView } from '../src/components/ErrorView';
import { SearchBar } from '../src/components/SearchBar';
import { useLocationStore } from '../src/store/useLocationStore';
import { TimeAgoLabel } from '../src/components/TimeAgoLabel';

export default function Home() {
  const initStore = useLocationStore((state) => state.init);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    initStore();
  }, [initStore]);

  const { data, isLoading, isError, refetch } = useWeather();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.searchContainer}>
        <SearchBar />
      </View>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#3B82F6']}
            tintColor="#3B82F6"
          />
        }
      >

        {isLoading && !refreshing && <SkeletonLoader />}

        {isError && !data && (
          <ErrorView
            message="We couldn't fetch the weather data. Please check your connection and try again."
            onRetry={refetch}
          />
        )}

        {data && (
          <View style={styles.content}>
            <TimeAgoLabel timestamp={data.lastUpdated} />
            <WeatherCard
              current={data.current}
              location={data.location}
              date={data.forecast.forecastday[0].date}
            />
            <ForecastList forecastDays={data.forecast.forecastday.slice(1)} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    width: '100%',
    zIndex: 10,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
});
