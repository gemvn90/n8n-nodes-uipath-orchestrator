import { expect } from 'chai';
import proxyquire from 'proxyquire';

describe('Sessions Operations', () => {
  let context: any;
  let called: any;
  let Sessions: any;

  beforeEach(() => {
    called = {};
    context = {
      getNodeParameter: (name: string) => {
        const params: any = {
          id: 1,
          robotId: 1,
          top: 10,
          skip: 0,
        };
        return params[name];
      },
      getNode: () => ({}),
    };

    Sessions = proxyquire('../nodes/UiPathOrchestrator/operations/sessions', {
      '../GenericFunctions': {
        uiPathApiRequest: {
          call: async function(self: any, method: string, url: string, body?: any) {
            called = { method, url, body };
            if (method === 'GET' && url.includes('/odata/Sessions')) {
              return { value: [{ Id: 1, RobotId: 1, State: 1 }] };
            }
            return {};
          },
        },
      },
    });
  });

  it('should get all sessions', async () => {
    const result = await Sessions.executeSessionsOperations.call(context, 0, 'getAll');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('/odata/Sessions');
    expect(result).to.have.property('value');
  });

  it('should delete inactive unattended sessions', async () => {
    context.getNodeParameter = (name: string) => {
      const params: any = { inactiveForMinutes: 60 };
      return params[name];
    };
    const result = await Sessions.executeSessionsOperations.call(context, 0, 'deleteInactiveUnattendedSessions');
    expect(called.method).to.equal('POST');
  });

  it('should get machine sessions', async () => {
    context.getNodeParameter = (name: string) => {
      const params: any = { machineId: 1 };
      return params[name];
    };
    const result = await Sessions.executeSessionsOperations.call(context, 0, 'getMachineSessions');
    expect(called.method).to.equal('GET');
  });
});
