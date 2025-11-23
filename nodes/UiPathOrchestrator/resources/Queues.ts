import { INodeProperties } from 'n8n-workflow';

export const queuesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['queues'],
			},
		},
		options: [
			{
				name: 'Add Queue Item',
				value: 'addQueueItem',
				description: 'Add a new item to a queue',
				action: 'Add a queue item',
			},
			{
				name: 'Bulk Add Queue Items',
				value: 'bulkAddQueueItems',
				description: 'Add multiple items to a queue in batch',
				action: 'Bulk add queue items',
			},
			{
				name: 'Create Queue Item Comment',
				value: 'createQueueItemComment',
				description: 'Add a comment to a queue item',
				action: 'Create queue item comment',
			},
			{
				name: 'Delete Bulk Queue Items',
				value: 'deleteBulkQueueItems',
				description: 'Delete multiple queue items using filter',
				action: 'Delete bulk queue items',
			},
			{
				name: 'Delete Queue Item',
				value: 'deleteQueueItem',
				description: 'Delete a queue item by key',
				action: 'Delete queue item',
			},
			{
				name: 'Delete Queue Item Comment',
				value: 'deleteQueueItemComment',
				description: 'Delete a comment from queue item',
				action: 'Delete queue item comment',
			},
			{
				name: 'Get Queue Item',
				value: 'getQueueItem',
				description: 'Get details of a specific queue item',
				action: 'Get queue item',
			},
			{
				name: 'Get Queue Item Comments',
				value: 'getQueueItemComments',
				description: 'Get all comments for queue items',
				action: 'Get queue item comments',
			},
			{
				name: 'Get Queue Item Comment History',
				value: 'getQueueItemCommentHistory',
				description: 'Get historical changes to queue item comments',
				action: 'Get queue item comment history',
			},
			{
				name: 'Get Queue Item Events',
				value: 'getQueueItemEvents',
				description: 'Get events for queue items',
				action: 'Get queue item events',
			},
			{
				name: 'Get Queue Item Event History',
				value: 'getQueueItemEventHistory',
				description: 'Get historical event data for queue items',
				action: 'Get queue item event history',
			},
			{
				name: 'Get Queue Items',
				value: 'getQueueItems',
				description: 'Get all queue items with filtering',
				action: 'Get queue items',
			},
			{
				name: 'Set Item Reviewer',
				value: 'setItemReviewer',
				description: 'Assign a reviewer to queue items',
				action: 'Set item reviewer',
			},
			{
				name: 'Set Item Review Status',
				value: 'setItemReviewStatus',
				description: 'Update review status of queue items',
				action: 'Set item review status',
			},
			{
				name: 'Set Transaction Progress',
				value: 'setTransactionProgress',
				description: 'Update the progress field of a transaction',
				action: 'Set transaction progress',
			},
			{
				name: 'Set Transaction Result',
				value: 'setTransactionResult',
				description: 'Mark transaction as complete (success/failure)',
				action: 'Set transaction result',
			},
			{
				name: 'Start Transaction',
				value: 'startTransaction',
				description: 'Start processing a queue item',
				action: 'Start a transaction',
			},
			{
				name: 'Update Queue Item',
				value: 'updateQueueItem',
				description: 'Update properties of a queue item',
				action: 'Update queue item',
			},
			{
				name: 'Update Queue Item Comment',
				value: 'updateQueueItemComment',
				description: 'Modify an existing comment on queue item',
				action: 'Update queue item comment',
			},
		],
		default: 'addQueueItem',
	},
];

export const queuesFields: INodeProperties[] = [
	// Common fields for multiple operations
	{
		displayName: 'Queue Name',
		name: 'queueName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['addQueueItem', 'startTransaction', 'bulkAddQueueItems'],
			},
		},
		required: true,
		default: '',
		description: 'The name of the queue or queue definition ID',
	},
	// AddQueueItem operation fields
	{
		displayName: 'Item Data',
		name: 'itemData',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['addQueueItem'],
			},
		},
		required: true,
		default: '{}',
		description: 'Queue item specific content as JSON (e.g., {"Name": "John", "ID": 123})',
	},
	{
		displayName: 'Priority',
		name: 'priority',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['addQueueItem'],
			},
		},
		options: [
			{
				name: 'Low',
				value: 'Low',
			},
			{
				name: 'Normal',
				value: 'Normal',
			},
			{
				name: 'High',
				value: 'High',
			},
		],
		default: 'Normal',
		description: 'Priority of the queue item',
	},
	{
		displayName: 'Reference',
		name: 'reference',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['addQueueItem'],
			},
		},
		default: '',
		description: 'Optional reference for the queue item',
	},
	{
		displayName: 'Due Date',
		name: 'dueDate',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['addQueueItem'],
			},
		},
		default: '',
		description: 'Due date in ISO 8601 format (e.g., 2024-11-25T10:00:00Z)',
	},
	// BulkAddQueueItems operation fields
	{
		displayName: 'Bulk Items JSON',
		name: 'bulkItemsJson',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['bulkAddQueueItems'],
			},
		},
		required: true,
		default: '[]',
		description: 'Array of items as JSON: [{"reference":"REF1","priority":"High","itemData":{...}},...]',
	},
	// GetQueueItems operation fields
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['getQueueItems'],
			},
		},
		default: '',
		description: 'OData filter expression (e.g., Status eq \'Pending\')',
	},
	{
		displayName: 'Top',
		name: 'top',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['getQueueItems'],
			},
		},
		default: 10,
		description: 'Number of items to return (max 100)',
	},
	{
		displayName: 'Skip',
		name: 'skip',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['getQueueItems'],
			},
		},
		default: 0,
		description: 'Number of items to skip',
	},
	// GetQueueItem/DeleteQueueItem operation fields
	{
		displayName: 'Queue Item ID',
		name: 'queueItemId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['getQueueItem', 'deleteQueueItem', 'setTransactionProgress'],
			},
		},
		required: true,
		default: 0,
		description: 'The ID of the queue item',
	},
	// UpdateQueueItem operation fields
	{
		displayName: 'Progress',
		name: 'progress',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['setTransactionProgress'],
			},
		},
		required: true,
		default: '',
		description: 'Progress value (e.g., "Step 2 of 5" or "50%")',
	},
	// SetItemReviewer operation fields
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['setItemReviewer'],
			},
		},
		default: 0,
		description: 'The ID of the user to assign as reviewer (0 to clear)',
	},
	{
		displayName: 'Queue Item IDs',
		name: 'itemIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['setItemReviewer', 'setItemReviewStatus'],
			},
		},
		required: true,
		default: '[]',
		description: 'Comma-separated list or JSON array of queue item IDs',
	},
	// SetItemReviewStatus operation fields
	{
		displayName: 'Review Status',
		name: 'reviewStatus',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['setItemReviewStatus'],
			},
		},
		required: true,
		options: [
			{
				name: 'Approved',
				value: 'Approved',
			},
			{
				name: 'Rejected',
				value: 'Rejected',
			},
			{
				name: 'Sent Back',
				value: 'SentBack',
			},
		],
		default: 'Approved',
		description: 'The new review status',
	},
	// StartTransaction operation fields
	{
		displayName: 'Robot ID',
		name: 'robotId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['startTransaction'],
			},
		},
		default: 0,
		description: 'The ID of the robot requesting the transaction. Use 0 for automatic assignment',
	},
	// SetTransactionResult operation fields
	{
		displayName: 'Status',
		name: 'transactionStatus',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['setTransactionResult'],
			},
		},
		required: true,
		options: [
			{
				name: 'Successful',
				value: 'Successful',
			},
			{
				name: 'Failed',
				value: 'Failed',
			},
		],
		default: 'Successful',
		description: 'The status of the transaction',
	},
	{
		displayName: 'Error Type',
		name: 'errorType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['setTransactionResult'],
				transactionStatus: ['Failed'],
			},
		},
		options: [
			{
				name: 'Application',
				value: 'Application',
			},
			{
				name: 'Business',
				value: 'Business',
			},
		],
		default: 'Application',
		description: 'The type of error that occurred',
	},
	{
		displayName: 'Error Reason',
		name: 'errorReason',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['setTransactionResult'],
				transactionStatus: ['Failed'],
			},
		},
		default: '',
		description: 'Reason for the failure',
	},
	{
		displayName: 'Output Data',
		name: 'outputData',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['setTransactionResult'],
			},
		},
		default: '{}',
		description: 'Output data as JSON object',
	},
	// UpdateQueueItem operation fields
	{
		displayName: 'Queue Item Key',
		name: 'queueItemKey',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['updateQueueItem', 'getQueueItem', 'deleteQueueItem'],
			},
		},
		required: true,
		default: '',
		description: 'The unique identifier (GUID) of the queue item',
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['updateQueueItem'],
			},
		},
		options: [
			{ name: 'Pending', value: 'Pending' },
			{ name: 'In Progress', value: 'InProgress' },
			{ name: 'Completed', value: 'Completed' },
			{ name: 'Failed', value: 'Failed' },
			{ name: 'Deferred', value: 'Deferred' },
		],
		default: '',
		description: 'The status of the queue item',
	},
	{
		displayName: 'Priority',
		name: 'priority',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['updateQueueItem'],
			},
		},
		default: 0,
		description: 'Priority level (0-5)',
	},
	{
		displayName: 'Reference',
		name: 'reference',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['updateQueueItem'],
			},
		},
		default: '',
		description: 'Reference identifier for the queue item',
	},
	{
		displayName: 'Due Date',
		name: 'dueDate',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['updateQueueItem'],
			},
		},
		default: '',
		description: 'Due date in ISO 8601 format',
	},
	{
		displayName: 'Progress',
		name: 'progress',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['updateQueueItem'],
			},
		},
		default: '',
		description: 'Progress value (e.g., "50%" or "Step 2 of 5")',
	},
	{
		displayName: 'Review Status',
		name: 'reviewStatus',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['updateQueueItem'],
			},
		},
		options: [
			{ name: 'None', value: '' },
			{ name: 'Approved', value: 'Approved' },
			{ name: 'Rejected', value: 'Rejected' },
			{ name: 'Sent Back', value: 'SentBack' },
		],
		default: '',
		description: 'Review status of the item',
	},
	{
		displayName: 'Reviewer ID',
		name: 'reviewerId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['updateQueueItem'],
			},
		},
		default: 0,
		description: 'ID of the reviewer',
	},
	{
		displayName: 'Specific Content',
		name: 'specificContent',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['updateQueueItem'],
			},
		},
		default: '{}',
		description: 'Custom queue item fields as JSON object',
	},
	// DeleteBulkQueueItems operation fields
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['deleteBulkQueueItems'],
			},
		},
		required: true,
		default: '',
		placeholder: "Status eq 'Failed'",
		description: 'OData filter expression for items to delete',
	},
	// GetQueueItems operation fields - additional
	{
		displayName: 'Select',
		name: 'select',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['getQueueItems'],
			},
		},
		default: '',
		placeholder: 'Id,Reference,Status,Priority,DueDate',
		description: 'Select specific properties to return',
	},
	{
		displayName: 'Order By',
		name: 'orderby',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['getQueueItems'],
			},
		},
		default: '',
		placeholder: 'CreationTime desc',
		description: 'Sort order for results',
	},
	{
		displayName: 'Count',
		name: 'count',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['getQueueItems'],
			},
		},
		default: false,
		description: 'Include total count in response',
	},
	// QueueItemComments operation fields
	{
		displayName: 'Queue Item ID',
		name: 'queueItemId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['createQueueItemComment'],
			},
		},
		required: true,
		default: 0,
		description: 'ID of the queue item',
	},
	{
		displayName: 'Comment Content',
		name: 'content',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['createQueueItemComment', 'updateQueueItemComment'],
			},
		},
		default: '',
		description: 'The comment text',
	},
	{
		displayName: 'Author',
		name: 'author',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['createQueueItemComment'],
			},
		},
		default: '',
		description: 'Author of the comment',
	},
	{
		displayName: 'Comment Key',
		name: 'commentKey',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['deleteQueueItemComment', 'updateQueueItemComment'],
			},
		},
		required: true,
		default: '',
		description: 'The unique identifier (GUID) of the comment',
	},
	{
		displayName: 'Comment Status',
		name: 'commentStatus',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['updateQueueItemComment'],
			},
		},
		options: [
			{ name: 'Active', value: 'Active' },
			{ name: 'Resolved', value: 'Resolved' },
			{ name: 'Archived', value: 'Archived' },
		],
		default: 'Active',
		description: 'Status of the comment',
	},
	{
		displayName: 'Order By',
		name: 'orderby',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['getQueueItemComments', 'getQueueItemCommentHistory'],
			},
		},
		default: 'CreatedDate desc',
		placeholder: 'CreatedDate desc',
		description: 'Sort order for comments',
	},
	// QueueItemEvents operation fields
	{
		displayName: 'Order By',
		name: 'orderby',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['queues'],
				operation: ['getQueueItemEvents', 'getQueueItemEventHistory'],
			},
		},
		default: 'CreatedDate desc',
		placeholder: 'CreatedDate desc',
		description: 'Sort order for events',
	},
];
