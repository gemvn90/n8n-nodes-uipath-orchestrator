import { expect } from 'chai';
import proxyquire from 'proxyquire';

describe('AuditLogs Operations', () => {
  let context: any;
  let called: any;
  let AuditLogs: any;

  beforeEach(() => {
    called = {};
    context = {
      getNodeParameter: (name: string) => {
        const params: any = {
          auditedService: 'MyService',
          top: 10,
          skip: 5,
          filter: 'Level eq 1',
          select: 'Id,Message',
          orderBy: 'TimeStamp desc',
          expand: 'User',
          count: true,
          exportName: 'logs-export',
          auditLogId: '123',
        };
        return params[name];
      },
      getNode: () => ({}),
    };

    AuditLogs = proxyquire('../nodes/UiPathOrchestrator/operations/auditLogs', {
      '../GenericFunctions': {
        uiPathApiRequest: {
          call: async function(self: any, method: string, url: string, body?: any, options?: any) {
            called = { method, url, body, options };
            if (method === 'GET' && url.includes('/odata/AuditLogs') && !url.includes('GetAuditLogDetails')) {
              return { value: [{ Id: '1', Message: 'Test audit log', Level: 1 }] };
            }
            if (method === 'GET' && url.includes('GetAuditLogDetails')) {
              return { Id: '123', Details: 'detail' };
            }
            return {};
          },
        },
      },
    });
  });

  it('should get audit logs and include query params and headers', async () => {
    const result = await AuditLogs.executeAuditLogsOperations.call(context, 0, 'getAll');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('/odata/AuditLogs');
    expect(called.url).to.include('$top=10');
    expect(called.url).to.include('$filter=Level eq 1');
    expect(called.url).to.include('$select=Id,Message');
    expect(called.url).to.include('$orderby=TimeStamp desc');
    expect(called.url).to.include('$expand=User');
    expect(called.url).to.include('$count=true');
    expect(called.options).to.have.property('headers');
    expect(called.options.headers['x-UIPATH-AuditedService']).to.equal('MyService');
    expect(result[0].Message).to.equal('Test audit log');
  });

  it('should export audit logs with exportName and filter', async () => {
    const result = await AuditLogs.executeAuditLogsOperations.call(context, 0, 'export');
    expect(called.method).to.equal('POST');
    expect(called.url).to.include('UiPath.Server.Configuration.OData.Export');
    expect(called.url).to.include('exportName=logs-export');
    expect(called.url).to.include('$filter=Level eq 1');
    expect(called.options.headers['x-UIPATH-AuditedService']).to.equal('MyService');
  });

  it('should get audit log details by id', async () => {
    const result = await AuditLogs.executeAuditLogsOperations.call(context, 0, 'getDetails');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('GetAuditLogDetails(auditLogId=123)');
    expect(result.Id).to.equal('123');
  });

  it('should throw when auditLogId is missing for getDetails', async () => {
    const ctxMissing: any = {
      getNodeParameter: (name: string) => {
        const params: any = {
          auditedService: 'MyService',
          // auditLogId intentionally missing
        };
        return params[name];
      },
      getNode: () => ({}),
    };
    // import module again with same mock so function exists
    const AuditLogsLocal = proxyquire('../nodes/UiPathOrchestrator/operations/auditLogs', {
      '../GenericFunctions': {
        uiPathApiRequest: {
          call: async function() { return {}; },
        },
      },
    });

    let thrown = null;
    try {
      // @ts-ignore
      await AuditLogsLocal.executeAuditLogsOperations.call(ctxMissing, 0, 'getDetails');
    } catch (err: any) {
      thrown = err;
    }
    expect(thrown).to.not.equal(null);
    expect(thrown.message).to.include('Audit Log ID is required');
  });
});
