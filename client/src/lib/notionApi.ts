/**
 * Notion API Integration
 * Push market data back to Notion page
 */

import type { MarketStateSnapshot, MarketItem, Faction } from './marketState';

/**
 * Configuration for Notion API
 */
export interface NotionConfig {
  token: string;
  pageId: string;
  factionsDatabaseId: string;
  resourcesDatabaseId: string;
}

/**
 * Push market state to a Notion page
 * Creates a rich page with market data overview
 */
export async function pushMarketStateToNotionPage(
  state: MarketStateSnapshot,
  config: NotionConfig
): Promise<{ success: boolean; message: string; pageUrl?: string }> {
  try {
    if (!config.token || !config.pageId) {
      return {
        success: false,
        message: 'Missing Notion token or page ID',
      };
    }

    // Create page content with market overview
    const pageContent = createNotionPageContent(state);

    // Push to Notion
    const response = await fetch(`https://api.notion.com/v1/pages/${config.pageId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${config.token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: {
            title: [
              {
                text: {
                  content: `Market State - ${new Date(state.timestamp).toLocaleDateString()}`,
                },
              },
            ],
          },
        },
        children: pageContent,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: `Notion API error: ${error.message}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Market state pushed to Notion successfully',
      pageUrl: `https://notion.so/${data.id.replace(/-/g, '')}`,
    };
  } catch (error) {
    return {
      success: false,
      message: `Error pushing to Notion: ${error}`,
    };
  }
}

/**
 * Create Notion page blocks for market state
 */
function createNotionPageContent(state: MarketStateSnapshot): any[] {
  const blocks: any[] = [];

  // Title
  blocks.push({
    object: 'block',
    type: 'heading_1',
    heading_1: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: `Logos Imperium Market State`,
          },
        },
      ],
    },
  });

  // Timestamp
  blocks.push({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: `Snapshot: ${new Date(state.timestamp).toLocaleString()}`,
          },
          annotations: {
            italic: true,
          },
        },
      ],
    },
  });

  // Summary stats
  blocks.push({
    object: 'block',
    type: 'heading_2',
    heading_2: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'Market Summary',
          },
        },
      ],
    },
  });

  // Stats paragraph
  const inflationary = state.items.filter((i) => i.status === 'Inflationary').length;
  const depressed = state.items.filter((i) => i.status === 'Depressed').length;
  const concern = state.items.filter((i) => i.status === 'Concern').length;
  const expected = state.items.filter((i) => i.status === 'Expected').length;

  blocks.push({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: `Total Items: ${state.items.length} | Factions: ${state.factions.length}`,
          },
        },
      ],
    },
  });

  blocks.push({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: `Market Status: Inflationary (${inflationary}) | Expected (${expected}) | Concern (${concern}) | Depressed (${depressed})`,
          },
        },
      ],
    },
  });

  // Items by category
  blocks.push({
    object: 'block',
    type: 'heading_2',
    heading_2: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'Items by Category',
          },
        },
      ],
    },
  });

  const categories = state.categories || ['weapons', 'ships', 'resources', 'technology', 'equipment'];
  categories.forEach((category) => {
    const categoryItems = state.items.filter((i) => i.category === category);
    if (categoryItems.length > 0) {
      blocks.push({
        object: 'block',
        type: 'heading_3',
        heading_3: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `${category.charAt(0).toUpperCase() + category.slice(1)} (${categoryItems.length})`,
              },
            },
          ],
        },
      });

      categoryItems.slice(0, 5).forEach((item) => {
        blocks.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: `${item.name} - ${item.status} - ${item.marketTrends}`,
                },
              },
            ],
          },
        });
      });

      if (categoryItems.length > 5) {
        blocks.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: `... and ${categoryItems.length - 5} more`,
                },
                annotations: {
                  italic: true,
                },
              },
            ],
          },
        });
      }
    }
  });

  // Export info
  blocks.push({
    object: 'block',
    type: 'divider',
    divider: {},
  });

  blocks.push({
    object: 'block',
    type: 'paragraph',
    paragraph: {
      rich_text: [
        {
          type: 'text',
          text: {
            content: 'This market state was exported from Logos Imperium. Use the JSON export for full data preservation.',
          },
          annotations: {
            italic: true,
            color: 'gray',
          },
        },
      ],
    },
  });

  return blocks;
}

/**
 * Fetch market data from Notion database
 */
export async function fetchFromNotionDatabase(
  databaseId: string,
  token: string
): Promise<any[]> {
  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page_size: 100,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Notion API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching from Notion:', error);
    return [];
  }
}

/**
 * Parse Notion page properties to extract market item data
 */
export function parseNotionResourcePage(page: any): MarketItem | null {
  try {
    const props = page.properties;

    return {
      id: page.id,
      resourceId: props['Resource ID']?.rich_text?.[0]?.plain_text || page.id,
      name: props['Name']?.title?.[0]?.plain_text || 'Unknown',
      category: props['Category']?.select?.name || 'resources',
      description: props['Resource Description']?.rich_text?.[0]?.plain_text || '',
      basePrice: 1000,
      strategicValue: props['Strategic Value']?.rich_text?.[0]?.plain_text || 'Medium',
      status: (props['Status']?.status?.name || 'Expected') as any,
      marketTrends: props['Market Trends']?.rich_text?.[0]?.plain_text || 'Stable',
      marketNodes: props['Market Nodes']?.rich_text?.[0]?.plain_text || '',
      place: props['Place']?.rich_text?.[0]?.plain_text || '',
      date: props['Date']?.date?.start || '',
      notionUrl: page.url,
    };
  } catch (error) {
    console.error('Error parsing Notion page:', error);
    return null;
  }
}

/**
 * Parse Notion faction page
 */
export function parseNotionFactionPage(page: any): Faction | null {
  try {
    const props = page.properties;

    return {
      id: props['Faction ID']?.rich_text?.[0]?.plain_text || page.id,
      name: props['Name']?.title?.[0]?.plain_text || 'Unknown',
      type: props['Type']?.rich_text?.[0]?.plain_text || '',
      alignmentPolitical: props['Alignment Political']?.rich_text?.[0]?.plain_text || '',
      status: props['Status']?.rich_text?.[0]?.plain_text || 'Active',
      notionUrl: page.url,
    };
  } catch (error) {
    console.error('Error parsing Notion faction page:', error);
    return null;
  }
}

/**
 * Validate Notion configuration
 */
export async function validateNotionConfig(config: NotionConfig): Promise<{
  valid: boolean;
  errors: string[];
}> {
  const errors: string[] = [];

  if (!config.token) errors.push('Missing Notion token');
  if (!config.pageId) errors.push('Missing Notion page ID');

  if (errors.length === 0) {
    try {
      const response = await fetch('https://api.notion.com/v1/pages', {
        headers: {
          'Authorization': `Bearer ${config.token}`,
          'Notion-Version': '2022-06-28',
        },
      });

      if (!response.ok) {
        errors.push('Invalid Notion token or insufficient permissions');
      }
    } catch (error) {
      errors.push(`Error validating token: ${error}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
