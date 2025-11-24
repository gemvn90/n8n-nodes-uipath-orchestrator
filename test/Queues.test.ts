import { executeQueuesOperations } from '../nodes/UiPathOrchestrator/operations/queues';
import { getOAuthToken } from '../nodes/UiPathOrchestrator/GenericFunctions';
import { config } from 'dotenv';
import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';

// Load environment variables
config({ path: '.env' });

// Real API test configuration
const TEST_QUEUE_NAME = process.env.TEST_QUEUE_NAME || 'TestQueueA';
const TEST_ITEM_DATA = { key: 'testValue' };
const TEST_BULK_ITEMS = [
  { itemData: { key: 'bulk1' } },
  { itemData: { key: 'bulk2' } }
];

// Proper mock implementation of IExecuteFunctions
const createMockExecute = (params: IDataObject): IExecuteFunctions => ({
  getNodeParameter: (name: string) => params[name],
  getNode: () => ({ id: 'test-node', name: 'Test Node' }),
  helpers: {
    returnJsonArray: (items: IDataObject[]) => items,
    constructExecutionMetaData: (items: IDataObject[]) => items,
  },
  prepareOutputData: (items: IDataObject[]) => items,
  getCredentials: async () => ({
    clientId: process.env.UIPATH_CLIENT_ID,
    clientSecret: process.env.UIPATH_CLIENT_SECRET,
    tenantName: process.env.UIPATH_SERVER_URL?.split('//')[1],
    serverUrl: process.env.UIPATH_SERVER_URL,
    authMode: process.env.UIPATH_AUTH_MODE,
    ignoreSsl: process.env.NODE_ENV === 'test'
  }),
  continueOnFail: () => false,
  getExecutionId: () => 'test-execution-id',
  getWorkflow: () => ({ id: 'test-workflow', name: 'Test Workflow' }),
  getTimezone: () => 'UTC',
  getInstanceId: () => 'test-instance-id',
  getInstanceBaseUrl: () => 'http://localhost:5678',
  logger: {
    debug: () => {},
    info: () => {},
    warn: () => {},
    error: () => {}
  }
} as unknown as IExecuteFunctions);

describe('UiPath Orchestrator REAL Queue Operations', () => {
  let createdItemId: string;
  let createdBulkIds: string[] = [];

  beforeAll(async () => {
    jest.setTimeout(parseInt(process.env.TEST_TIMEOUT_MS || '20000'));
    // Verify authentication works
    await getOAuthToken(
      process.env.UIPATH_SERVER_URL!.split('//')[1],
      process.env.UIPATH_CLIENT_ID!,
      process.env.UIPATH_CLIENT_SECRET!,
      process.env.UIPATH_OAUTH_TOKEN_URL,
      process.env.UIPATH_SCOPES,
      process.env.UIPATH_AUTH_MODE,
      process.env.UIPATH_SERVER_URL,
      process.env.NODE_ENV === 'test'
    );
  });

  test('should add queue item to real server', async () => {
    const mockParams = {
      operation: 'addQueueItem',
      queueName: TEST_QUEUE_NAME,
      itemData: JSON.stringify(TEST_ITEM_DATA),
      priority: 'Normal'
    };

    const result = await executeQueuesOperations.call(
      createMockExecute(mockParams), 
      0, 
      'addQueueItem'
    );
    
    expect(result).toHaveProperty('Id');
    expect(result.QueueName).toBe(TEST_QUEUE_NAME);
    createdItemId = result.Id as string;
  });

  test('should bulk add queue items to real server', async () => {
    const mockParams = {
      operation: 'bulkAddQueueItems',
      queueName: TEST_QUEUE_NAME,
      bulkItemsJson: JSON.stringify(TEST_BULK_ITEMS)
    };

    const result = await executeQueuesOperations.call(
      createMockExecute(mockParams),
      0,
      'bulkAddQueueItems'
    );
    
    expect(result).toHaveProperty('bulkItemCount');
    expect(result.bulkItemCount).toBe(TEST_BULK_ITEMS.length);
    createdBulkIds = result.ProcessedQueueItems.map((item: IDataObject) => item.Id as string);
  });

  test('should retrieve queue items from real server', async () => {
    const mockParams = {
      operation: 'getQueueItems',
      filter: `QueueName eq '${TEST_QUEUE_NAME}'`,
      top: 10
    };

    const result = await executeQueuesOperations.call(
      createMockExecute(mockParams),
      0,
      'getQueueItems'
    );
    
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty('QueueName', TEST_QUEUE_NAME);
  });

  test('should handle invalid queue item creation', async () => {
    const mockParams = {
      operation: 'addQueueItem',
      queueName: '', // Invalid empty name
      itemData: JSON.stringify(TEST_ITEM_DATA)
    };

    await expect(
      executeQueuesOperations.call(
        createMockExecute(mockParams),
        0,
        'addQueueItem'
      )
    ).rejects.toThrow('Queue name is required');
  });

  afterAll(async () => {
    // Clean up test data using proper mock parameters
    const deleteItem = async (id: string) => {
      const deleteParams = {
        operation: 'deleteQueueItem',
        queueItemKey: id
      };
      
      await executeQueuesOperations.call(
        createMockExecute(deleteParams),
        0,
        'deleteQueueItem'
      );
    };

    if (createdItemId) {
      await deleteItem(createdItemId);
    }
    
    for (const id of createdBulkIds) {
      await deleteItem(id);
    }
  });
});
