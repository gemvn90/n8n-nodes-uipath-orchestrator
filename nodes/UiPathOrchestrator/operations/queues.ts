import { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { uiPathApiRequest } from '../GenericFunctions';

export async function executeQueuesOperations(
	this: IExecuteFunctions,
	i: number,
	operation: string,
): Promise<any> {
	let responseData;

	if (operation === 'addQueueItem') {
		const queueName = this.getNodeParameter('queueName', i) as string;

		if (!queueName || queueName.trim() === '') {
			throw new NodeOperationError(this.getNode(), 'Queue name is required');
		}

		const itemDataStr = this.getNodeParameter('itemData', i) as string;
		const priority = this.getNodeParameter('priority', i) as string;
		const reference = this.getNodeParameter('reference', i) as string;
		const dueDate = this.getNodeParameter('dueDate', i) as string;

		let itemData: IDataObject = {};
		try {
			if (itemDataStr && itemDataStr.trim() !== '{}') {
				itemData = JSON.parse(itemDataStr);
			}
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON in Item Data: ${(error as Error).message}`,
			);
		}

		if (priority) {
			itemData.Priority = priority;
		}

		const body: IDataObject = {
			queueName,
			itemData,
		};

		if (reference) {
			body.reference = reference;
		}

		if (dueDate) {
			body.dueDate = dueDate;
		}

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Queues/UiPathODataSvc.AddQueueItem',
			body,
		);
	} else if (operation === 'bulkAddQueueItems') {
		const queueName = this.getNodeParameter('queueName', i) as string;
		const bulkItemsStr = this.getNodeParameter('bulkItemsJson', i) as string;

		let bulkItemsJson = [];
		try {
			bulkItemsJson = JSON.parse(bulkItemsStr);
			if (!Array.isArray(bulkItemsJson)) {
				throw new Error('Bulk items must be an array');
			}
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON in Bulk Items: ${(error as Error).message}`,
			);
		}

		const body: IDataObject = {
			queueName,
			bulkItemsJson,
		};

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Queues/UiPathODataSvc.BulkAddQueueItems',
			body,
		);
	} else if (operation === 'getQueueItems') {
		const filter = this.getNodeParameter('filter', i) as string;
		const top = this.getNodeParameter('top', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;
		const select = this.getNodeParameter('select', i) as string;
		const orderby = this.getNodeParameter('orderby', i) as string;
		const count = this.getNodeParameter('count', i) as boolean;

		let url = '/odata/QueueItems';
		const queryParams = [];

		if (top) queryParams.push(`$top=${Math.min(top, 100)}`);
		if (skip) queryParams.push(`$skip=${skip}`);
		if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
		if (select) queryParams.push(`$select=${select}`);
		if (orderby) queryParams.push(`$orderby=${orderby}`);
		if (count) queryParams.push(`$count=true`);

		if (queryParams.length > 0) {
			url += '?' + queryParams.join('&');
		}

		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value || responseData;
	} else if (operation === 'getQueueItem') {
		const queueItemKey = this.getNodeParameter('queueItemKey', i) as string;

		if (!queueItemKey) {
			throw new NodeOperationError(this.getNode(), 'Queue item key is required');
		}

		responseData = await uiPathApiRequest.call(this, 'GET', `/odata/QueueItems('${queueItemKey}')`);
	} else if (operation === 'updateQueueItem') {
		const queueItemKey = this.getNodeParameter('queueItemKey', i) as string;

		if (!queueItemKey) {
			throw new NodeOperationError(this.getNode(), 'Queue item key is required');
		}

		const status = this.getNodeParameter('status', i) as string;
		const priority = this.getNodeParameter('priority', i) as number;
		const reference = this.getNodeParameter('reference', i) as string;
		const dueDate = this.getNodeParameter('dueDate', i) as string;
		const progress = this.getNodeParameter('progress', i) as string;
		const reviewStatus = this.getNodeParameter('reviewStatus', i) as string;
		const reviewerId = this.getNodeParameter('reviewerId', i) as number;
		const specificContentStr = this.getNodeParameter('specificContent', i) as string;

		const body: IDataObject = {};

		if (status) body.Status = status;
		if (priority !== undefined) body.Priority = priority;
		if (reference) body.Reference = reference;
		if (dueDate) body.DueDate = dueDate;
		if (progress) body.Progress = progress;
		if (reviewStatus) body.ReviewStatus = reviewStatus;
		if (reviewerId !== undefined && reviewerId > 0) body.ReviewerId = reviewerId;

		if (specificContentStr && specificContentStr.trim() !== '{}') {
			try {
				body.SpecificContent = JSON.parse(specificContentStr);
			} catch (error) {
				throw new NodeOperationError(
					this.getNode(),
					`Invalid JSON in Specific Content: ${(error as Error).message}`,
				);
			}
		}

		if (Object.keys(body).length === 0) {
			throw new NodeOperationError(this.getNode(), 'At least one field must be provided to update');
		}

		responseData = await uiPathApiRequest.call(
			this,
			'PUT',
			`/odata/QueueItems('${queueItemKey}')`,
			body,
		);
	} else if (operation === 'deleteQueueItem') {
		const queueItemKey = this.getNodeParameter('queueItemKey', i) as string;

		if (!queueItemKey) {
			throw new NodeOperationError(this.getNode(), 'Queue item key is required');
		}

		await uiPathApiRequest.call(this, 'DELETE', `/odata/QueueItems('${queueItemKey}')`);
		responseData = { success: true, key: queueItemKey };
	} else if (operation === 'deleteBulkQueueItems') {
		const filter = this.getNodeParameter('filter', i) as string;

		if (!filter) {
			throw new NodeOperationError(
				this.getNode(),
				'Filter is required for bulk delete operation',
			);
		}

		let url = '/odata/QueueItems';
		url += `?$filter=${encodeURIComponent(filter)}`;

		responseData = await uiPathApiRequest.call(this, 'DELETE', url);
		responseData = { success: true, message: 'Bulk delete completed' };
	} else if (operation === 'getQueueItemComments') {
		const filter = this.getNodeParameter('filter', i) as string;
		const top = this.getNodeParameter('top', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;
		const orderby = this.getNodeParameter('orderby', i) as string;

		let url = '/odata/QueueItemComments';
		const queryParams = [];

		if (top) queryParams.push(`$top=${Math.min(top, 100)}`);
		if (skip) queryParams.push(`$skip=${skip}`);
		if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
		if (orderby) queryParams.push(`$orderby=${orderby}`);

		if (queryParams.length > 0) {
			url += '?' + queryParams.join('&');
		}

		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value || responseData;
	} else if (operation === 'getQueueItemCommentHistory') {
		const filter = this.getNodeParameter('filter', i) as string;
		const top = this.getNodeParameter('top', i) as number;
		const orderby = this.getNodeParameter('orderby', i) as string;

		let url = '/odata/QueueItemComments/UiPath.Server.Configuration.OData.GetQueueItemCommentsHistory';
		const queryParams = [];

		if (top) queryParams.push(`$top=${Math.min(top, 100)}`);
		if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
		if (orderby) queryParams.push(`$orderby=${orderby}`);

		if (queryParams.length > 0) {
			url += '?' + queryParams.join('&');
		}

		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value || responseData;
	} else if (operation === 'createQueueItemComment') {
		const queueItemId = this.getNodeParameter('queueItemId', i) as number;
		const content = this.getNodeParameter('content', i) as string;
		const author = this.getNodeParameter('author', i) as string;

		const body: IDataObject = {
			QueueItemId: queueItemId,
			Content: content,
		};

		if (author) {
			body.Author = author;
		}

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/QueueItemComments',
			body,
		);
	} else if (operation === 'updateQueueItemComment') {
		const commentKey = this.getNodeParameter('commentKey', i) as string;
		const content = this.getNodeParameter('content', i) as string;
		const status = this.getNodeParameter('commentStatus', i) as string;

		const body: IDataObject = {};

		if (content) body.Content = content;
		if (status) body.Status = status;

		responseData = await uiPathApiRequest.call(
			this,
			'PUT',
			`/odata/QueueItemComments('${commentKey}')`,
			body,
		);
	} else if (operation === 'deleteQueueItemComment') {
		const commentKey = this.getNodeParameter('commentKey', i) as string;

		await uiPathApiRequest.call(this, 'DELETE', `/odata/QueueItemComments('${commentKey}')`);
		responseData = { success: true, key: commentKey };
	} else if (operation === 'getQueueItemEvents') {
		const filter = this.getNodeParameter('filter', i) as string;
		const top = this.getNodeParameter('top', i) as number;
		const skip = this.getNodeParameter('skip', i) as number;
		const orderby = this.getNodeParameter('orderby', i) as string;

		let url = '/odata/QueueItemEvents';
		const queryParams = [];

		if (top) queryParams.push(`$top=${Math.min(top, 100)}`);
		if (skip) queryParams.push(`$skip=${skip}`);
		if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
		if (orderby) queryParams.push(`$orderby=${orderby || 'CreatedDate desc'}`);

		if (queryParams.length > 0) {
			url += '?' + queryParams.join('&');
		}

		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value || responseData;
	} else if (operation === 'getQueueItemEventHistory') {
		const filter = this.getNodeParameter('filter', i) as string;
		const top = this.getNodeParameter('top', i) as number;
		const orderby = this.getNodeParameter('orderby', i) as string;

		let url = '/odata/QueueItemEvents/UiPath.Server.Configuration.OData.GetQueueItemEventsHistory';
		const queryParams = [];

		if (top) queryParams.push(`$top=${Math.min(top, 100)}`);
		if (filter) queryParams.push(`$filter=${encodeURIComponent(filter)}`);
		if (orderby) queryParams.push(`$orderby=${orderby}`);

		if (queryParams.length > 0) {
			url += '?' + queryParams.join('&');
		}

		responseData = await uiPathApiRequest.call(this, 'GET', url);
		responseData = responseData.value || responseData;
	} else if (operation === 'setTransactionProgress') {
		const queueItemId = this.getNodeParameter('queueItemId', i) as number;

		if (!queueItemId || queueItemId <= 0) {
			throw new NodeOperationError(this.getNode(), 'Valid queue item ID is required');
		}

		const progress = this.getNodeParameter('progress', i) as string;

		const body: IDataObject = {
			QueueItemId: queueItemId,
			Progress: progress,
		};

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			`/odata/QueueItems(${queueItemId})/UiPathODataSvc.SetTransactionProgress`,
			body,
		);
	} else if (operation === 'setItemReviewer') {
		const userId = this.getNodeParameter('userId', i) as number;
		const itemIdsStr = this.getNodeParameter('itemIds', i) as string;

		if (!itemIdsStr) {
			throw new NodeOperationError(this.getNode(), 'At least one item ID must be provided');
		}

		let itemIds = [];
		try {
			const parsed = JSON.parse(itemIdsStr);
			itemIds = Array.isArray(parsed) ? parsed : itemIdsStr.split(',').map((id) => parseInt(id.trim(), 10));
		} catch {
			itemIds = itemIdsStr.split(',').map((id) => parseInt(id.trim(), 10));
		}

		const body: IDataObject = {
			UserId: userId || null,
			QueueItems: itemIds,
		};

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/QueueItems/UiPathODataSvc.SetItemReviewer',
			body,
		);
	} else if (operation === 'setItemReviewStatus') {
		const status = this.getNodeParameter('reviewStatus', i) as string;
		const itemIdsStr = this.getNodeParameter('itemIds', i) as string;

		if (!status) {
			throw new NodeOperationError(this.getNode(), 'Review status is required');
		}
		if (!itemIdsStr) {
			throw new NodeOperationError(this.getNode(), 'At least one item ID must be provided');
		}

		let itemIds = [];
		try {
			const parsed = JSON.parse(itemIdsStr);
			itemIds = Array.isArray(parsed) ? parsed : itemIdsStr.split(',').map((id) => parseInt(id.trim(), 10));
		} catch {
			itemIds = itemIdsStr.split(',').map((id) => parseInt(id.trim(), 10));
		}

		const body: IDataObject = {
			Status: status,
			QueueItems: itemIds,
		};

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/QueueItems/UiPathODataSvc.SetItemReviewStatus',
			body,
		);
	} else if (operation === 'startTransaction') {
		const queueName = this.getNodeParameter('queueName', i) as string;
		const robotId = this.getNodeParameter('robotId', i) as number;

		const transactionData: IDataObject = {
			Name: queueName,
		};

		if (robotId && robotId > 0) {
			transactionData.RobotIdentifier = robotId.toString();
		}

		const body: IDataObject = {
			transactionData,
		};

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			'/odata/Queues/UiPathODataSvc.StartTransaction',
			body,
		);
	} else if (operation === 'setTransactionResult') {
		const queueItemId = this.getNodeParameter('queueItemId', i) as number;
		const transactionStatus = this.getNodeParameter('transactionStatus', i) as string;
		const outputDataStr = this.getNodeParameter('outputData', i) as string;

		let outputData = {};
		try {
			if (outputDataStr && outputDataStr.trim() !== '{}') {
				outputData = JSON.parse(outputDataStr);
			}
		} catch (error) {
			throw new NodeOperationError(
				this.getNode(),
				`Invalid JSON in Output Data: ${(error as Error).message}`,
			);
		}

		const transactionResult: IDataObject = {
			Status: transactionStatus,
			OutputData: JSON.stringify(outputData),
		};

		if (transactionStatus === 'Failed') {
			const errorType = this.getNodeParameter('errorType', i) as string;
			const errorReason = this.getNodeParameter('errorReason', i) as string;
			transactionResult.ErrorType = errorType;
			if (errorReason) {
				transactionResult.Reason = errorReason;
			}
		}

		const body: IDataObject = {
			transactionResult,
		};

		responseData = await uiPathApiRequest.call(
			this,
			'POST',
			`/odata/Queues(${queueItemId})/UiPathODataSvc.SetTransactionResult`,
			body,
		);
	}

	return responseData;
}
