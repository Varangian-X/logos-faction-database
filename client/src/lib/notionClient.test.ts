import { describe, it, expect, beforeAll } from 'vitest';

describe('Notion Token Validation', () => {
  let notionToken: string | undefined;

  beforeAll(() => {
    notionToken = import.meta.env.VITE_NOTION_TOKEN;
  });

  it('should have Notion token configured', () => {
    expect(notionToken).toBeDefined();
    expect(notionToken).toBeTruthy();
    expect(typeof notionToken).toBe('string');
  });

  it('should have valid token format', () => {
    if (!notionToken) {
      expect.fail('Notion token not configured');
    }
    // Notion tokens typically start with "secret_" or are long alphanumeric strings
    expect(notionToken.length).toBeGreaterThan(10);
  });

  it('should validate token is not empty string', () => {
    expect(notionToken?.trim()).not.toBe('');
  });

  it('should validate token contains no spaces', () => {
    if (notionToken) {
      expect(notionToken).not.toContain(' ');
    }
  });

  it('should be able to construct Notion API headers', () => {
    if (!notionToken) {
      expect.fail('Notion token not configured');
    }

    const headers = {
      'Authorization': `Bearer ${notionToken}`,
      'Notion-Version': '2024-06-15',
      'Content-Type': 'application/json',
    };

    expect(headers['Authorization']).toContain('Bearer');
    expect(headers['Authorization']).toContain(notionToken);
    expect(headers['Notion-Version']).toBe('2024-06-15');
  });
});
