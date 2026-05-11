import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { LineChart } from 'react-native-gifted-charts';
import { useWeather } from '../../src/hooks/useWeather';
import { ErrorView } from '../../src/components/ErrorView';

const MemoizedLineChart = React.memo(LineChart);

export default function DetailsScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const router = useRouter();
  const { data, isLoading, isError } = useWeather();

  const selectedDay = useMemo(() => {
    if (!data || !date) return null;
    return data.forecast.forecastday.find((d) => d.date === date);
  }, [data, date]);

  const chartData = useMemo(() => {
    if (!selectedDay) return [];
    return selectedDay.hour.map((h, index) => {
      // Extract hour from "YYYY-MM-DD HH:MM"
      const timeString = h.time.split(' ')[1]; 
      const isEven = index % 3 === 0; // Show label every 3 hours to avoid clutter
      
      return {
        value: h.temp_c,
        label: isEven ? timeString : '',
        dataPointText: h.temp_c.toString(),
      };
    });
  }, [selectedDay]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Loading...' }} />
        <Text>Loading details...</Text>
      </SafeAreaView>
    );
  }

  if (isError || !selectedDay) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen options={{ title: 'Error' }} />
        <ErrorView 
          message="Could not load the details for this day." 
          onRetry={() => router.back()} 
        />
      </SafeAreaView>
    );
  }

  const dateObj = new Date(selectedDay.date);
  const dateLocal = new Date(dateObj.getTime() + Math.abs(dateObj.getTimezoneOffset() * 60000));
  const dayName = dateLocal.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Forecast Details', headerBackTitle: 'Back' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{dayName}</Text>
          <Text style={styles.subtitle}>Hourly Temperature Variation</Text>
        </View>

        <View style={styles.chartContainer}>
          <MemoizedLineChart
            data={chartData}
            width={300}
            height={220}
            spacing={40}
            initialSpacing={10}
            color="#3B82F6"
            thickness={3}
            startFillColor="rgba(59, 130, 246, 0.3)"
            endFillColor="rgba(59, 130, 246, 0.01)"
            startOpacity={0.9}
            endOpacity={0.2}
            noOfSections={5}
            yAxisColor="#E2E8F0"
            yAxisThickness={1}
            rulesType="solid"
            rulesColor="#F1F5F9"
            yAxisTextStyle={{ color: '#64748B' }}
            xAxisColor="#E2E8F0"
            xAxisThickness={1}
            dataPointsColor="#2563EB"
            dataPointsRadius={4}
            textColor="#0F172A"
            textFontSize={10}
            textShiftY={-8}
            textShiftX={-5}
            isAnimated
            animationDuration={1200}
            hideDataPoints={false}
          />
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Max Temp</Text>
            <Text style={styles.summaryValue}>{selectedDay.day.maxtemp_c}°C</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Min Temp</Text>
            <Text style={styles.summaryValue}>{selectedDay.day.mintemp_c}°C</Text>
          </View>
          <View style={styles.summaryBox}>
            <Text style={styles.summaryLabel}>Humidity</Text>
            <Text style={styles.summaryValue}>{selectedDay.day.avghumidity}%</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 24,
    alignItems: 'center',
  },
  header: {
    width: '100%',
    marginBottom: 32,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  chartContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    paddingRight: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 32,
    alignItems: 'center',
    width: '100%',
    overflow: 'hidden',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
  },
});
