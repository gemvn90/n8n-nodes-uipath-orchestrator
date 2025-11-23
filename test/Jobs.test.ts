import { expect } from 'chai';
import proxyquire from 'proxyquire';

describe('Jobs Operations', () => {
  let context: any;
  let called: any;
  let Jobs: any;

  beforeEach(() => {
    called = {};
    context = {
      getNodeParameter: (name: string) => {
        const params: any = {
          id: '123',
          processKey: 'process1',
          robotIds: '[1, 2, 3]',
          top: 10,
          skip: 0,
          filter: 'State eq 0',
        };
        return params[name];
      },
      getNode: () => ({}),
    };

    Jobs = proxyquire('../nodes/UiPathOrchestrator/operations/jobs', {
      '../GenericFunctions': {
        uiPathApiRequest: {
          call: async function(self: any, method: string, url: string, body?: any) {
            called = { method, url, body };
            if (method === 'GET' && url.includes('/odata/Jobs')) {
              return { value: [{ Id: 123, State: 0, ProcessKey: 'process1' }] };
            }
            if (method === 'POST' && url.includes('Jobs')) {
              return { Id: 123, State: 0 };
            }
            return {};
          },
        },
      },
    });
  });

  it('should get all jobs', async () => {
    const result = await Jobs.executeJobsOperations.call(context, 0, 'getAll');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('/odata/Jobs');
    expect(result[0].ProcessKey).to.equal('process1');
  });

  it('should restart job', async () => {
    context.getNodeParameter = (name: string) => {
      const params: any = { id: 123 };
      return params[name];
    };
    const result = await Jobs.executeJobsOperations.call(context, 0, 'restartJob');
    expect(called.method).to.equal('POST');
  });

  it('should start jobs', async () => {
    const result = await Jobs.executeJobsOperations.call(context, 0, 'startJobs');
    expect(called.method).to.equal('POST');
    expect(result).to.have.property('Id');
  });

  it('should stop job', async () => {
    const result = await Jobs.executeJobsOperations.call(context, 0, 'stopJob');
    expect(called.method).to.equal('POST');
    expect(result).to.have.property('State');
  });
});
