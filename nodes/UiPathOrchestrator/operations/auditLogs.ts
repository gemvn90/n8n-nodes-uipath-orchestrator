import { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { uiPathApiRequest } from '../GenericFunctions';

export async function executeAuditLogsOperations(
	this: IExecuteFunctions,
	i: number,
	operation: string,
): Promise<any> {
	let responseData;

	if (operation === 'getAll') {
		const auditedService = this.getNodeParameter('auditedService', i) as string;
		const filter = this.getNodeParameter('filter', i) as string;
		const select = this.getNodeParameter('select', i) as string;
		const orderBy = this.getNodeParameter('orderBy', i) as string;
		const top = this.getNodeParameter('top', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;
		const expand = this.getNodeParameter('expand', i) as string;
		const count = this.getNodeParameter('count', i) as boolean;

		let url = `/odata/AuditLogs`;
		const queryParams = [];

		if (top) queryParams.push(`$top=${Math.min(top, 1000)}`);
		if (skip) queryParams.push(`$skip=${skip}`);
		if (filter) queryParams.push(`$filter=${filter}`);
		if (select) queryParams.push(`$select=${select}`);
		if (orderBy) queryParams.push(`$orderby=${orderBy}`);
		if (count) queryParams.push(`$count=true`);
		if (expand) queryParams.push(`$expand=${expand}`);

		if (queryParams.length > 0) url += '?' + queryParams.join('&');

		const headers: { [key: string]: string } = {};
		if (auditedService) {
			headers['x-UIPATH-AuditedService'] = auditedService;
		}

		responseData = await uiPathApiRequest.call(this, 'GET', url, undefined, { headers });
		responseData = responseData.value;
	} else if (operation === 'export') {
		const auditedService = this.getNodeParameter('auditedService', i) as string;
		const filter = this.getNodeParameter('filter', i) as string;
		const exportName = this.getNodeParameter('exportName', i) as string;

		let url = `/odata/AuditLogs/UiPath.Server.Configuration.OData.Export`;
		const queryParams = [];

		if (filter) queryParams.push(`$filter=${filter}`);
		if (exportName) queryParams.push(`exportName=${exportName}`);

		if (queryParams.length > 0) url += '?' + queryParams.join('&');

		const headers: { [key: string]: string } = {};
		if (auditedService) {
			headers['x-UIPATH-AuditedService'] = auditedService;
		}

		responseData = await uiPathApiRequest.call(this, 'POST', url, {}, { headers });
	} else if (operation === 'getDetails') {
		const auditedService = this.getNodeParameter('auditedService', i) as string;
		const auditLogId = this.getNodeParameter('auditLogId', i) as string;

		if (!auditLogId) {
			throw new NodeOperationError(
				this.getNode(),
				'Audit Log ID is required',
			);
		}

		let url = `/odata/AuditLogs/UiPath.Server.Configuration.OData.GetAuditLogDetails(auditLogId=${auditLogId})`;

		const headers: { [key: string]: string } = {};
		if (auditedService) {
			headers['x-UIPATH-AuditedService'] = auditedService;
		}

		responseData = await uiPathApiRequest.call(this, 'GET', url, undefined, { headers });
	}

	return responseData;
}
