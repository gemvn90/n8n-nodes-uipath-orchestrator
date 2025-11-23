import { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { uiPathApiRequest } from '../GenericFunctions';

export async function executeAssetsOperations(
	this: IExecuteFunctions,
	i: number,
	operation: string,
): Promise<any> {
	let responseData;

	if (operation === 'getFoldersForAsset') {
		const assetId = this.getNodeParameter('assetIdForFolders', i) as string;
		const expand = this.getNodeParameter('expandAssetFolders', i) as string;
		const select = this.getNodeParameter('selectAssetFolders', i) as string;
		let url = `/odata/Assets/UiPath.Server.Configuration.OData.GetFoldersForAsset(id=${assetId})`;
		const queryParams = [];
		if (expand) queryParams.push(`$expand=${expand}`);
		if (select) queryParams.push(`$select=${select}`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;
		responseData = await uiPathApiRequest.call(this, 'GET', url);
	} else if (operation === 'getRobotAsset') {
		const robotKey = this.getNodeParameter('robotKey', i) as string;
		const name = this.getNodeParameter('assetName', i) as string;
		let url = `/odata/Assets/UiPath.Server.Configuration.OData.GetRobotAsset(robotId='${robotKey}',assetName='${name}')`;
		responseData = await uiPathApiRequest.call(this, 'GET', url);
	} else if (operation === 'getRobotAssetByNameForRobotKey') {
		const bodyStr = this.getNodeParameter('bodyJson', i) as string;
		let body = {};
		try {
			body = JSON.parse(bodyStr || '{}');
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Invalid JSON: ${(error as Error).message}`);
		}
		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Assets/UiPath.Server.Configuration.OData.GetRobotAssetByNameForRobotKey',
			body,
		);
	} else if (operation === 'getRobotAssetByRobotId') {
		const robotId = this.getNodeParameter('robotNumericId', i) as number;
		const name = this.getNodeParameter('assetName', i) as string;
		let url = `/odata/Assets/UiPath.Server.Configuration.OData.GetRobotAssetByRobotId(robotId=${robotId},assetName='${name}')`;
		responseData = await uiPathApiRequest.call(this, 'GET', url);
	} else if (operation === 'setRobotAssetByRobotKey') {
		const bodyStr = this.getNodeParameter('bodyJson', i) as string;
		let body = {};
		try {
			body = JSON.parse(bodyStr || '{}');
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Invalid JSON: ${(error as Error).message}`);
		}
		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Assets/UiPath.Server.Configuration.OData.SetRobotAssetByRobotKey',
			body,
		);
	} else if (operation === 'shareToFolders') {
		const assetIdsJson = this.getNodeParameter('assetIdsJson', i) as string;
		const toAdd = this.getNodeParameter('assetToAddFolderIds', i) as string;
		const toRemove = this.getNodeParameter('assetToRemoveFolderIds', i) as string;

		let assetIds = [];
		let toAddIds = [];
		let toRemoveIds = [];
		try {
			assetIds = JSON.parse(assetIdsJson || '[]');
			toAddIds = JSON.parse(toAdd || '[]');
			toRemoveIds = JSON.parse(toRemove || '[]');
		} catch (error) {
			throw new NodeOperationError(this.getNode(), `Invalid JSON: ${(error as Error).message}`);
		}

		const body = {
			AssetIds: assetIds,
			ToAddFolderIds: toAddIds,
			ToRemoveFolderIds: toRemoveIds,
		};
		responseData = await uiPathApiRequest.call(this, 'POST', '/odata/Assets/UiPath.Server.Configuration.OData.ShareToFolders', body);
	} else if (operation === 'getAll') {
		const top = this.getNodeParameter('take', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;
		let url = '/odata/Assets';
		const queryParams: string[] = [];
		if (top && top > 0) queryParams.push(`$top=${Math.min(top, 1000)}`);
		if (skip && skip > 0) queryParams.push(`$skip=${skip}`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;
		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value || responseData;
	}

	// GetFiltered (recommended) - OData function
	else if (operation === 'getFiltered') {
		const filter = this.getNodeParameter('filter', i) as string;
		const select = this.getNodeParameter('select', i) as string;
		const top = this.getNodeParameter('top', i) as number;
		const skip = this.getNodeParameter('skipFiltered', i) as number;
		let url = '/odata/Assets/UiPath.Server.Configuration.OData.GetFiltered';
		const queryParams: string[] = [];
		if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
		if (select) queryParams.push(`$select=${select}`);
		if (top && top > 0) queryParams.push(`$top=${Math.min(top, 1000)}`);
		if (skip && skip > 0) queryParams.push(`$skip=${skip}`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;
		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value || responseData;
	}

	// Get assets across folders
	else if (operation === 'getAssetsAcrossFolders') {
		const excludeFolderId = this.getNodeParameter('excludeFolderId', i) as string;
		const filter = this.getNodeParameter('filter', i) as string;
		const select = this.getNodeParameter('select', i) as string;
		const orderby = this.getNodeParameter('orderby', i) as string;
		const top = this.getNodeParameter('top', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;
		const count = this.getNodeParameter('count', i) as boolean;

		let url = '/odata/Assets/UiPath.Server.Configuration.OData.GetAssetsAcrossFolders';
		const queryParams: string[] = [];
		if (excludeFolderId) queryParams.push(`excludeFolderId=${encodeURIComponent(excludeFolderId)}`);
		if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
		if (select) queryParams.push(`$select=${select}`);
		if (orderby) queryParams.push(`$orderby=${orderby}`);
		if (top && top > 0) queryParams.push(`$top=${Math.min(top, 1000)}`);
		if (skip && skip > 0) queryParams.push(`$skip=${skip}`);
		if (count) queryParams.push(`$count=true`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;
		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value || responseData;
	}

	// Create Asset
	else if (operation === 'createAsset') {
		const name = this.getNodeParameter('name', i) as string;
		const valueType = this.getNodeParameter('valueType', i) as string;

		if (!name) {
			throw new NodeOperationError(this.getNode(), 'Asset name is required');
		}
		if (!valueType) {
			throw new NodeOperationError(this.getNode(), 'Value type is required');
		}

		const value = this.getNodeParameter('value', i) as string;
		const description = this.getNodeParameter('description', i) as string;
		const robotValue = this.getNodeParameter('robotValue', i) as string;
		const robotId = this.getNodeParameter('robotId', i) as number;

		const body: any = {
			Name: name,
			ValueType: valueType,
		};
		if (value) body.Value = value;
		if (description) body.Description = description;
		if (robotValue) body.RobotValue = robotValue;
		if (robotId) body.RobotId = robotId;

		responseData = await uiPathApiRequest.call(this, 'POST', '/odata/Assets', body);
	}

	// Get Asset by ID
	else if (operation === 'getAsset') {
		const assetId = this.getNodeParameter('assetId', i) as string;

		if (!assetId) {
			throw new NodeOperationError(this.getNode(), 'Asset ID is required');
		}

		const expand = this.getNodeParameter('expandAssetFolders', i) as string;
		const select = this.getNodeParameter('selectAssetFolders', i) as string;
		let url = `/odata/Assets(${assetId})`;
		const queryParams: string[] = [];
		if (expand) queryParams.push(`$expand=${expand}`);
		if (select) queryParams.push(`$select=${select}`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;
		responseData = await uiPathApiRequest.call(this, 'GET', url);
	}

	// Update Asset
	else if (operation === 'updateAsset') {
		const assetId = this.getNodeParameter('assetId', i) as string;

		if (!assetId) {
			throw new NodeOperationError(this.getNode(), 'Asset ID is required');
		}

		const name = this.getNodeParameter('name', i) as string;
		const valueType = this.getNodeParameter('valueType', i) as string;
		const value = this.getNodeParameter('value', i) as string;
		const description = this.getNodeParameter('description', i) as string;
		const robotValue = this.getNodeParameter('robotValue', i) as string;
		const robotId = this.getNodeParameter('robotId', i) as number;

		const body: any = {};
		if (name) body.Name = name;
		if (valueType) body.ValueType = valueType;
		if (value) body.Value = value;
		if (description) body.Description = description;
		if (robotValue) body.RobotValue = robotValue;
		if (robotId) body.RobotId = robotId;

		if (Object.keys(body).length === 0) {
			throw new NodeOperationError(this.getNode(), 'At least one field must be provided to update');
		}

		responseData = await uiPathApiRequest.call(this, 'PUT', `/odata/Assets(${assetId})`, body);
	}

	// Delete Asset
	else if (operation === 'deleteAsset') {
		const assetId = this.getNodeParameter('assetId', i) as string;

		if (!assetId) {
			throw new NodeOperationError(this.getNode(), 'Asset ID is required');
		}

		await uiPathApiRequest.call(this, 'DELETE', `/odata/Assets(${assetId})`);
		responseData = { success: true, id: assetId };
	}

	return responseData;
}
