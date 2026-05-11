import React, { useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export function SkeletonLoader() {
  const animatedValue = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const opacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.card, { opacity }]} />
      <View style={styles.listContainer}>
        <Animated.View style={[styles.listItem, { opacity }]} />
        <Animated.View style={[styles.listItem, { opacity }]} />
        <Animated.View style={[styles.listItem, { opacity }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    width: '100%',
  },
  card: {
    height: 300,
    backgroundColor: '#CBD5E1',
    borderRadius: 24,
    marginBottom: 40,
    width: '100%',
  },
  listContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  listItem: {
    height: 160,
    width: 100,
    backgroundColor: '#CBD5E1',
    borderRadius: 20,
  },
});
