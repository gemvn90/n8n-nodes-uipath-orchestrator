import { expect } from 'chai';
import proxyquire from 'proxyquire';

describe('Folders Operations', () => {
  let context: any;
  let called: any;
  let Folders: any;

  beforeEach(() => {
    called = {};
    context = {
      getNodeParameter: (name: string) => {
        const params: any = {
          folderId: '1',
          folderDisplayName: 'TestFolder',
          parentId: '0',
          description: 'Test folder',
          top: 10,
          skip: 0,
        };
        return params[name];
      },
      getNode: () => ({}),
    };

    Folders = proxyquire('../nodes/UiPathOrchestrator/operations/folders', {
      '../GenericFunctions': {
        uiPathApiRequest: {
          call: async function(self: any, method: string, url: string, body?: any) {
            called = { method, url, body };
            if (method === 'GET' && (url.includes('GetAllForCurrentUser') || url.includes('Folders'))) {
              return { value: [{ Id: 1, DisplayName: 'TestFolder' }] };
            }
            if (method === 'POST' && url.includes('Folders')) {
              return { Id: 1, ...body };
            }
            if (method === 'PUT' && url.includes('Folders')) {
              return { success: true };
            }
            if (method === 'DELETE' && url.includes('Folders')) {
              return { success: true };
            }
            return {};
          },
        },
      },
    });
  });

  it('should get all folders', async () => {
    const result = await Folders.executeFoldersOperations.call(context, 0, 'getAll');
    expect(called.method).to.equal('GET');
    expect(result[0].DisplayName).to.equal('TestFolder');
  });

  it('should update folder', async () => {
    context.getNodeParameter = (name: string) => {
      const params: any = {
        folderId: '1',
        folderDisplayName: 'UpdatedFolder',
      };
      return params[name];
    };
    const result = await Folders.executeFoldersOperations.call(context, 0, 'update');
    expect(called.method).to.equal('PATCH');
  });

  it('should delete folder', async () => {
    const result = await Folders.executeFoldersOperations.call(context, 0, 'delete');
    expect(called.method).to.equal('DELETE');
    expect(result.success).to.be.true;
  });
});
