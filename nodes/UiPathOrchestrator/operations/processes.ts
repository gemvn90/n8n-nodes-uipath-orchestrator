import { IExecuteFunctions } from 'n8n-workflow';
import { uiPathApiRequest } from '../GenericFunctions';

export async function executeProcessesOperations(
	this: IExecuteFunctions,
	i: number,
	operation: string,
): Promise<any> {
	let responseData;

	if (operation === 'deletePackage') {
		const processKey = this.getNodeParameter('processKeyDelete', i) as string;
		const feedId = this.getNodeParameter('feedIdDelete', i) as string;
		let url = `/odata/Processes('${processKey}')`;
		if (feedId) url += `?feedId=${feedId}`;
		responseData = await uiPathApiRequest.call(this, 'DELETE', url);
	} else if (operation === 'downloadPackage') {
		const processKey = this.getNodeParameter('processKey', i) as string;
		const feedId = this.getNodeParameter('feedId', i) as string;
		let url = `/odata/Processes/UiPath.Server.Configuration.OData.DownloadPackage(key='${processKey}')`;
		if (feedId) url += `?feedId=${feedId}`;
		responseData = await uiPathApiRequest.call(this, 'GET', url);
	} else if (operation === 'getAll') {
		const take = this.getNodeParameter('take', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;
		responseData = await uiPathApiRequest.call(
			this,
			'GET',
			`/odata/Processes?$top=${Math.min(take || 20, 1000)}&$skip=${skip || 0}`,
		);
		responseData = responseData.value;
	} else if (operation === 'getArguments') {
		const processKey = this.getNodeParameter('processKeyArgs', i) as string;
		const expand = this.getNodeParameter('expandArgs', i) as string;
		const select = this.getNodeParameter('selectArgs', i) as string;
		let url = `/odata/Processes/UiPath.Server.Configuration.OData.GetArguments(key='${processKey}')`;
		const queryParams = [];
		if (expand) queryParams.push(`$expand=${expand}`);
		if (select) queryParams.push(`$select=${select}`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;
		responseData = await uiPathApiRequest.call(this, 'GET', url);
	} else if (operation === 'getProcessVersions') {
		const processId = this.getNodeParameter('processId', i) as string;
		const feedId = this.getNodeParameter('feedIdVersions', i) as string;
		const expand = this.getNodeParameter('expandVersions', i) as string;
		const filter = this.getNodeParameter('filterVersions', i) as string;
		const select = this.getNodeParameter('selectVersions', i) as string;
		const orderby = this.getNodeParameter('orderbyVersions', i) as string;
		const top = this.getNodeParameter('topVersions', i) as number;
		const skip = this.getNodeParameter('skipVersions', i) as number;
		const count = this.getNodeParameter('countVersions', i) as boolean;

		let url = `/odata/Processes/UiPath.Server.Configuration.OData.GetProcessVersions(processId='${processId}')`;
		const queryParams = [];
		if (feedId) queryParams.push(`feedId=${feedId}`);
		if (expand) queryParams.push(`$expand=${expand}`);
		if (filter) queryParams.push(`$filter=${filter}`);
		if (select) queryParams.push(`$select=${select}`);
		if (orderby) queryParams.push(`$orderby=${orderby}`);
		if (top && top > 0) queryParams.push(`$top=${top}`);
		if (skip && skip > 0) queryParams.push(`$skip=${skip}`);
		if (count) queryParams.push(`$count=true`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;
		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value;
	} else if (operation === 'uploadPackage') {
		const feedId = this.getNodeParameter('feedIdUpload', i) as string;
		const expand = this.getNodeParameter('expandUpload', i) as string;
		const filter = this.getNodeParameter('filterUpload', i) as string;
		const select = this.getNodeParameter('selectUpload', i) as string;
		const orderby = this.getNodeParameter('orderbyUpload', i) as string;
		const count = this.getNodeParameter('countUpload', i) as boolean;

		let url = `/odata/Processes/UiPath.Server.Configuration.OData.UploadPackage`;
		const queryParams = [];
		if (feedId) queryParams.push(`feedId=${feedId}`);
		if (expand) queryParams.push(`$expand=${expand}`);
		if (filter) queryParams.push(`$filter=${filter}`);
		if (select) queryParams.push(`$select=${select}`);
		if (orderby) queryParams.push(`$orderby=${orderby}`);
		if (count) queryParams.push(`$count=true`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;

		// Note: File upload handling would need to be implemented based on n8n's file handling
		responseData = await uiPathApiRequest.call(this, 'POST', url, {});
	}

	return responseData;
}
