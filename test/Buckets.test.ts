import { expect } from 'chai';
import proxyquire from 'proxyquire';

describe('Buckets Operations', () => {
  let context: any;
  let called: any;
  let Buckets: any;

  beforeEach(() => {
    called = {};
    context = {
      getNodeParameter: (name: string) => {
        const params: any = {
          name: 'TestBucket',
          bucketId: '1',
          directory: 'path/to/folder',
          fileNameGlob: '*.txt',
          path: 'path/to/test.txt',
          top: 10,
          skip: 0,
          description: 'desc',
          bucketType: 'Private',
          isActive: true,
          expand: 'Owner',
          select: 'Id,Name',
          expiryInMinutes: 30,
          contentType: 'text/plain',
          bucketsJson: JSON.stringify(['1','2']),
          toAddFolderIds: JSON.stringify(['10']),
          toRemoveFolderIds: JSON.stringify(['11']),
        };
        return params[name];
      },
      getNode: () => ({}),
    };

    Buckets = proxyquire('../nodes/UiPathOrchestrator/operations/buckets', {
      '../GenericFunctions': {
        uiPathApiRequest: {
          call: async function(self: any, method: string, url: string, body?: any, options?: any) {
            called = { method, url, body, options };
            if (method === 'GET' && url.includes('GetReadUri')) {
              return { uri: 'https://read.example' };
            }
            if (method === 'GET' && url.includes('GetWriteUri')) {
              return { uri: 'https://write.example' };
            }
            if (method === 'GET' && url.includes('/odata/Buckets') && !url.includes('(')) {
              return { value: [{ Id: '1', Name: 'TestBucket', ItemCount: 5 }] };
            }
            if (method === 'GET' && url.includes('/UiPath.Server.Configuration.OData.GetFile?')) {
              return { FileName: 'test.txt', Size: 123 };
            }
            if (method === 'GET' && url.includes('/UiPath.Server.Configuration.OData.GetFiles')) {
              return { value: [{ Name: 'test.txt', Path: 'path/to/test.txt' }] };
            }
            if (method === 'GET' && url.includes('/UiPath.Server.Configuration.OData.GetDirectories')) {
              return { value: [{ Directory: '/' }] };
            }
            if (method === 'GET' && url.includes('/odata/Buckets(') && !url.includes('GetFiles') && !url.includes('GetDirectories') && !url.includes('GetFile')) {
              return { Id: '1', Name: 'TestBucket' };
            }
            if (method === 'POST' && url.includes('/odata/Buckets') && !url.includes('ShareToFolders')) {
              return { Id: '1', Name: 'TestBucket' };
            }
            if (method === 'PUT' && url.includes('/odata/Buckets(')) {
              return { success: true };
            }
            if ((method === 'DELETE' && url.includes('/odata/Buckets(')) || (method === 'DELETE' && url.includes('DeleteFile'))) {
              return { success: true };
            }
            if (method === 'GET' && url.includes('GetReadUri')) {
              return { uri: 'https://read.example' };
            }
            if (method === 'GET' && url.includes('GetWriteUri')) {
              return { uri: 'https://write.example' };
            }
            if (method === 'POST' && url.includes('ShareToFolders')) {
              return { shared: true };
            }
            return {};
          },
        },
      },
    });
  });

  it('should get buckets', async () => {
    const result = await Buckets.executeBucketsOperations.call(context, 0, 'getBuckets');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('Buckets');
    expect(result[0].Name).to.equal('TestBucket');
  });

  it('should create bucket', async () => {
    const result = await Buckets.executeBucketsOperations.call(context, 0, 'createBucket');
    expect(called.method).to.equal('POST');
    expect(result).to.have.property('Id');
  });

  it('should list files', async () => {
    const result = await Buckets.executeBucketsOperations.call(context, 0, 'listFiles');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('GetFiles');
    expect(result[0]).to.have.property('Name');
  });

  it('should get directories', async () => {
    context.getNodeParameter = (name: string) => {
      const params: any = { bucketId: '1', directory: '/' };
      return params[name];
    };
    const result = await Buckets.executeBucketsOperations.call(context, 0, 'getDirectories');
    expect(called.method).to.equal('GET');
    expect(result[0]).to.have.property('Directory');
  });

  it('should get a single bucket with expand/select', async () => {
    const res = await Buckets.executeBucketsOperations.call(context, 0, 'getBucket');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('/odata/Buckets(1)');
    expect(res.Name).to.equal('TestBucket');
  });

  it('should update a bucket', async () => {
    const res = await Buckets.executeBucketsOperations.call(context, 0, 'updateBucket');
    expect(called.method).to.equal('PUT');
    expect(res.success).to.equal(true);
  });

  it('should delete a bucket', async () => {
    const res = await Buckets.executeBucketsOperations.call(context, 0, 'deleteBucket');
    expect(called.method).to.equal('DELETE');
    expect(res.success).to.equal(true);
  });

  it('should get a file and require path otherwise throw', async () => {
    // success case
    const res = await Buckets.executeBucketsOperations.call(context, 0, 'getFile');
    expect(called.method).to.equal('GET');
    expect(res).to.have.property('FileName');

    // missing path should throw
    const ctxMissing: any = {
      getNodeParameter: (name: string) => undefined,
      getNode: () => ({}),
    };
    const BucketsLocal = proxyquire('../nodes/UiPathOrchestrator/operations/buckets', {
      '../GenericFunctions': { uiPathApiRequest: { call: async function() { return {}; } } },
    });
    let thrown = null;
    try {
      // @ts-ignore
      await BucketsLocal.executeBucketsOperations.call(ctxMissing, 0, 'getFile');
    } catch (err: any) {
      thrown = err;
    }
    expect(thrown).to.not.equal(null);
    expect(thrown.message).to.include('Path is required');
  });

  it('should delete file and return success', async () => {
    const res = await Buckets.executeBucketsOperations.call(context, 0, 'deleteFile');
    expect(called.method).to.equal('DELETE');
    expect(res.success).to.equal(true);
  });

  it('should get read/write uris with expiry and contentType', async () => {
    const read = await Buckets.executeBucketsOperations.call(context, 0, 'getReadUri');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('GetReadUri');
    expect(read).to.have.property('uri');

    const write = await Buckets.executeBucketsOperations.call(context, 0, 'getWriteUri');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('GetWriteUri');
    expect(write).to.have.property('uri');
  });

  it('should share buckets to folders', async () => {
    const res = await Buckets.executeBucketsOperations.call(context, 0, 'shareToFolders');
    expect(called.method).to.equal('POST');
    expect(called.url).to.include('ShareToFolders');
    expect(res.shared).to.equal(true);
  });
});
