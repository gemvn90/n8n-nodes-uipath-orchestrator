import { getOAuthToken } from '../nodes/UiPathOrchestrator/GenericFunctions';
import { config } from 'dotenv';
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';

// Load environment variables
config({ path: '.env' });

describe('UiPath Orchestrator REAL Authentication Tests', () => {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;

  beforeAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000; // 15s timeout for real API calls
  });

  afterAll(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  test('should authenticate with real on-prem server', async () => {
    const token = await getOAuthToken(
      process.env.UIPATH_SERVER_URL!.split('//')[1],
      process.env.UIPATH_CLIENT_ID!,
      process.env.UIPATH_CLIENT_SECRET!,
      process.env.UIPATH_OAUTH_TOKEN_URL,
      process.env.UIPATH_SCOPES,
      process.env.UIPATH_AUTH_MODE,
      process.env.UIPATH_SERVER_URL,
      process.env.NODE_ENV === 'test' // Use SSL bypass only in test env
    );

    // Validate token structure
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(50);
    expect(token).toMatch(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]*$/);
  });

  test('should fail with invalid credentials', async () => {
    await expect(
      getOAuthToken(
        process.env.UIPATH_SERVER_URL!.split('//')[1],
        'invalid-client-id',
        'invalid-secret',
        process.env.UIPATH_OAUTH_TOKEN_URL,
        process.env.UIPATH_SCOPES,
        process.env.UIPATH_AUTH_MODE,
        process.env.UIPATH_SERVER_URL
      )
    ).rejects.toThrow(/Failed to get OAuth token/);
  });

  test('should handle SSL verification properly', async () => {
    // Test with SSL verification enabled
    await expect(
      getOAuthToken(
        process.env.UIPATH_SERVER_URL!.split('//')[1],
        process.env.UIPATH_CLIENT_ID!,
        process.env.UIPATH_CLIENT_SECRET!,
        process.env.UIPATH_OAUTH_TOKEN_URL,
        process.env.UIPATH_SCOPES,
        process.env.UIPATH_AUTH_MODE,
        process.env.UIPATH_SERVER_URL,
        false // Disable SSL bypass
      )
    ).rejects.toThrow(/certificate/);
  });
});