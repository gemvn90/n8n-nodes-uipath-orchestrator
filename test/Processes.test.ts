import { expect } from 'chai';
import proxyquire from 'proxyquire';

describe('Processes Operations', () => {
  let context: any;
  let called: any;
  let Processes: any;

  beforeEach(() => {
    called = {};
    context = {
      getNodeParameter: (name: string) => {
        const params: any = {
          processKey: 'process1',
          processId: '1',
          top: 10,
          skip: 0,
          filter: 'IsLatestVersion eq true',
        };
        return params[name];
      },
      getNode: () => ({}),
    };

    Processes = proxyquire('../nodes/UiPathOrchestrator/operations/processes', {
      '../GenericFunctions': {
        uiPathApiRequest: {
          call: async function(self: any, method: string, url: string, body?: any) {
            called = { method, url, body };
            if (method === 'GET' && url.includes('/odata/Processes')) {
              return { value: [{ Id: 1, Key: 'process1', Name: 'TestProcess' }] };
            }
            return {};
          },
        },
      },
    });
  });

  it('should get all processes', async () => {
    const result = await Processes.executeProcessesOperations.call(context, 0, 'getAll');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('/odata/Processes');
    expect(result[0].Key).to.equal('process1');
  });

  it('should download package', async () => {
    context.getNodeParameter = (name: string) => {
      const params: any = { processKey: 'process1' };
      return params[name];
    };
    const result = await Processes.executeProcessesOperations.call(context, 0, 'downloadPackage');
    expect(called.method).to.equal('GET');
  });

  it('should get process versions', async () => {
    const result = await Processes.executeProcessesOperations.call(context, 0, 'getProcessVersions');
    expect(called.method).to.equal('GET');
    expect(result[0]).to.have.property('Key');
  });
});
