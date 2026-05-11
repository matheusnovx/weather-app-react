import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useTimeAgo } from '../hooks/useTimeAgo';

interface TimeAgoLabelProps {
  timestamp?: number;
}

export const TimeAgoLabel = React.memo(({ timestamp }: TimeAgoLabelProps) => {
  const timeAgo = useTimeAgo(timestamp);

  if (!timeAgo) {
    return null;
  }

  return <Text style={styles.timeAgoText}>{timeAgo}</Text>;
});

const styles = StyleSheet.create({
  timeAgoText: {
    color: '#94A3B8',
    fontSize: 12,
    marginBottom: 12,
    alignSelf: 'flex-end',
    fontWeight: '500',
  },
});
