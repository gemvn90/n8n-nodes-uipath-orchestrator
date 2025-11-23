import { expect } from 'chai';
import proxyquire from 'proxyquire';

describe('Robots Operations', () => {
  let context: any;
  let called: any;
  let Robots: any;

  beforeEach(() => {
    called = {};
    context = {
      getNodeParameter: (name: string) => {
        const params: any = {
          id: 1,
          robotName: 'TestRobot',
          top: 10,
          skip: 0,
        };
        return params[name];
      },
      getNode: () => ({}),
    };

    Robots = proxyquire('../nodes/UiPathOrchestrator/operations/robots', {
      '../GenericFunctions': {
        uiPathApiRequest: {
          call: async function(self: any, method: string, url: string, body?: any) {
            called = { method, url, body };
            if (method === 'GET' && url.includes('/odata/Robots')) {
              return { value: [{ Id: 1, Name: 'TestRobot', Username: 'robot@domain' }] };
            }
            return {};
          },
        },
      },
    });
  });

  it('should get all robots', async () => {
    const result = await Robots.executeRobotsOperations.call(context, 0, 'getAll');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('/odata/Robots');
    expect(result[0].Name).to.equal('TestRobot');
  });

  it('should create robot', async () => {
    context.getNodeParameter = (name: string) => {
      const params: any = {
        machineId: 1,
        machineName: 'TestMachine',
        username: 'robot@domain',
        password: 'password',
        credential: 'cred',
        isFloatingRobot: false,
      };
      return params[name];
    };
    const result = await Robots.executeRobotsOperations.call(context, 0, 'create');
    expect(called.method).to.equal('POST');
  });

  it('should find robots across folders', async () => {
    const result = await Robots.executeRobotsOperations.call(context, 0, 'findAcrossFolders');
    expect(called.method).to.equal('GET');
    expect(result[0]).to.have.property('Id');
  });
});
