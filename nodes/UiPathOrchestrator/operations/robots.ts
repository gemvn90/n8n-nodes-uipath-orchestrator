import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { uiPathApiRequest } from '../GenericFunctions';

export async function executeRobotsOperations(
	this: IExecuteFunctions,
	i: number,
	operation: string,
): Promise<any> {
	let responseData;

	if (operation === 'getAll') {
		const top = this.getNodeParameter('top', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;
		const filter = this.getNodeParameter('filter', i) as string;
		const select = this.getNodeParameter('select', i) as string;
		const orderBy = this.getNodeParameter('orderBy', i) as string;
		const count = this.getNodeParameter('count', i) as boolean;
		const expand = this.getNodeParameter('expand', i) as string;

		let url = `/odata/Robots`;
		const queryParams = [];
		if (top) queryParams.push(`$top=${Math.min(top, 1000)}`);
		if (skip) queryParams.push(`$skip=${skip}`);
		if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
		if (select) queryParams.push(`$select=${encodeURIComponent(select)}`);
		if (orderBy) queryParams.push(`$orderby=${encodeURIComponent(orderBy)}`);
		if (count) queryParams.push(`$count=true`);
		if (expand) queryParams.push(`$expand=${encodeURIComponent(expand)}`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;

		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value;
	} else if (operation === 'get') {
		const robotId = this.getNodeParameter('robotId', i) as string;
		responseData = await uiPathApiRequest.call(this, 'GET', `/odata/Robots('${robotId}')`);
	} else if (operation === 'create') {
		const robotName = this.getNodeParameter('robotName', i) as string;
		const machineName = this.getNodeParameter('machineName', i) as string;
		const username = this.getNodeParameter('username', i) as string;
		const robotType = this.getNodeParameter('robotType', i) as string;
		const enabled = this.getNodeParameter('enabled', i) as boolean;
		const description = this.getNodeParameter('description', i) as string;

		const body: IDataObject = {
			Name: robotName,
			MachineName: machineName,
			Username: username,
			RobotType: robotType,
			Enabled: enabled,
		};

		if (description) {
			body.Description = description;
		}

		responseData = await uiPathApiRequest.call(this, 'POST', `/odata/Robots`, body);
	} else if (operation === 'update') {
		const robotId = this.getNodeParameter('robotId', i) as string;
		const updateDataStr = this.getNodeParameter('updateData', i) as string;

		let updateData = {};
		try {
			if (updateDataStr) {
				updateData = JSON.parse(updateDataStr);
			}
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON in Update Data: ${(error as Error).message}`,
			);
		}

		responseData = await uiPathApiRequest.call(
			this,
			'PUT',
			`/odata/Robots('${robotId}')`,
			updateData,
		);
	} else if (operation === 'partialUpdate') {
		const robotId = this.getNodeParameter('robotId', i) as string;
		const updateDataStr = this.getNodeParameter('updateData', i) as string;

		let updateData = {};
		try {
			if (updateDataStr) {
				updateData = JSON.parse(updateDataStr);
			}
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON in Update Data: ${(error as Error).message}`,
			);
		}

		responseData = await uiPathApiRequest.call(
			this,
			'PATCH',
			`/odata/Robots('${robotId}')`,
			updateData,
		);
	} else if (operation === 'delete') {
		const robotId = this.getNodeParameter('robotId', i) as string;
		responseData = await uiPathApiRequest.call(this, 'DELETE', `/odata/Robots('${robotId}')`);
	} else if (operation === 'deleteBulk') {
		const robotIdsStr = this.getNodeParameter('robotIds', i) as string;

		let robotIds: string[] = [];
		try {
			robotIds = JSON.parse(robotIdsStr);
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON in Robot IDs: ${(error as Error).message}`,
			);
		}

		const body: IDataObject = {
			robotIds,
		};

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			`/odata/Robots/UiPath.Server.Configuration.OData.DeleteBulk`,
			body,
		);
	} else if (operation === 'convertToFloating') {
		const standardRobotId = this.getNodeParameter('standardRobotId', i) as string;

		const body: IDataObject = {
			robotId: standardRobotId,
		};

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			`/odata/Robots/UiPath.Server.Configuration.OData.ConvertToFloating`,
			body,
		);
	} else if (operation === 'findAcrossFolders') {
		const filter = this.getNodeParameter('filter', i) as string;
		const top = this.getNodeParameter('top', i) as number;

		let url = `/odata/Robots/UiPath.Server.Configuration.OData.FindAllAcrossFolders`;
		const queryParams = [];
		if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
		if (top) queryParams.push(`$top=${Math.min(top, 1000)}`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;

		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value;
	} else if (operation === 'getConfiguredRobots') {
		const filter = this.getNodeParameter('filter', i) as string;
		const top = this.getNodeParameter('top', i) as number;

		let url = `/odata/Robots/UiPath.Server.Configuration.OData.GetConfiguredRobots`;
		const queryParams = [];
		if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
		if (top) queryParams.push(`$top=${Math.min(top, 1000)}`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;

		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value;
	} else if (operation === 'getFolderRobots') {
		const folderId = this.getNodeParameter('folderId', i) as string;
		const machineId = this.getNodeParameter('machineId', i, '') as string;

		// Fix: GET requests should not have body, use query parameters instead
		let url = `/odata/Robots/UiPath.Server.Configuration.OData.GetFolderRobots`;
		const queryParams: string[] = [];
		queryParams.push(`folderId=${folderId}`);
		if (machineId) queryParams.push(`machineId=${machineId}`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;

		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value || responseData;
	} else if (operation === 'getMachineNameMappings') {
		responseData = await uiPathApiRequest.call(
			this,
			'GET',
			`/odata/Robots/UiPath.Server.Configuration.OData.GetMachineNameToLicenseKeyMappings`,
		);
		responseData = responseData.value;
	} else if (operation === 'getRobotsForProcess') {
		const processId = this.getNodeParameter('processId', i) as string;
		const filter = this.getNodeParameter('filter', i) as string;

		let url = `/odata/Robots/UiPath.Server.Configuration.OData.GetRobotsForProcess(processId='${processId}')`;
		if (filter) url += `?$filter=${encodeURIComponent(filter)}`;

		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value;
	} else if (operation === 'getRobotsFromFolder') {
		const folderId = this.getNodeParameter('folderId', i) as string;
		const filter = this.getNodeParameter('filter', i) as string;

		let url = `/odata/Robots/UiPath.Server.Configuration.OData.GetRobotsFromFolder(folderId=${folderId})`;
		if (filter) url += `?$filter=${encodeURIComponent(filter)}`;

		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value;
	} else if (operation === 'getUsernames') {
		const filter = this.getNodeParameter('filter', i) as string;

		let url = `/odata/Robots/UiPath.Server.Configuration.OData.GetUsernames`;
		if (filter) url += `?$filter=${encodeURIComponent(filter)}`;

		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value;
	} else if (operation === 'toggleEnabledStatus') {
		const robotIdsStr = this.getNodeParameter('robotIds', i) as string;
		const enabled = this.getNodeParameter('enabled', i) as boolean;

		let robotIds: string[] = [];
		try {
			robotIds = JSON.parse(robotIdsStr);
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON in Robot IDs: ${(error as Error).message}`,
			);
		}

		const body: IDataObject = {
			robotIds,
			enabled,
		};

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			`/odata/Robots/UiPath.Server.Configuration.OData.ToggleEnabledStatus`,
			body,
		);
	}

	return responseData;
}
