import { expect } from 'chai';
import proxyquire from 'proxyquire';

describe('Queues Operations', () => {
  let context: any;
  let called: any;
  let Queues: any;

  beforeEach(() => {
    called = {};
    context = {
      getNodeParameter: (name: string) => {
        const params: any = {
          queueName: 'TestQueue',
          itemData: '{"key": "value"}',
          priority: 'Normal',
          reference: 'REF123',
          dueDate: '2024-12-31',
          bulkItemsJson: '[{"itemData": {"key": "value1"}}, {"itemData": {"key": "value2"}}]',
          top: 10,
          skip: 0,
          queueItemKey: 'abc-123',
          queueItemId: 321,
          status: 'New',
          progress: '50%',
          reviewStatus: 'Pending',
          reviewerId: 42,
          specificContent: '{"a":1}',
          filter: "Status eq 0",
          commentKey: 'c-1',
          content: 'a comment',
          author: 'tester',
          commentStatus: 'Visible',
          itemIds: '[1,2,3]',
          userId: 7,
          reviewStatusParam: 'Approved',
          robotId: 99,
          transactionStatus: 'Succeeded',
          outputData: '{"out":true}',
          errorType: 'SomeError',
          errorReason: 'Because',
        };
        return params[name];
      },
      getNode: () => ({}),
    };

    Queues = proxyquire('../nodes/UiPathOrchestrator/operations/queues', {
      '../GenericFunctions': {
        uiPathApiRequest: {
          call: async function(self: any, method: string, url: string, body?: any) {
            called = { method, url, body };
            // bulk add should be matched before single add because URL contains 'AddQueueItem' substring
            if (method === 'POST' && url.includes('BulkAddQueueItems')) {
              return { bulkItemCount: Array.isArray(body.bulkItemsJson) ? body.bulkItemsJson.length : 0, successful: true };
            }
            // list queue items (ensure it does not match single item URL)
if (method === 'GET' && url.includes('/odata/QueueItems') && !url.includes('/odata/QueueItems(')) {
              return { value: [{ Id: 123, Name: 'Item', Status: 0 }] };
            }
            // get single queue item
            if (method === 'GET' && url.includes('/odata/QueueItems(')) {
              return { Id: 123, Name: 'SingleItem', Status: 1 };
            }
            // add queue item
            if (method === 'POST' && url.includes('AddQueueItem')) {
              return { Id: 456, QueueName: 'TestQueue', ...body };
            }
            // update queue item
            if (method === 'PUT' && url.includes("/odata/QueueItems('")) {
              return { success: true, updated: body };
            }
            // deletes
            if (method === 'DELETE') {
              return { success: true };
            }
            // queue item comments/list
            if (method === 'GET' && url.includes('/odata/QueueItemComments')) {
              return { value: [{ Id: 1, Content: 'c' }] };
            }
            if (method === 'POST' && url.includes('/odata/QueueItemComments')) {
              return { Id: 10, Content: body.Content, QueueItemId: body.QueueItemId };
            }
            if (method === 'PUT' && url.includes('/odata/QueueItemComments')) {
              return { success: true };
            }
            // events
            if (method === 'GET' && url.includes('/odata/QueueItemEvents')) {
              return { value: [{ Event: 'e' }] };
            }
            // transaction progress/result
            if (method === 'POST' && url.includes('SetTransactionProgress')) {
              return { ok: true };
            }
            if (method === 'POST' && url.includes('SetTransactionResult')) {
              return { ok: true };
            }
            // set reviewer / review status / start transaction
            if (method === 'POST' && url.includes('SetItemReviewer')) {
              return { ok: true };
            }
            if (method === 'POST' && url.includes('SetItemReviewStatus')) {
              return { ok: true };
            }
            if (method === 'POST' && url.includes('StartTransaction')) {
              return { TransactionId: 999 };
            }
            return {};
          },
        },
      },
    });
  });

  it('should add queue item', async () => {
    const result = await Queues.executeQueuesOperations.call(context, 0, 'addQueueItem');
    expect(called.method).to.equal('POST');
    expect(called.url).to.include('AddQueueItem');
    expect(called.body.queueName).to.equal('TestQueue');
    expect(result).to.have.property('Id');
  });

  it('should bulk add queue items', async () => {
    const result = await Queues.executeQueuesOperations.call(context, 0, 'bulkAddQueueItems');
    
    expect(called.method).to.equal('POST');
    expect(called.url).to.include('BulkAddQueueItems');
    expect(result.bulkItemCount).to.equal(2);
  });

  it('should get a single queue item', async () => {
    const res = await Queues.executeQueuesOperations.call(context, 0, 'getQueueItem');
    
    expect(called.method).to.equal('GET');
    expect(called.url).to.include("/odata/QueueItems('");
    expect(res.Name).to.equal('SingleItem');
  });

  it('should update queue item', async () => {
    const res = await Queues.executeQueuesOperations.call(context, 0, 'updateQueueItem');
    expect(called.method).to.equal('PUT');
    expect(res.updated).to.have.property('SpecificContent');
  });

  it('should delete bulk queue items only when filter provided', async () => {
    // success when filter present
    const res = await Queues.executeQueuesOperations.call(context, 0, 'deleteBulkQueueItems');
    expect(called.method).to.equal('DELETE');
    expect(res.success).to.equal(true);

    // missing filter should throw
    const ctxMissing: any = {
      getNodeParameter: (name: string) => undefined,
      getNode: () => ({}),
    };
    const QueuesLocal = proxyquire('../nodes/UiPathOrchestrator/operations/queues', {
      '../GenericFunctions': { uiPathApiRequest: { call: async function() { return {}; } } },
    });
    let thrown = null;
    try {
      // @ts-ignore
      await QueuesLocal.executeQueuesOperations.call(ctxMissing, 0, 'deleteBulkQueueItems');
    } catch (err: any) {
      thrown = err;
    }
    expect(thrown).to.not.equal(null);
  });

  it('should manage comments and comment history', async () => {
    const comments = await Queues.executeQueuesOperations.call(context, 0, 'getQueueItemComments');
    expect(called.method).to.equal('GET');
    expect(comments[0]).to.have.property('Content');

    const created = await Queues.executeQueuesOperations.call(context, 0, 'createQueueItemComment');
    expect(called.method).to.equal('POST');
    expect(created).to.have.property('Id');

    const updated = await Queues.executeQueuesOperations.call(context, 0, 'updateQueueItemComment');
    expect(called.method).to.equal('PUT');
    expect(updated).to.have.property('success');

    const deleted = await Queues.executeQueuesOperations.call(context, 0, 'deleteQueueItemComment');
    expect(called.method).to.equal('DELETE');
    expect(deleted.success).to.equal(true);
  });

  it('should get queue item events and history', async () => {
    const events = await Queues.executeQueuesOperations.call(context, 0, 'getQueueItemEvents');
    expect(called.method).to.equal('GET');
    expect(events[0]).to.have.property('Event');

    const history = await Queues.executeQueuesOperations.call(context, 0, 'getQueueItemEventHistory');
    expect(called.method).to.equal('GET');
    expect(history[0]).to.have.property('Event');
  });

  it('should set transaction progress/result and start transaction', async () => {
    const prog = await Queues.executeQueuesOperations.call(context, 0, 'setTransactionProgress');
    expect(called.method).to.equal('POST');

    const start = await Queues.executeQueuesOperations.call(context, 0, 'startTransaction');
    expect(called.method).to.equal('POST');
    expect(start.TransactionId).to.equal(999);

    const res = await Queues.executeQueuesOperations.call(context, 0, 'setTransactionResult');
    expect(called.method).to.equal('POST');
  });

  it('should set item reviewer and review status', async () => {
    const s1 = await Queues.executeQueuesOperations.call(context, 0, 'setItemReviewer');
    expect(called.method).to.equal('POST');

    const s2 = await Queues.executeQueuesOperations.call(context, 0, 'setItemReviewStatus');
    expect(called.method).to.equal('POST');
  });



  it('should get queue items', async () => {
    const result = await Queues.executeQueuesOperations.call(context, 0, 'getQueueItems');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('/odata/QueueItems');
    expect(result[0]).to.have.property('Status');
  });

  it('should delete queue item', async () => {
    const result = await Queues.executeQueuesOperations.call(context, 0, 'deleteQueueItem');
    expect(called.method).to.equal('DELETE');
    expect(result.success).to.be.true;
  });
});
