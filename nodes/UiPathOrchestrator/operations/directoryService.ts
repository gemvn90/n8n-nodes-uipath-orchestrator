import { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { uiPathApiRequest } from '../GenericFunctions';

export async function executeDirectoryServiceOperations(
	this: IExecuteFunctions,
	i: number,
	operation: string,
): Promise<any> {
	let responseData;

	if (operation === 'getDomains') {
		responseData = await uiPathApiRequest.call(this, 'GET', '/api/DirectoryService/GetDomains');
		
		// Ensure array response and handle empty results
		if (!responseData) {
			responseData = [];
		}
		
		if (Array.isArray(responseData) && responseData.length === 0) {
			return [{
				message: 'No domains configured',
				note: 'Directory service may not be enabled or configured'
			}];
		}
	} else if (operation === 'searchUsersAndGroups') {
		const searchContext = this.getNodeParameter('searchContext', i, '') as string;
		const domain = this.getNodeParameter('domain', i, '') as string;
		const prefix = this.getNodeParameter('prefix', i, '') as string;
		
		// Validate at least one parameter provided
		if (!searchContext && !domain && !prefix) {
			throw new NodeOperationError(
				this.getNode(),
				'At least one search parameter (searchContext, domain, or prefix) is required'
			);
		}
		
		// Validate prefix length if provided
		if (prefix && prefix.length < 3) {
			throw new NodeOperationError(
				this.getNode(),
				'Prefix must be at least 3 characters for search'
			);
		}
		
		// Validate domain format if provided
		if (domain) {
			const domainRegex = /^[a-zA-Z0-9.-]+$/;
			if (!domainRegex.test(domain)) {
				throw new NodeOperationError(
					this.getNode(),
					'Invalid domain format. Only alphanumeric characters, dots, and hyphens are allowed'
				);
			}
		}
		
		// Fix: Build query string with proper URL encoding
		const queryParams: string[] = [];
		if (searchContext) queryParams.push(`searchContext=${encodeURIComponent(searchContext)}`);
		if (domain) queryParams.push(`domain=${encodeURIComponent(domain)}`);
		if (prefix) queryParams.push(`prefix=${encodeURIComponent(prefix)}`);
		
		let url = '/api/DirectoryService/SearchForUsersAndGroups';
		if (queryParams.length > 0) {
			url += `?${queryParams.join('&')}`;
		}
		
		responseData = await uiPathApiRequest.call(this, 'GET', url);
		
		// Normalize response structure
		if (responseData && responseData.value) {
			responseData = responseData.value;
		}
		
		// Ensure results are returned
		if (!responseData || (Array.isArray(responseData) && responseData.length === 0)) {
			return [{
				message: 'No users or groups found',
				searchContext,
				domain,
				prefix
			}];
		}
	} else if (operation === 'getDirectoryPermissions') {
		responseData = await uiPathApiRequest.call(
			this,
			'GET',
			'/api/DirectoryService/GetDirectoryPermissions'
		);
		
		// Ensure array response
		if (!responseData) {
			responseData = [];
		}
	}

	return responseData;
}
