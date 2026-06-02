/**
 * useNotionMarketSync Hook
 * Manages live Notion data synchronization for Dynamic Market
 */

import { useState, useEffect, useCallback } from 'react';
import {
  fetchNotionFactions,
  fetchNotionResources,
  validateNotionToken,
  type NotionFaction,
  type NotionResource,
} from '@/lib/notionClient';
import {
  mapNotionResourceToMarketItem,
  buildMarketCatalogFromNotion,
} from '@/lib/notionMarketMapper';
import { MarketItem, ItemCategory } from '@/lib/marketCatalog';

export interface NotionSyncState {
  isLoading: boolean;
  error: string | null;
  lastSync: Date | null;
  factions: NotionFaction[];
  resources: NotionResource[];
  marketItems: Record<ItemCategory, MarketItem[]>;
  isAuthenticated: boolean;
}

export interface UseNotionMarketSyncOptions {
  notionToken?: string;
  autoSync?: boolean;
  syncInterval?: number; // milliseconds
}

/**
 * Hook for managing Notion market data synchronization
 */
export function useNotionMarketSync(
  options: UseNotionMarketSyncOptions = {}
) {
  const { notionToken, autoSync = false, syncInterval = 300000 } = options;

  const [state, setState] = useState<NotionSyncState>({
    isLoading: false,
    error: null,
    lastSync: null,
    factions: [],
    resources: [],
    marketItems: {
      weapons: [],
      ships: [],
      resources: [],
      technology: [],
      equipment: [],
    },
    isAuthenticated: false,
  });

  /**
   * Validate and store Notion token
   */
  const authenticateNotion = useCallback(
    async (token: string) => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      try {
        const isValid = await validateNotionToken(token);
        if (isValid) {
          localStorage.setItem('notion_token', token);
          setState(prev => ({ ...prev, isAuthenticated: true }));
          return true;
        } else {
          setState(prev => ({
            ...prev,
            error: 'Invalid Notion token',
            isAuthenticated: false,
          }));
          return false;
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Auth failed';
        setState(prev => ({
          ...prev,
          error: message,
          isAuthenticated: false,
        }));
        return false;
      } finally {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    },
    []
  );

  /**
   * Sync data from Notion
   */
  const syncFromNotion = useCallback(async () => {
    const token = notionToken || localStorage.getItem('notion_token');

    if (!token) {
      setState(prev => ({
        ...prev,
        error: 'No Notion token provided',
        isAuthenticated: false,
      }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const [factions, resources] = await Promise.all([
        fetchNotionFactions(token),
        fetchNotionResources(token),
      ]);

      const marketItems = buildMarketCatalogFromNotion(resources, factions);

      setState(prev => ({
        ...prev,
        factions,
        resources,
        marketItems,
        lastSync: new Date(),
        isAuthenticated: true,
        error: null,
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Sync failed';
      setState(prev => ({
        ...prev,
        error: message,
        isLoading: false,
      }));
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [notionToken]);

  /**
   * Set up auto-sync interval
   */
  useEffect(() => {
    if (!autoSync) return;

    const token = notionToken || localStorage.getItem('notion_token');
    if (!token) return;

    // Initial sync
    syncFromNotion();

    // Set up interval
    const interval = setInterval(syncFromNotion, syncInterval);

    return () => clearInterval(interval);
  }, [autoSync, syncInterval, notionToken, syncFromNotion]);

  /**
   * Get items by category
   */
  const getItemsByCategory = useCallback(
    (category: ItemCategory): MarketItem[] => {
      return state.marketItems[category] || [];
    },
    [state.marketItems]
  );

  /**
   * Search items across all categories
   */
  const searchItems = useCallback(
    (query: string): MarketItem[] => {
      const lowerQuery = query.toLowerCase();
      const results: MarketItem[] = [];

      Object.values(state.marketItems).forEach(items => {
        items.forEach(item => {
          if (
            item.name.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery)
          ) {
            results.push(item);
          }
        });
      });

      return results;
    },
    [state.marketItems]
  );

  /**
   * Get items by market status
   */
  const getItemsByStatus = useCallback(
    (status: string): MarketItem[] => {
      const results: MarketItem[] = [];

      Object.values(state.marketItems).forEach(items => {
        items.forEach(item => {
          if ((item.stats?.marketStatus as string) === status) {
            results.push(item);
          }
        });
      });

      return results;
    },
    [state.marketItems]
  );

  /**
   * Get items by strategic value
   */
  const getItemsByStrategicValue = useCallback(
    (value: string): MarketItem[] => {
      const results: MarketItem[] = [];

      Object.values(state.marketItems).forEach(items => {
        items.forEach(item => {
          if ((item.stats?.strategicValue as string) === value) {
            results.push(item);
          }
        });
      });

      return results;
    },
    [state.marketItems]
  );

  return {
    ...state,
    authenticateNotion,
    syncFromNotion,
    getItemsByCategory,
    searchItems,
    getItemsByStatus,
    getItemsByStrategicValue,
  };
}
