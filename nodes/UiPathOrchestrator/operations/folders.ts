import { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError, IDataObject } from 'n8n-workflow';
import { uiPathApiRequest } from '../GenericFunctions';

export async function executeFoldersOperations(
	this: IExecuteFunctions,
	i: number,
	operation: string,
): Promise<any> {
	let responseData;

	if (operation === 'assignDomainUser') {
		const username = this.getNodeParameter('username', i) as string;
		const folderAssignmentsStr = this.getNodeParameter('folderAssignments', i) as string;
		let folderAssignments = [];
		try {
			folderAssignments = JSON.parse(folderAssignmentsStr || '[]');
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON in Folder Assignments: ${(error as Error).message}`,
			);
		}
		const body = {
			username,
			folderAssignments,
		};
		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Folders/UiPath.Server.Configuration.OData.AssignDomainUser',
			body,
		);
	} else if (operation === 'assignMachines') {
		const folderIdsStr = this.getNodeParameter('folderIds', i) as string;
		const machineIdsStr = this.getNodeParameter('machineIds', i) as string;
		let folderIds = [];
		let machineIds = [];
		try {
			folderIds = JSON.parse(folderIdsStr || '[]');
			machineIds = JSON.parse(machineIdsStr || '[]');
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON: ${(error as Error).message}`,
			);
		}
		const body = {
			folderIds,
			machineIds,
		};
		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Folders/UiPath.Server.Configuration.OData.AssignMachines',
			body,
		);
	} else if (operation === 'assignUsers') {
		const userIdsStr = this.getNodeParameter('userIds', i) as string;
		const folderAssignmentsStr = this.getNodeParameter('folderAssignments', i) as string;
		let userIds = [];
		let folderAssignments = [];
		try {
			userIds = JSON.parse(userIdsStr || '[]');
			folderAssignments = JSON.parse(folderAssignmentsStr || '[]');
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON: ${(error as Error).message}`,
			);
		}
		const body = {
			userIds,
			folderAssignments,
		};
		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Folders/UiPath.Server.Configuration.OData.AssignUsers',
			body,
		);
	} else if (operation === 'delete') {
		const key = this.getNodeParameter('key', i) as string;
		responseData = await uiPathApiRequest.call(this, 'DELETE', `/odata/Folders(key='${key}')`);
	} else if (operation === 'get') {
		const key = this.getNodeParameter('key', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
		let query = `/odata/Folders/UiPath.Server.Configuration.OData.GetByKey(identifier='${key}')`;
		const queryParams = [];
		if (additionalFields.expand) queryParams.push(`$expand=${additionalFields.expand}`);
		if (additionalFields.filter) queryParams.push(`$filter=${additionalFields.filter}`);
		if (additionalFields.select) queryParams.push(`$select=${additionalFields.select}`);
		if (additionalFields.orderby) queryParams.push(`$orderby=${additionalFields.orderby}`);
		if (queryParams.length > 0) query += '?' + queryParams.join('&');
		responseData = await uiPathApiRequest.call(this, 'GET', query);
	} else if (operation === 'getAll') {
		const take = this.getNodeParameter('take', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;
		responseData = await uiPathApiRequest.call(
			this,
			'GET',
			`/odata/Folders?$top=${take || 20}&$skip=${skip || 0}`,
		);
		responseData = responseData.value;
	} else if (operation === 'getAllRolesForUser') {
		const username = this.getNodeParameter('username', i) as string;
		const take = this.getNodeParameter('take', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
		let query = `/odata/Folders/UiPath.Server.Configuration.OData.GetAllRolesForUser(username='${username}',skip=${skip},take=${take})`;
		const queryParams = [];
		if (additionalFields.type) queryParams.push(`type=${additionalFields.type}`);
		if (additionalFields.searchText) queryParams.push(`searchText=${additionalFields.searchText}`);
		if (queryParams.length > 0) query += '?' + queryParams.join('&');
		responseData = await uiPathApiRequest.call(this, 'GET', query);
	} else if (operation === 'getMachinesForFolder') {
		const key = this.getNodeParameter('key', i) as string;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
		let query = `/odata/Folders/UiPath.Server.Configuration.OData.GetMachinesForFolder(key='${key}')`;
		const queryParams = [];
		if (additionalFields.top) queryParams.push(`$top=${additionalFields.top}`);
		if (additionalFields.skip) queryParams.push(`$skip=${additionalFields.skip}`);
		if (queryParams.length > 0) query += '?' + queryParams.join('&');
		responseData = await uiPathApiRequest.call(this, 'GET', query);
	} else if (operation === 'getMoveFolderMachinesChanges') {
		const folderId = this.getNodeParameter('folderId', i) as number;
		const targetParentId = this.getNodeParameter('targetParentId', i) as number;
		responseData = await uiPathApiRequest.call(
			this,
			'GET',
			`/odata/Folders/UiPath.Server.Configuration.OData.GetMoveFolderMachinesChanges?folderId=${folderId}&targetParentId=${targetParentId}`,
		);
	} else if (operation === 'getSubfoldersWithAssignedMachine') {
		const rootFolderId = this.getNodeParameter('rootFolderId', i) as number;
		const machineId = this.getNodeParameter('machineId', i) as number;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
		let query = `/odata/Folders/UiPath.Server.Configuration.OData.GetSubfoldersWithAssignedMachine?rootFolderId=${rootFolderId}`;
		if (machineId) query += `&machineId=${machineId}`;
		if (additionalFields.top) query += `&$top=${additionalFields.top}`;
		if (additionalFields.skip) query += `&$skip=${additionalFields.skip}`;
		responseData = await uiPathApiRequest.call(this, 'GET', query);
	} else if (operation === 'getUsersForFolder') {
		const key = this.getNodeParameter('key', i) as string;
		const includeInherited = this.getNodeParameter('includeInherited', i) as boolean;
		const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
		let query = `/odata/Folders/UiPath.Server.Configuration.OData.GetUsersForFolder(key='${key}',includeInherited=${includeInherited})`;
		const queryParams = [];
		if (additionalFields.includeAlertsEnabled)
			queryParams.push(`includeAlertsEnabled=${additionalFields.includeAlertsEnabled}`);
		if (additionalFields.top) queryParams.push(`$top=${additionalFields.top}`);
		if (additionalFields.skip) queryParams.push(`$skip=${additionalFields.skip}`);
		if (queryParams.length > 0) query += '?' + queryParams.join('&');
		responseData = await uiPathApiRequest.call(this, 'GET', query);
	} else if (operation === 'toggleFolderMachineInherit') {
		const folderId = this.getNodeParameter('folderId', i) as number;
		const inheritMachines = this.getNodeParameter('inheritMachines', i) as boolean;
		const body = {
			folderId,
			inheritMachines,
		};
		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Folders/UiPath.Server.Configuration.OData.ToggleFolderMachineInherit',
			body,
		);
	} else if (operation === 'update') {
		const key = this.getNodeParameter('key', i) as string;
		const name = this.getNodeParameter('name', i) as string;
		const description = this.getNodeParameter('description', i) as string;
		const body = {
			key,
			displayName: name,
			description,
		};
		responseData = await uiPathApiRequest.call(
			this,
			'PATCH',
			`/odata/Folders(key='${key}')`,
			body,
		);
	} else if (operation === 'updateMachinesToFolderAssociations') {
		const folderId = this.getNodeParameter('folderId', i) as number;
		const machineIdsToAddStr = this.getNodeParameter('machineIdsToAdd', i) as string;
		const machineIdsToRemoveStr = this.getNodeParameter('machineIdsToRemove', i) as string;
		let machineIdsToAdd = [];
		let machineIdsToRemove = [];
		try {
			machineIdsToAdd = JSON.parse(machineIdsToAddStr || '[]');
			machineIdsToRemove = JSON.parse(machineIdsToRemoveStr || '[]');
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON: ${(error as Error).message}`,
			);
		}
		const body = {
			folderId,
			machineIdsToAdd,
			machineIdsToRemove,
		};
		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Folders/UiPath.Server.Configuration.OData.UpdateMachinesToFolderAssociations',
			body,
		);
	}

	return responseData;
}
