import { useState, useEffect, useCallback } from 'react';
import { LedgerResource, fetchLedgerResourcesWithCache } from '@/lib/notionLedger';

interface UseImperialLedgerState {
  resources: LedgerResource[];
  loading: boolean;
  error: string | null;
  lastSync: Date | null;
  isConnected: boolean;
}

export function useImperialLedger(notionToken: string | null) {
  const [state, setState] = useState<UseImperialLedgerState>({
    resources: [],
    loading: false,
    error: null,
    lastSync: null,
    isConnected: !!notionToken,
  });

  const syncResources = useCallback(async () => {
    if (!notionToken) {
      setState((prev) => ({
        ...prev,
        error: 'Notion token not configured',
        isConnected: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const resources = await fetchLedgerResourcesWithCache(notionToken);
      setState((prev) => ({
        ...prev,
        resources,
        loading: false,
        lastSync: new Date(),
        isConnected: true,
        error: null,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
        isConnected: false,
      }));
    }
  }, [notionToken]);

  // Auto-sync on mount if token is available
  useEffect(() => {
    if (notionToken) {
      syncResources();
    }
  }, [notionToken, syncResources]);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!notionToken) return;

    const interval = setInterval(() => {
      syncResources();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [notionToken, syncResources]);

  return {
    ...state,
    syncResources,
  };
}
