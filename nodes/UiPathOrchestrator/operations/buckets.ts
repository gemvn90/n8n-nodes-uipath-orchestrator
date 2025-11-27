import { IExecuteFunctions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { uiPathApiRequest } from '../GenericFunctions';

export async function executeBucketsOperations(
	this: IExecuteFunctions,
	i: number,
	operation: string,
): Promise<any> {
	let responseData;

	if (operation === 'createBucket') {
		const name = this.getNodeParameter('name', i) as string;
		const description = this.getNodeParameter('description', i) as string;
		const bucketType = this.getNodeParameter('bucketType', i) as string;
		const isActive = this.getNodeParameter('isActive', i) as boolean;

		// Validate bucket type
		if (bucketType) {
			const validBucketTypes = ['FileSystem', 'AzureBlob', 'AmazonS3', 'MinIO'];
			if (!validBucketTypes.includes(bucketType)) {
				throw new NodeOperationError(
					this.getNode(),
					`Invalid bucket type: ${bucketType}. Valid types are: ${validBucketTypes.join(', ')}`
				);
			}
		}

		const body: any = {
			Name: name,
		};
		if (description) body.Description = description;
		if (bucketType) body.BucketType = bucketType;
		if (typeof isActive === 'boolean') body.IsActive = isActive;

		responseData = await uiPathApiRequest.call(this, 'POST', '/odata/Buckets', body);
	} else if (operation === 'getBuckets') {
		const filter = this.getNodeParameter('filter', i) as string;
		const select = this.getNodeParameter('select', i) as string;
		const orderby = this.getNodeParameter('orderby', i) as string;
		const top = this.getNodeParameter('top', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;
		const count = this.getNodeParameter('count', i) as boolean;

		let url = '/odata/Buckets';
		const queryParams: string[] = [];
		if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
		if (select) queryParams.push(`$select=${select}`);
		if (orderby) queryParams.push(`$orderby=${orderby}`);
		if (top && top > 0) queryParams.push(`$top=${Math.min(top, 1000)}`);
		if (skip && skip > 0) queryParams.push(`$skip=${skip}`);
		if (count) queryParams.push(`$count=true`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;

		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value || responseData;
	} else if (operation === 'getBucket') {
		const bucketId = this.getNodeParameter('bucketId', i) as string;
		const expand = this.getNodeParameter('expand', i) as string;
		const select = this.getNodeParameter('select', i) as string;

		let url = `/odata/Buckets(${bucketId})`;
		const queryParams: string[] = [];
		if (expand) queryParams.push(`$expand=${expand}`);
		if (select) queryParams.push(`$select=${select}`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;

		responseData = await uiPathApiRequest.call(this, 'GET', url);
	} else if (operation === 'updateBucket') {
		const bucketId = this.getNodeParameter('bucketId', i) as string;
		const description = this.getNodeParameter('description', i) as string;
		const isActive = this.getNodeParameter('isActive', i) as boolean;

		const body: any = {};
		if (description) body.Description = description;
		if (typeof isActive === 'boolean') body.IsActive = isActive;

		responseData = await uiPathApiRequest.call(this, 'PUT', `/odata/Buckets(${bucketId})`, body);
	} else if (operation === 'deleteBucket') {
		const bucketId = this.getNodeParameter('bucketId', i) as string;
		responseData = await uiPathApiRequest.call(this, 'DELETE', `/odata/Buckets(${bucketId})`);
		responseData = { success: true, id: bucketId };
	} else if (operation === 'getDirectories') {
		const bucketId = this.getNodeParameter('bucketId', i) as string;
		const directory = this.getNodeParameter('directory', i) as string;
		const top = this.getNodeParameter('top', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;

		let url = `/odata/Buckets(${bucketId})/UiPath.Server.Configuration.OData.GetDirectories`;
		const queryParams: string[] = [];
		if (directory) queryParams.push(`directory=${encodeURIComponent(directory)}`);
		if (top && top > 0) queryParams.push(`$top=${top}`);
		if (skip && skip > 0) queryParams.push(`$skip=${skip}`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;

		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value || responseData;
	} else if (operation === 'listFiles') {
		const bucketId = this.getNodeParameter('bucketId', i) as string;
		const directory = this.getNodeParameter('directory', i) as string;
		const recursive = this.getNodeParameter('recursive', i) as boolean;
		const fileNameGlob = this.getNodeParameter('fileNameGlob', i) as string;
		const top = this.getNodeParameter('top', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;

		let url = `/odata/Buckets(${bucketId})/UiPath.Server.Configuration.OData.GetFiles`;
		const queryParams: string[] = [];
		if (directory) queryParams.push(`directory=${encodeURIComponent(directory)}`);
		if (recursive !== undefined) queryParams.push(`recursive=${recursive}`);
		if (fileNameGlob) queryParams.push(`fileNameGlob=${encodeURIComponent(fileNameGlob)}`);
		if (top && top > 0) queryParams.push(`$top=${Math.min(top, 1000)}`);
		if (skip && skip > 0) queryParams.push(`$skip=${skip}`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;

		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value || responseData;
	} else if (operation === 'getFile') {
		const bucketId = this.getNodeParameter('bucketId', i) as string;
		const path = this.getNodeParameter('path', i) as string;
		
		// Enhanced path validation
		if (!path) {
			throw new NodeOperationError(this.getNode(), 'Path is required');
		}
		if (path.includes('..')) {
			throw new NodeOperationError(this.getNode(), 'Invalid path: directory traversal not allowed');
		}
		if (!path.startsWith('/')) {
			throw new NodeOperationError(this.getNode(), 'Path must start with /');
		}
		
		const url = `/odata/Buckets(${bucketId})/UiPath.Server.Configuration.OData.GetFile?path=${encodeURIComponent(path)}`;
		responseData = await uiPathApiRequest.call(this, 'GET', url);
	} else if (operation === 'deleteFile') {
		const bucketId = this.getNodeParameter('bucketId', i) as string;
		const path = this.getNodeParameter('path', i) as string;
		
		// Enhanced path validation
		if (!path) {
			throw new NodeOperationError(this.getNode(), 'Path is required');
		}
		if (path.includes('..')) {
			throw new NodeOperationError(this.getNode(), 'Invalid path: directory traversal not allowed');
		}
		if (!path.startsWith('/')) {
			throw new NodeOperationError(this.getNode(), 'Path must start with /');
		}
		
		const url = `/odata/Buckets(${bucketId})/UiPath.Server.Configuration.OData.DeleteFile?path=${encodeURIComponent(path)}`;
		responseData = await uiPathApiRequest.call(this, 'DELETE', url);
		responseData = { success: true, path };
	} else if (operation === 'getReadUri') {
		const bucketId = this.getNodeParameter('bucketId', i) as string;
		const path = this.getNodeParameter('path', i) as string;
		const expiryInMinutes = this.getNodeParameter('expiryInMinutes', i) as number;
		const url = `/odata/Buckets(${bucketId})/UiPath.Server.Configuration.OData.GetReadUri?path=${encodeURIComponent(path)}${expiryInMinutes ? `&expiryInMinutes=${expiryInMinutes}` : ''}`;
		responseData = await uiPathApiRequest.call(this, 'GET', url);
	} else if (operation === 'getWriteUri') {
		const bucketId = this.getNodeParameter('bucketId', i) as string;
		const path = this.getNodeParameter('path', i) as string;
		const expiryInMinutes = this.getNodeParameter('expiryInMinutes', i) as number;
		const contentType = this.getNodeParameter('contentType', i, '') as string;
		
		// Validate content type format if provided
		if (contentType) {
			const mimeTypeRegex = /^[a-zA-Z0-9][a-zA-Z0-9!#$&^_+-]*(\/[a-zA-Z0-9][a-zA-Z0-9!#$&^_+.-]*)?$/;
			if (!mimeTypeRegex.test(contentType)) {
				throw new NodeOperationError(
					this.getNode(),
					`Invalid content type format: ${contentType}`
				);
			}
		}
		
		let url = `/odata/Buckets(${bucketId})/UiPath.Server.Configuration.OData.GetWriteUri?path=${encodeURIComponent(path)}`;
		if (expiryInMinutes) url += `&expiryInMinutes=${expiryInMinutes}`;
		if (contentType) url += `&contentType=${encodeURIComponent(contentType)}`;
		responseData = await uiPathApiRequest.call(this, 'GET', url);
	} else if (operation === 'shareToFolders') {
		const bucketsJson = this.getNodeParameter('bucketsJson', i) as string;
		const toAddFolderIds = this.getNodeParameter('toAddFolderIds', i) as string;
		const toRemoveFolderIds = this.getNodeParameter('toRemoveFolderIds', i) as string;

		let bucketIds = [];
		let folderIdsToAdd = [];
		let folderIdsToRemove = [];
		try {
			bucketIds = JSON.parse(bucketsJson || '[]');
			folderIdsToAdd = JSON.parse(toAddFolderIds || '[]');
			folderIdsToRemove = JSON.parse(toRemoveFolderIds || '[]');
			
			// Validate parsed values are arrays
			if (!Array.isArray(bucketIds) || !Array.isArray(folderIdsToAdd) || !Array.isArray(folderIdsToRemove)) {
				throw new Error('All parameters must be arrays');
			}
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON: ${(error as Error).message}`,
			);
		}

		const body = {
			bucketIds: bucketIds,
			toAddFolderIds: folderIdsToAdd,
			toRemoveFolderIds: folderIdsToRemove,
		};
		
		await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Buckets/UiPath.Server.Configuration.OData.ShareToFolders',
			body,
		);
		
		// Provide explicit success response for 204 No Content
		responseData = { 
			success: true, 
			bucketIds: body.bucketIds,
			addedToFolders: body.toAddFolderIds,
			removedFromFolders: body.toRemoveFolderIds
		};
	} else if (operation === 'getBucketsAcrossFolders') {
		const excludeFolderId = this.getNodeParameter('excludeFolderId', i, '') as string;
		const filter = this.getNodeParameter('filter', i, '') as string;
		const select = this.getNodeParameter('select', i, '') as string;
		const orderby = this.getNodeParameter('orderby', i, '') as string;
		const top = this.getNodeParameter('top', i, 0) as number;
		const skip = this.getNodeParameter('skip', i, 0) as number;
		const count = this.getNodeParameter('count', i, false) as boolean;
		
		let url = '/odata/Buckets/UiPath.Server.Configuration.OData.GetBucketsAcrossFolders';
		const queryParams: string[] = [];
		if (excludeFolderId) queryParams.push(`excludeFolderId=${encodeURIComponent(excludeFolderId)}`);
		if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
		if (select) queryParams.push(`$select=${select}`);
		if (orderby) queryParams.push(`$orderby=${orderby}`);
		if (top > 0) queryParams.push(`$top=${Math.min(top, 1000)}`);
		if (skip > 0) queryParams.push(`$skip=${skip}`);
		if (count) queryParams.push(`$count=true`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;
		
		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value || responseData;
	} else if (operation === 'getFoldersForBucket') {
		const bucketId = this.getNodeParameter('bucketId', i) as string;
		const expand = this.getNodeParameter('expand', i, '') as string;
		const select = this.getNodeParameter('select', i, '') as string;
		
		if (!bucketId) {
			throw new NodeOperationError(this.getNode(), 'Bucket ID is required');
		}
		
		let url = `/odata/Buckets/UiPath.Server.Configuration.OData.GetFoldersForBucket(id=${bucketId})`;
		const queryParams: string[] = [];
		if (expand) queryParams.push(`$expand=${expand}`);
		if (select) queryParams.push(`$select=${select}`);
		if (queryParams.length > 0) url += `?${queryParams.join('&')}`;
		
		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value || responseData;
	}

	return responseData;
}
