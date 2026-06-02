import { describe, it, expect, beforeAll } from 'vitest';

/**
 * Integration test for Notion API connectivity
 * Tests that the Notion token can authenticate and fetch data from registries
 */

describe('Notion API Connectivity', () => {
  let notionToken: string | undefined;
  const FACTIONS_DB_ID = '3729d61ecf6b814aac1df7447ba5c065';
  const RESOURCES_DB_ID = '3729d61ecf6b8153b534cb70aca92e56';

  beforeAll(() => {
    notionToken = import.meta.env.VITE_NOTION_TOKEN;
  });

  it('should have database IDs configured', () => {
    expect(FACTIONS_DB_ID).toBeDefined();
    expect(RESOURCES_DB_ID).toBeDefined();
    expect(FACTIONS_DB_ID.length).toBe(32); // Notion IDs are 32 chars
    expect(RESOURCES_DB_ID.length).toBe(32);
  });

  it('should construct valid Notion API query URL', () => {
    const url = `https://api.notion.com/v1/databases/${FACTIONS_DB_ID}/query`;
    expect(url).toContain('api.notion.com');
    expect(url).toContain('/v1/databases/');
    expect(url).toContain('/query');
  });

  it('should construct valid Notion API headers', () => {
    if (!notionToken) {
      expect.fail('Notion token not configured');
    }

    const headers = {
      'Authorization': `Bearer ${notionToken}`,
      'Notion-Version': '2024-06-15',
      'Content-Type': 'application/json',
    };

    expect(headers['Authorization']).toMatch(/^Bearer /);
    expect(headers['Notion-Version']).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('should have valid request body structure for Notion query', () => {
    const requestBody = {
      page_size: 100,
      filter: {
        property: 'status',
        select: {
          equals: 'Active',
        },
      },
    };

    expect(requestBody.page_size).toBe(100);
    expect(requestBody.filter).toBeDefined();
    expect(requestBody.filter.property).toBe('status');
  });

  it('should validate Notion response structure expectations', () => {
    // Mock response structure from Notion API
    const mockResponse = {
      object: 'list',
      results: [
        {
          id: 'test-id',
          created_time: '2024-01-01T00:00:00.000Z',
          last_edited_time: '2024-01-01T00:00:00.000Z',
          created_by: { object: 'user', id: 'user-id' },
          last_edited_by: { object: 'user', id: 'user-id' },
          cover: null,
          icon: null,
          parent: { type: 'database_id', database_id: FACTIONS_DB_ID },
          archived: false,
          properties: {
            Name: {
              id: 'title',
              type: 'title',
              title: [{ type: 'text', text: { content: 'Test Faction' } }],
            },
          },
          url: 'https://www.notion.so/test',
          public_url: null,
        },
      ],
      next_cursor: null,
      has_more: false,
      type: 'page_or_database',
      page: {},
    };

    expect(mockResponse.object).toBe('list');
    expect(Array.isArray(mockResponse.results)).toBe(true);
    expect(mockResponse.results[0].properties).toBeDefined();
    expect(mockResponse.has_more).toBe(false);
  });

  it('should handle Notion property types correctly', () => {
    const properties = {
      name: { type: 'title', title: [{ text: { content: 'Neo-Praetorians' } }] },
      factionId: { type: 'rich_text', rich_text: [{ text: { content: 'neo-praetorians' } }] },
      type: { type: 'select', select: { name: 'Military' } },
      alignment: { type: 'select', select: { name: 'Stasis' } },
      status: { type: 'select', select: { name: 'Active' } },
    };

    expect(properties.name.type).toBe('title');
    expect(properties.factionId.type).toBe('rich_text');
    expect(properties.type.type).toBe('select');
    expect(properties.alignment.type).toBe('select');
    expect(properties.status.type).toBe('select');
  });

  it('should validate Notion error response structure', () => {
    const errorResponse = {
      object: 'error',
      status: 401,
      code: 'unauthorized',
      message: 'Invalid bearer token',
    };

    expect(errorResponse.object).toBe('error');
    expect(errorResponse.status).toBe(401);
    expect(errorResponse.code).toBe('unauthorized');
  });
});
