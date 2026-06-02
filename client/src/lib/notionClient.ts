/**
 * Notion API Client for Logos Imperium
 * Fetches live data from Notion Factions and Resources registries
 */

export interface NotionFaction {
  id: string;
  name: string;
  factionId: string;
  type: string;
  alignment: string;
  status: string;
}

export interface NotionResource {
  id: string;
  resourceId: string;
  name: string;
  category: string;
  description: string;
  strategicValue: string;
  status: string;
  marketTrends: string;
  marketNodes: string;
  place?: string;
  date?: string;
  imageUrl?: string;
  basePrice?: number;
}

/**
 * Notion API configuration
 * These are the database IDs from your Notion URLs
 */
const NOTION_CONFIG = {
  factionsDbId: '3729d61ecf6b814aac1df7447ba5c065',
  resourcesDbId: '3729d61ecf6b8153b534cb70aca92e56',
  apiVersion: '2022-06-28',
};

/**
 * Fetch Factions from Notion Registry
 */
export async function fetchNotionFactions(
  notionToken: string
): Promise<NotionFaction[]> {
  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_CONFIG.factionsDbId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${notionToken}`,
          'Notion-Version': NOTION_CONFIG.apiVersion,
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
    return data.results.map((page: any) => ({
      id: page.id,
      name: page.properties.Name?.title?.[0]?.plain_text || '',
      factionId: page.properties['Faction ID']?.rich_text?.[0]?.plain_text || '',
      type: page.properties.Type?.select?.name || '',
      alignment: page.properties.Alignment?.select?.name || '',
      status: page.properties.Status?.select?.name || 'Active',
    }));
  } catch (error) {
    console.error('Failed to fetch Notion factions:', error);
    return [];
  }
}

/**
 * Fetch Resources from Notion Registry
 */
export async function fetchNotionResources(
  notionToken: string
): Promise<NotionResource[]> {
  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${NOTION_CONFIG.resourcesDbId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${notionToken}`,
          'Notion-Version': NOTION_CONFIG.apiVersion,
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
    return data.results.map((page: any) => ({
      id: page.id,
      resourceId: page.properties['Resource ID']?.rich_text?.[0]?.plain_text || '',
      name: page.properties.Name?.title?.[0]?.plain_text || '',
      category: page.properties.Category?.select?.name || 'resources',
      description: page.properties.Description?.rich_text?.[0]?.plain_text || '',
      strategicValue: page.properties['Strategic Value']?.select?.name || 'Medium',
      status: page.properties.Status?.select?.name || 'Expected',
      marketTrends: page.properties['Market Trends']?.select?.name || 'Stable',
      marketNodes: page.properties['Market Nodes']?.rich_text?.[0]?.plain_text || 'All',
      place: page.properties.Place?.rich_text?.[0]?.plain_text,
      date: page.properties.Date?.date?.start,
      imageUrl: page.properties.Image?.files?.[0]?.file?.url,
      basePrice: 1000, // Default price, can be customized per resource
    }));
  } catch (error) {
    console.error('Failed to fetch Notion resources:', error);
    return [];
  }
}

/**
 * Push market state to Notion page
 */
export async function pushToNotionPage(
  notionToken: string,
  pageId: string,
  content: string
): Promise<boolean> {
  try {
    const response = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${notionToken}`,
        'Notion-Version': NOTION_CONFIG.apiVersion,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title: [
            {
              text: {
                content: 'Market State Snapshot',
              },
            },
          ],
        },
      }),
    });

    return response.ok;
  } catch (error) {
    console.error('Failed to push to Notion:', error);
    return false;
  }
}

/**
 * Validate Notion token
 */
export async function validateNotionToken(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://api.notion.com/v1/users/me', {
      headers: {
        Authorization: `Bearer ${token}`,
        'Notion-Version': NOTION_CONFIG.apiVersion,
      },
    });
    return response.ok;
  } catch (error) {
    console.error('Invalid Notion token:', error);
    return false;
  }
}
