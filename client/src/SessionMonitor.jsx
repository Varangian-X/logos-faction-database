import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export default function SessionMonitor({ gameStateId }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!gameStateId) return;

    // Store game state ID in session storage
    sessionStorage.setItem('currentGameId', gameStateId);
    sessionStorage.setItem('lastActiveTime', Date.now().toString());

    // Monitor for game state changes
    const monitorInterval = setInterval(() => {
      const stored = sessionStorage.getItem('currentGameId');
      if (stored !== gameStateId) {
        console.warn('Session mismatch detected!', { stored, current: gameStateId });
        sessionStorage.setItem('currentGameId', gameStateId);
      }
      sessionStorage.setItem('lastActiveTime', Date.now().toString());
    }, 5000);

    // Log navigation events
    const handleBeforeUnload = () => {
      sessionStorage.setItem('lastUnloadTime', Date.now().toString());
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(monitorInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gameStateId]);

  // Monitor for query errors
  useEffect(() => {
    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.type === 'queryError') {
        console.error('Query error detected:', event);
        const errorLog = JSON.parse(sessionStorage.getItem('queryErrors') || '[]');
        errorLog.push({
          timestamp: new Date().toISOString(),
          queryKey: event.query.queryKey,
          error: event.error?.toString(),
          gameStateId
        });
        sessionStorage.setItem('queryErrors', JSON.stringify(errorLog.slice(-20)));
      }
    });

    return unsubscribe;
  }, [queryClient, gameStateId]);

  return null; // This is a monitoring component, no UI
}