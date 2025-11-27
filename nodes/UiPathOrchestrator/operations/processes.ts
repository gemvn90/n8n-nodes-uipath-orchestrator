import { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { uiPathApiRequest } from '../GenericFunctions';

export async function executeProcessesOperations(
	this: IExecuteFunctions,
	i: number,
	operation: string,
): Promise<any> {
	let responseData;

	if (operation === 'deletePackage') {
		const processKey = this.getNodeParameter('processKeyDelete', i) as string;
		const feedId = this.getNodeParameter('feedIdDelete', i, '') as string;
		
		// Validate required parameter
		if (!processKey) {
			throw new NodeOperationError(this.getNode(), 'Process key is required');
		}
		
		// URL encode the process key to handle special characters
		let url = `/odata/Releases('${encodeURIComponent(processKey)}')`;
		if (feedId) url += `?feedId=${encodeURIComponent(feedId)}`;
		
		responseData = await uiPathApiRequest.call(this, 'DELETE', url);
		responseData = { success: true, key: processKey };
	} else if (operation === 'downloadPackage') {
		const processKey = this.getNodeParameter('processKey', i) as string;
		const feedId = this.getNodeParameter('feedId', i, '') as string;
		
		// Validate required parameter
		if (!processKey) {
			throw new NodeOperationError(this.getNode(), 'Process key is required');
		}
		
		// NOTE: This operation returns binary data (package file .nupkg)
		// Currently returns the raw response. For full binary handling, would need:
		// 1. Request with { encoding: null, json: false }
		// 2. Buffer handling with this.helpers.prepareBinaryData()
		// 3. Return format: { json: {...}, binary: { data: binaryItem } }
		
		// URL encode the process key to handle special characters
		let url = `/odata/Processes/UiPath.Server.Configuration.OData.DownloadPackage(key='${encodeURIComponent(processKey)}')`;
		if (feedId) url += `?feedId=${encodeURIComponent(feedId)}`;
		
		responseData = await uiPathApiRequest.call(this, 'GET', url);
		
		// Add metadata to response
		if (!responseData || typeof responseData !== 'object') {
			responseData = {
				message: 'Package downloaded',
				processKey,
				note: 'Binary data handling may require additional configuration'
			};
		}
	} else if (operation === 'getAll') {
		const take = this.getNodeParameter('take', i, 20) as number;
		const skip = this.getNodeParameter('skip', i, 0) as number;
		
		// Build URL with proper validation
		const topValue = Math.min(take > 0 ? take : 20, 1000);
		const skipValue = skip > 0 ? skip : 0;
		
		responseData = await uiPathApiRequest.call(
			this,
			'GET',
			`/odata/Releases?$top=${topValue}&$skip=${skipValue}`,
		);
		responseData = responseData.value || responseData;
	} else if (operation === 'getArguments') {
		const processKey = this.getNodeParameter('processKeyArgs', i) as string;
		const expand = this.getNodeParameter('expandArgs', i, '') as string;
		const select = this.getNodeParameter('selectArgs', i, '') as string;
		
		// Validate required parameter
		if (!processKey) {
			throw new NodeOperationError(this.getNode(), 'Process key is required');
		}
		
		// URL encode the process key to handle special characters
		let url = `/odata/Releases/UiPath.Server.Configuration.OData.GetArguments(key='${encodeURIComponent(processKey)}')`;
		const queryParams: string[] = [];
		if (expand) queryParams.push(`$expand=${expand}`);
		if (select) queryParams.push(`$select=${select}`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;
		
		responseData = await uiPathApiRequest.call(this, 'GET', url);
		
		// Normalize response structure
		if (responseData && responseData.value !== undefined) {
			responseData = responseData.value;
		}
	} else if (operation === 'getProcessVersions') {
		const processId = this.getNodeParameter('processId', i) as string;
		const feedId = this.getNodeParameter('feedIdVersions', i, '') as string;
		const expand = this.getNodeParameter('expandVersions', i, '') as string;
		const filter = this.getNodeParameter('filterVersions', i, '') as string;
		const select = this.getNodeParameter('selectVersions', i, '') as string;
		const orderby = this.getNodeParameter('orderbyVersions', i, '') as string;
		const top = this.getNodeParameter('topVersions', i, 0) as number;
		const skip = this.getNodeParameter('skipVersions', i, 0) as number;
		const count = this.getNodeParameter('countVersions', i, false) as boolean;

		// Validate required parameter
		if (!processId) {
			throw new NodeOperationError(this.getNode(), 'Process ID is required');
		}

		// URL encode the process ID to handle special characters
		let url = `/odata/Releases/UiPath.Server.Configuration.OData.GetProcessVersions(processId='${encodeURIComponent(processId)}')`;
		const queryParams: string[] = [];
		if (feedId) queryParams.push(`feedId=${encodeURIComponent(feedId)}`);
		if (expand) queryParams.push(`$expand=${expand}`);
		if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
		if (select) queryParams.push(`$select=${select}`);
		if (orderby) queryParams.push(`$orderby=${orderby}`);
		if (top && top > 0) queryParams.push(`$top=${Math.min(top, 1000)}`);
		if (skip && skip > 0) queryParams.push(`$skip=${skip}`);
		if (count) queryParams.push(`$count=true`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;
		
		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value || responseData;
	} else if (operation === 'uploadPackage') {
		const feedId = this.getNodeParameter('feedIdUpload', i, '') as string;

		// NOTE: File upload with multipart/form-data is not fully implemented
		// Full implementation would require:
		// 1. Binary property parameter (binaryPropertyName)
		// 2. this.helpers.assertBinaryData() to get binary data
		// 3. this.helpers.getBinaryDataBuffer() to get file buffer
		// 4. Multipart form-data construction with file metadata
		// 5. Custom headers: 'Content-Type': 'multipart/form-data'
		
		// Current implementation provides a placeholder response
		throw new NodeOperationError(
			this.getNode(),
			'Upload Package operation is not fully implemented. ' +
			'This operation requires multipart/form-data file upload support. ' +
			'Please use the UiPath Orchestrator web interface or API directly for package uploads.'
		);
		
		// Placeholder for future implementation:
		// const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i, 'data') as string;
		// const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
		// const buffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);
		// 
		// let url = `/odata/Processes/UiPath.Server.Configuration.OData.UploadPackage`;
		// if (feedId) url += `?feedId=${encodeURIComponent(feedId)}`;
		// 
		// responseData = await uiPathApiRequest.call(this, 'POST', url, formData, {}, headers);
	} else if (operation === 'setArguments') {
		const processKey = this.getNodeParameter('processKeySetArgs', i) as string;
		const argumentsStr = this.getNodeParameter('arguments', i, '{}') as string;
		
		// Validate required parameter
		if (!processKey) {
			throw new NodeOperationError(this.getNode(), 'Process key is required');
		}
		
		// Parse and validate arguments JSON
		let argumentsObj: any = {};
		try {
			argumentsObj = JSON.parse(argumentsStr || '{}');
			
			if (typeof argumentsObj !== 'object' || Array.isArray(argumentsObj)) {
				throw new Error('Arguments must be a JSON object, not an array');
			}
			
			// Validate argument structure
			for (const [argName, argValue] of Object.entries(argumentsObj)) {
				if (typeof argValue !== 'object' || argValue === null) {
					throw new Error(`Argument "${argName}" must be an object with metadata (type, required, hasDefault, etc.)`);
				}
			}
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON in Arguments: ${(error as Error).message}`
			);
		}
		
		const body = {
			key: processKey,
			arguments: argumentsObj,
		};
		
		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Releases/UiPath.Server.Configuration.OData.SetArguments',
			body,
		);
		
		// Provide explicit success response
		if (!responseData || typeof responseData !== 'object') {
			responseData = {
				success: true,
				key: processKey,
				argumentsSet: Object.keys(argumentsObj).length,
			};
		}
	}

	return responseData;
}
