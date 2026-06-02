/**
 * Notion Ledger Data Fetcher
 * Fetches resource data from Notion Resources database for Imperial Ledger
 */

export interface NotionResource {
  id: string;
  properties: {
    Name: { title: Array<{ text: { content: string } }> };
    'Resource ID': { rich_text: Array<{ text: { content: string } }> };
    Category: { select: { name: string } };
    'Strategic Value': { number: number };
    'Market Trends': { select: { name: string } };
    'Market Nodes': { multi_select: Array<{ name: string }> };
    Status: { select: { name: string } };
    'Base Price': { number: number };
    'Price History': { rich_text: Array<{ text: { content: string } }> };
  };
}

export interface LedgerResource {
  id: string;
  name: string;
  symbol: string;
  currentPrice: number;
  priceHistory: Array<{ time: string; price: number }>;
  change24h: number;
  changePercent24h: number;
  supplyLevel: number;
  demandLevel: number;
  controlLevel: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
  category: string;
  strategicValue: number;
  marketTrends: string;
  status: string;
}

const NOTION_API_URL = 'https://api.notion.com/v1';
const RESOURCES_DB_ID = '3729d61ecf6b8153b534cb70aca92e56';

/**
 * Fetch all resources from Notion Resources database
 */
export async function fetchNotionLedgerResources(
  notionToken: string
): Promise<LedgerResource[]> {
  try {
    const response = await fetch(`${NOTION_API_URL}/databases/${RESOURCES_DB_ID}/query`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${notionToken}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: 100,
        filter: {
          property: 'Status',
          select: {
            equals: 'Active',
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results.map((item: NotionResource) => mapNotionToLedger(item));
  } catch (error) {
    console.error('Failed to fetch Notion ledger resources:', error);
    throw error;
  }
}

/**
 * Map Notion resource to Ledger format
 */
function mapNotionToLedger(notionResource: NotionResource): LedgerResource {
  const props = notionResource.properties;
  const name = props.Name?.title?.[0]?.text?.content || 'Unknown';
  const resourceId = props['Resource ID']?.rich_text?.[0]?.text?.content || '';
  const basePrice = props['Base Price']?.number || 100;
  const strategicValue = props['Strategic Value']?.number || 50;
  const marketTrends = props['Market Trends']?.select?.name || 'stable';
  const category = props.Category?.select?.name || 'General';
  const status = props.Status?.select?.name || 'Active';

  // Generate symbol from name
  const symbol = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 4);

  // Simulate price volatility based on market trends
  const volatility = getVolatilityFromTrend(marketTrends);
  const currentPrice = basePrice * (1 + volatility);
  const change24h = currentPrice - basePrice;
  const changePercent24h = (change24h / basePrice) * 100;

  // Generate price history
  const priceHistory = generatePriceHistory(basePrice, volatility);

  // Calculate supply/demand based on strategic value
  const supplyLevel = Math.max(10, 100 - strategicValue);
  const demandLevel = Math.min(95, strategicValue + Math.random() * 20);

  // Control level based on status
  const controlLevel = status === 'Active' ? Math.floor(50 + Math.random() * 50) : 20;

  // Determine trend
  const trend = changePercent24h > 1 ? 'up' : changePercent24h < -1 ? 'down' : 'stable';

  // Color based on trend
  const color =
    trend === 'up' ? '#00E5FF' : trend === 'down' ? '#FF3333' : '#D4AF37';

  return {
    id: resourceId || symbol,
    name,
    symbol,
    currentPrice: Math.round(currentPrice * 100) / 100,
    priceHistory,
    change24h: Math.round(change24h * 100) / 100,
    changePercent24h: Math.round(changePercent24h * 100) / 100,
    supplyLevel: Math.round(supplyLevel),
    demandLevel: Math.round(demandLevel),
    controlLevel: Math.round(controlLevel),
    trend,
    color,
    category,
    strategicValue,
    marketTrends,
    status,
  };
}

/**
 * Get volatility multiplier from market trend
 */
function getVolatilityFromTrend(trend: string): number {
  const trends: Record<string, number> = {
    Inflationary: 0.15,
    Depressed: -0.12,
    Volatile: 0.08,
    Stable: 0.02,
    Rising: 0.10,
    Falling: -0.08,
  };
  return trends[trend] || 0.02;
}

/**
 * Generate 24-hour price history
 */
function generatePriceHistory(
  basePrice: number,
  volatility: number
): Array<{ time: string; price: number }> {
  const history = [];
  let currentPrice = basePrice;

  for (let i = 0; i < 24; i++) {
    const hour = String(i).padStart(2, '0');
    const time = `${hour}:00`;

    // Add random walk to price
    const change = (Math.random() - 0.5) * basePrice * 0.05;
    currentPrice = Math.max(basePrice * 0.8, currentPrice + change);

    history.push({
      time,
      price: Math.round(currentPrice * 100) / 100,
    });
  }

  return history;
}

/**
 * Cache management
 */
const CACHE_KEY = 'notion_ledger_resources';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function getCachedResources(): LedgerResource[] | null {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;

  const { data, timestamp } = JSON.parse(cached);
  if (Date.now() - timestamp > CACHE_DURATION) {
    localStorage.removeItem(CACHE_KEY);
    return null;
  }

  return data;
}

export function setCachedResources(resources: LedgerResource[]): void {
  localStorage.setItem(
    CACHE_KEY,
    JSON.stringify({
      data: resources,
      timestamp: Date.now(),
    })
  );
}

/**
 * Fetch with caching
 */
export async function fetchLedgerResourcesWithCache(
  notionToken: string
): Promise<LedgerResource[]> {
  // Check cache first
  const cached = getCachedResources();
  if (cached) return cached;

  // Fetch from Notion
  const resources = await fetchNotionLedgerResources(notionToken);

  // Cache the results
  setCachedResources(resources);

  return resources;
}
