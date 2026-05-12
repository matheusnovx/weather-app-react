import { useState, useEffect } from 'react';

export function useTimeAgo(timestamp: number) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const diffInSeconds = Math.floor((Date.now() - timestamp) / 1000);
      if (diffInSeconds < 60) {
        setTimeAgo('Updated just now');
      } else if (diffInSeconds < 3600) {
        setTimeAgo(`Updated ${Math.floor(diffInSeconds / 60)} min ago`);
      } else {
        setTimeAgo(`Updated ${Math.floor(diffInSeconds / 3600)} h ago`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [timestamp]);

  return timeAgo;
}
