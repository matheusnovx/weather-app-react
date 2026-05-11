import { useState, useEffect } from 'react';

export function useTimeAgo(timestamp?: number) {
  const [timeAgo, setTimeAgo] = useState('');

  useEffect(() => {
    if (!timestamp) {
      setTimeAgo('');
      return;
    }

    const updateTime = () => {
      const diffInSeconds = Math.floor((Date.now() - timestamp) / 1000);
      if (diffInSeconds < 60) {
        setTimeAgo('Atualizado agora');
      } else if (diffInSeconds < 3600) {
        setTimeAgo(`Atualizado há ${Math.floor(diffInSeconds / 60)} min`);
      } else {
        setTimeAgo(`Atualizado há ${Math.floor(diffInSeconds / 3600)} h`);
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, [timestamp]);

  return timeAgo;
}
