import { IExecuteFunctions } from 'n8n-workflow';
import { uiPathApiRequest } from '../GenericFunctions';

export async function executeDirectoryServiceOperations(
	this: IExecuteFunctions,
	i: number,
	operation: string,
): Promise<any> {
	let responseData;

	if (operation === 'getDomains') {
		responseData = await uiPathApiRequest.call(this, 'GET', '/api/DirectoryService/GetDomains');
	} else if (operation === 'searchUsersAndGroups') {
		const searchContext = this.getNodeParameter('searchContext', i) as string;
		const domain = this.getNodeParameter('domain', i) as string;
		const prefix = this.getNodeParameter('prefix', i) as string;
		let query = '/api/DirectoryService/SearchForUsersAndGroups?';
		if (searchContext) query += `searchContext=${searchContext}&`;
		if (domain) query += `domain=${domain}&`;
		if (prefix) query += `prefix=${prefix}`;
		responseData = await uiPathApiRequest.call(this, 'GET', query);
	}

	return responseData;
}
