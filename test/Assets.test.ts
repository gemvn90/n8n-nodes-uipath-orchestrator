

import { expect } from 'chai';
import proxyquire from 'proxyquire';

describe('Assets Operations', () => {
  let context: any;
  let called: any;
  let Assets: any;

  beforeEach(() => {
    called = {};
    context = {
      getNodeParameter: (name: string) => {
        const params: any = {
          name: 'TestAsset',
          valueType: 'Text',
          value: '123',
          description: 'desc',
          robotValue: '',
          robotId: 1,
          assetId: '42',
          take: 10,
          skip: 0,
        };
        return params[name];
      },
      getNode: () => ({}),
    };
    // Mock uiPathApiRequest using proxyquire
    Assets = proxyquire('../nodes/UiPathOrchestrator/operations/assets', {
      '../GenericFunctions': {
        uiPathApiRequest: {
          call: async function(self: any, method: string, url: string, body?: any) {
            called = { method, url, body };
            if (method === 'GET' && url.startsWith('/odata/Assets')) {
              return { value: [{ Id: '42', Name: 'TestAsset' }] };
            }
            if (method === 'POST' && url === '/odata/Assets') {
              return { Id: '42', ...body };
            }
            if (method === 'PUT') {
              return { success: true };
            }
            if (method === 'DELETE') {
              return { success: true };
            }
            return {};
          },
        },
      },
    });
  });

  it('should create asset', async () => {
    const result = await Assets.executeAssetsOperations.call(context, 0, 'createAsset');
    expect(called.method).to.equal('POST');
    expect(called.url).to.equal('/odata/Assets');
    expect(result).to.have.property('Id');
    expect(result.Name).to.equal('TestAsset');
  });

  it('should get asset', async () => {
    const result = await Assets.executeAssetsOperations.call(context, 0, 'getAsset');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('/odata/Assets(42)');
    expect(result.value[0].Name).to.equal('TestAsset');
  });

  it('should update asset', async () => {
    const result = await Assets.executeAssetsOperations.call(context, 0, 'updateAsset');
    expect(called.method).to.equal('PUT');
    expect(called.url).to.include('/odata/Assets(42)');
    expect(result.success).to.be.true;
  });

  it('should delete asset', async () => {
    const result = await Assets.executeAssetsOperations.call(context, 0, 'deleteAsset');
    expect(called.method).to.equal('DELETE');
    expect(called.url).to.include('/odata/Assets(42)');
    expect(result.success).to.be.true;
  });

  it('should get all assets', async () => {
    const result = await Assets.executeAssetsOperations.call(context, 0, 'getAll');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('/odata/Assets');
    expect(result[0].Name).to.equal('TestAsset');
  });

  it('should get filtered assets', async () => {
    context.getNodeParameter = (name: string) => {
      const params: any = {
        filter: "ValueType eq 'Text'",
        select: 'Id,Name',
        top: 10,
        skipFiltered: 0,
      };
      return params[name];
    };
    const result = await Assets.executeAssetsOperations.call(context, 0, 'getFiltered');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('/odata/Assets/UiPath.Server.Configuration.OData.GetFiltered');
    expect(called.url).to.include('filter');
    expect(result[0]).to.have.property('Name');
  });

  it('should get assets across folders', async () => {
    context.getNodeParameter = (name: string) => {
      const params: any = {
        excludeFolderId: '0',
        filter: "ValueType eq 'Text'",
        select: 'Id,Name',
        orderby: 'Name asc',
        top: 10,
        skip: 0,
        count: false,
      };
      return params[name];
    };
    const result = await Assets.executeAssetsOperations.call(context, 0, 'getAssetsAcrossFolders');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('/odata/Assets/UiPath.Server.Configuration.OData.GetAssetsAcrossFolders');
    expect(result[0]).to.have.property('Name');
  });

  it('should get folders for asset', async () => {
    context.getNodeParameter = (name: string) => {
      const params: any = {
        assetIdForFolders: '42',
        expandAssetFolders: '',
        selectAssetFolders: '',
      };
      return params[name];
    };
    const result = await Assets.executeAssetsOperations.call(context, 0, 'getFoldersForAsset');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('/odata/Assets/UiPath.Server.Configuration.OData.GetFoldersForAsset');
    expect(result.value[0]).to.have.property('Name');
  });

  it('should get robot asset by robot key', async () => {
    context.getNodeParameter = (name: string) => {
      const params: any = {
        robotKey: 'robot1',
        assetName: 'asset1',
      };
      return params[name];
    };
    const result = await Assets.executeAssetsOperations.call(context, 0, 'getRobotAsset');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('/odata/Assets/UiPath.Server.Configuration.OData.GetRobotAsset');
    expect(result.value[0]).to.have.property('Name');
  });

  it('should get robot asset by robot ID', async () => {
    context.getNodeParameter = (name: string) => {
      const params: any = {
        robotNumericId: 1,
        assetName: 'asset1',
      };
      return params[name];
    };
    const result = await Assets.executeAssetsOperations.call(context, 0, 'getRobotAssetByRobotId');
    expect(called.method).to.equal('GET');
    expect(called.url).to.include('/odata/Assets/UiPath.Server.Configuration.OData.GetRobotAssetByRobotId');
    expect(result.value[0]).to.have.property('Name');
  });

  it('should get robot asset by name for robot key', async () => {
    context.getNodeParameter = (name: string) => {
      const params: any = {
        bodyJson: '{"robotKey":"robot1","assetName":"asset1"}',
      };
      return params[name];
    };
    const result = await Assets.executeAssetsOperations.call(context, 0, 'getRobotAssetByNameForRobotKey');
    expect(called.method).to.equal('POST');
    expect(called.url).to.include('/odata/Assets/UiPath.Server.Configuration.OData.GetRobotAssetByNameForRobotKey');
    expect(called.body).to.have.property('robotKey');
  });

  it('should set robot asset by robot key', async () => {
    context.getNodeParameter = (name: string) => {
      const params: any = {
        bodyJson: '{"robotKey":"robot1","assetName":"asset1","value":"newValue"}',
      };
      return params[name];
    };
    const result = await Assets.executeAssetsOperations.call(context, 0, 'setRobotAssetByRobotKey');
    expect(called.method).to.equal('POST');
    expect(called.url).to.include('/odata/Assets/UiPath.Server.Configuration.OData.SetRobotAssetByRobotKey');
    expect(called.body).to.have.property('robotKey');
  });

  it('should share asset to folders', async () => {
    context.getNodeParameter = (name: string) => {
      const params: any = {
        assetIdsJson: '[42, 43]',
        assetToAddFolderIds: '[1, 2]',
        assetToRemoveFolderIds: '[3]',
      };
      return params[name];
    };
    const result = await Assets.executeAssetsOperations.call(context, 0, 'shareToFolders');
    expect(called.method).to.equal('POST');
    expect(called.url).to.include('/odata/Assets/UiPath.Server.Configuration.OData.ShareToFolders');
    expect(called.body.AssetIds).to.be.an('array');
    expect(called.body.AssetIds).to.include(42);
    expect(called.body.ToAddFolderIds).to.be.an('array');
  });
});
