import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
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
  const { width: screenWidth } = useWindowDimensions();

  const selectedDay = useMemo(() => {
    if (!data || !date) return null;
    return data.forecast.forecastday.find((d) => d.date === date);
  }, [data, date]);

  const chartData = useMemo(() => {
    if (!selectedDay) return [];
    return selectedDay.hour.map((h, index) => {
      const timeString = h.time.split(' ')[1];
      const isEven = index % 3 === 0;

      return {
        value: h.temp_c,
        label: isEven ? timeString : '',
        timeString: timeString,
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

  const chartWidth = Math.max(screenWidth - 126, 250);

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: 'Forecast Details', headerBackTitle: 'Back' }} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{dayName}</Text>
          <Text style={styles.subtitle}>Hourly Forecast</Text>
        </View>

        <View style={styles.chartContainer}>
          <MemoizedLineChart
            data={chartData}
            width={chartWidth}
            height={220}
            spacing={45}
            initialSpacing={15}
            color="#6366F1"
            thickness={4}
            curved
            areaChart
            startFillColor="#6366F1"
            endFillColor="#EEF2FF"
            startOpacity={0.6}
            endOpacity={0.05}
            noOfSections={5}
            yAxisColor="transparent"
            yAxisThickness={0}
            rulesType="dashed"
            rulesColor="#E2E8F0"
            yAxisTextStyle={{ color: '#94A3B8', fontSize: 11 }}
            xAxisColor="#E2E8F0"
            xAxisThickness={1}
            xAxisLabelTextStyle={{ color: '#64748B', fontSize: 11 }}
            hideDataPoints={true}
            isAnimated
            animationDuration={1200}
            pointerConfig={{
              pointerStripHeight: 180,
              pointerStripColor: '#e1cbcbff',
              pointerStripWidth: 2,
              pointerColor: '#6366F1',
              radius: 6,
              pointerLabelWidth: 80,
              pointerLabelHeight: 60,
              activatePointersOnLongPress: false,
              autoAdjustPointerLabelPosition: true,
              pointerStripUptoDataPoint: true,
              pointerLabelComponent: (items: any) => {
                if (!items || !items[0]) return null;
                return (
                  <View style={{
                    height: 60,
                    width: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#1E293B',
                    borderRadius: 12,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.2,
                    shadowRadius: 8,
                    elevation: 5,
                  }}>
                    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>{items[0].value}°</Text>
                    <Text style={{ color: '#94A3B8', fontSize: 12 }}>{items[0].timeString}</Text>
                  </View>
                );
              },
            }}
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
    overflow: 'visible',
    paddingTop: 40,
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
