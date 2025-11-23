import { expect } from 'chai';
import proxyquire from 'proxyquire';

describe('DirectoryService Operations', () => {
  let context: any;
  let called: any;
  let DirectoryService: any;

  beforeEach(() => {
    called = {};
    context = {
      getNodeParameter: (name: string) => {
        const params: any = {
          searchTerm: 'test',
          count: 10,
        };
        return params[name];
      },
      getNode: () => ({}),
    };

    DirectoryService = proxyquire('../nodes/UiPathOrchestrator/operations/directoryService', {
      '../GenericFunctions': {
        uiPathApiRequest: {
          call: async function(self: any, method: string, url: string, body?: any) {
            called = { method, url, body };
            if (method === 'GET' && url.includes('GetDomains')) {
              return { value: [{ Name: 'DOMAIN', Id: '1' }] };
            }
            if (method === 'POST' && url.includes('SearchUsersAndGroups')) {
              return { value: [{ Name: 'Test User', Type: 'User' }] };
            }
            return {};
          },
        },
      },
    });
  });

  it('should get domains', async () => {
    const result = await DirectoryService.executeDirectoryServiceOperations.call(context, 0, 'getDomains');
    expect(called.method).to.equal('GET');
    expect(result).to.have.property('value');
  });

});
