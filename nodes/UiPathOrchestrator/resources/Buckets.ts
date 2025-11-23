import { INodeProperties } from 'n8n-workflow';

export const bucketsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['buckets'],
			},
		},
		options: [
			{
				name: 'Create Bucket',
				value: 'createBucket',
				description: 'Create a new bucket',
				action: 'Create bucket',
			},
			{
				name: 'Get Buckets',
				value: 'getBuckets',
				description: 'List all buckets',
				action: 'Get buckets',
			},
			{
				name: 'Get Bucket',
				value: 'getBucket',
				description: 'Get bucket details by ID',
				action: 'Get bucket',
			},
			{
				name: 'Update Bucket',
				value: 'updateBucket',
				description: 'Update bucket properties',
				action: 'Update bucket',
			},
			{
				name: 'Delete Bucket',
				value: 'deleteBucket',
				description: 'Delete a bucket',
				action: 'Delete bucket',
			},
			{
				name: 'List Files',
				value: 'listFiles',
				description: 'List files in a bucket',
				action: 'List files',
			},
			{
				name: 'Get File',
				value: 'getFile',
				description: 'Get file metadata',
				action: 'Get file',
			},
			{
				name: 'Delete File',
				value: 'deleteFile',
				description: 'Delete a file from bucket',
				action: 'Delete file',
			},
			{
				name: 'Get Read URI',
				value: 'getReadUri',
				description: 'Get a download URL for a file',
				action: 'Get read URI',
			},
			{
				name: 'Get Write URI',
				value: 'getWriteUri',
				description: 'Get an upload URL for a file',
				action: 'Get write URI',
			},
			{
				name: 'Get Directories',
				value: 'getDirectories',
				description: 'List directories in a bucket',
				action: 'Get directories',
			},
			{
				name: 'Share To Folders',
				value: 'shareToFolders',
				description: 'Add/remove bucket from folders',
				action: 'Share to folders',
			},
		],
		default: 'listFiles',
	},
];

export const bucketsFields: INodeProperties[] = [
	// GetBuckets operation fields
	{
	 	displayName: 'Filter',
	 	name: 'filter',
	 	type: 'string',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['getBuckets'],
	 		},
	 	},
	 	default: '',
	 	description: 'Optional: Filter expressions (max 100)',
	},
	{
	 	displayName: 'Select',
	 	name: 'select',
	 	type: 'string',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['getBuckets'],
	 		},
	 	},
	 	default: '',
	 	description: 'Optional: Limit properties returned',
	},
	{
	 	displayName: 'Order By',
	 	name: 'orderby',
	 	type: 'string',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['getBuckets'],
	 		},
	 	},
	 	default: '',
	 	description: 'Optional: Order expressions (max 5)',
	},
	{
	 	displayName: 'Take (Limit)',
	 	name: 'top',
	 	type: 'number',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['getBuckets'],
	 		},
	 	},
	 	default: 0,
	 	description: 'Optional: Limit items returned (max 1000, 0 = no limit)',
	},
	{
	 	displayName: 'Skip',
	 	name: 'skip',
	 	type: 'number',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['getBuckets'],
	 		},
	 	},
	 	default: 0,
	 	description: 'Optional: Number of items to skip',
	},
	{
	 	displayName: 'Count',
	 	name: 'count',
	 	type: 'boolean',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['getBuckets'],
	 		},
	 	},
	 	default: false,
	 	description: 'Optional: Include total count in result',
	},

	// CreateBucket operation fields
	{
	 	displayName: 'Bucket Name',
	 	name: 'name',
	 	type: 'string',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['createBucket'],
	 		},
	 	},
	 	default: '',
	 	required: true,
	 	description: 'Name for the new bucket',
	},
	{
	 	displayName: 'Description',
	 	name: 'description',
	 	type: 'string',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['createBucket','updateBucket'],
	 		},
	 	},
	 	default: '',
	 	description: 'Optional bucket description',
	},
	{
	 	displayName: 'Bucket Type',
	 	name: 'bucketType',
	 	type: 'string',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['createBucket'],
	 		},
	 	},
	 	default: '',
	 	description: 'Optional: Bucket type identifier',
	},
	{
	 	displayName: 'Is Active',
	 	name: 'isActive',
	 	type: 'boolean',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['createBucket','updateBucket'],
	 		},
	 	},
	 	default: true,
	 	description: 'Whether the bucket is active',
	},

	// GetBucket operation fields
	{
	 	displayName: 'Bucket ID',
	 	name: 'bucketId',
	 	type: 'string',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['getBucket','updateBucket','deleteBucket','getDirectories','listFiles','getFile','deleteFile','getReadUri','getWriteUri','shareToFolders'],
	 		},
	 	},
	 	default: '',
	 	required: true,
	 	description: 'The unique identifier of the bucket',
	},
	{
	 	displayName: 'Expand',
	 	name: 'expand',
	 	type: 'string',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['getBucket'],
	 		},
	 	},
	 	default: '',
	 	description: 'Optional: Related entities to represent inline',
	},
	{
	 	displayName: 'Select',
	 	name: 'select',
	 	type: 'string',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['getBucket'],
	 		},
	 	},
	 	default: '',
	 	description: 'Optional: Limit properties returned',
	},

	// UpdateBucket operation fields
	{
	 	displayName: 'Bucket ID',
	 	name: 'bucketId',
	 	type: 'string',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['updateBucket'],
	 		},
	 	},
	 	default: '',
	 	required: true,
	 	description: 'The unique identifier of the bucket to update',
	},

	// DeleteBucket operation fields
	{
	 	displayName: 'Bucket ID',
	 	name: 'bucketId',
	 	type: 'string',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['deleteBucket'],
	 		},
	 	},
	 	default: '',
	 	required: true,
	 	description: 'The unique identifier of the bucket to delete',
	},

	// GetDirectories operation fields
	{
	 	displayName: 'Directory',
	 	name: 'directory',
	 	type: 'string',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['getDirectories'],
	 		},
	 	},
	 	default: '',
	 	description: 'Optional: Directory to list',
	},
	{
	 	displayName: 'Take (Limit)',
	 	name: 'top',
	 	type: 'number',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['getDirectories'],
	 		},
	 	},
	 	default: 0,
	 	description: 'Optional: Limit items returned (max 1000, 0 = no limit)',
	},
	{
	 	displayName: 'Skip',
	 	name: 'skip',
	 	type: 'number',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['getDirectories'],
	 		},
	 	},
	 	default: 0,
	 	description: 'Optional: Number of items to skip',
	},
	
	// ListFiles operation fields
	{
	 	displayName: 'Bucket ID',
	 	name: 'bucketId',
	 	type: 'string',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['listFiles'],
	 		},
	 	},
	 	default: '',
	 	required: true,
	 	description: 'The Bucket ID',
	},
	{
	 	displayName: 'Directory',
	 	name: 'directory',
	 	type: 'string',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['listFiles'],
	 		},
	 	},
	 	default: '',
	 	description: 'Optional: The directory path to list',
	},
	{
	 	displayName: 'Recursive',
	 	name: 'recursive',
	 	type: 'boolean',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['listFiles'],
	 		},
	 	},
	 	default: false,
	 	description: 'Whether to list files recursively',
	},
	{
	 	displayName: 'File Name Glob',
	 	name: 'fileNameGlob',
	 	type: 'string',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['listFiles'],
	 		},
	 	},
	 	default: '',
	 	description: 'Optional: Glob pattern to filter file names',
	},
	{
	 	displayName: 'Take (Limit)',
	 	name: 'top',
	 	type: 'number',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['listFiles'],
	 		},
	 	},
	 	default: 0,
	 	description: 'Optional: Limit items returned (max 1000, 0 = no limit)',
	},
	{
	 	displayName: 'Skip',
	 	name: 'skip',
	 	type: 'number',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['listFiles'],
	 		},
	 	},
	 	default: 0,
	 	description: 'Optional: Number of items to skip',
	},

	// GetFile / DeleteFile operation fields
	{
	 	displayName: 'Path',
	 	name: 'path',
	 	type: 'string',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['getFile','deleteFile','getReadUri','getWriteUri'],
	 		},
	 	},
	 	default: '',
	 	required: true,
	 	description: 'The file path within the bucket',
	},

	// GetReadUri operation fields
	{
	 	displayName: 'Expiry In Minutes',
	 	name: 'expiryInMinutes',
	 	type: 'number',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['getReadUri'],
	 		},
	 	},
	 	default: 0,
	 	description: 'Optional: Minutes before the read URL expires (0 = no expiry param)',
	},

	// GetWriteUri operation fields
	{
	 	displayName: 'Expiry In Minutes',
	 	name: 'expiryInMinutes',
	 	type: 'number',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['getWriteUri'],
	 		},
	 	},
	 	default: 0,
	 	description: 'Optional: Minutes before the write URL expires (0 = no expiry param)',
	},
	{
	 	displayName: 'Content Type',
	 	name: 'contentType',
	 	type: 'string',
	 	displayOptions: {
	 		show: {
	 			resource: ['buckets'],
	 			operation: ['getWriteUri'],
	 		},
	 	},
	 	default: '',
	 	description: 'Optional: Content type for the upload (e.g., application/octet-stream)',
	},
	
	// ShareToFolders operation fields
	{
		displayName: 'Buckets JSON',
		name: 'bucketsJson',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['buckets'],
				operation: ['shareToFolders'],
			},
		},
		default: '[]',
		required: true,
		description: 'JSON array of bucket IDs: ["id1", "id2"]',
	},
	{
		displayName: 'To Add Folder IDs JSON',
		name: 'toAddFolderIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['buckets'],
				operation: ['shareToFolders'],
			},
		},
		default: '[]',
		description: 'JSON array of folder IDs to add: ["folder1", "folder2"]',
	},
	{
		displayName: 'To Remove Folder IDs JSON',
		name: 'toRemoveFolderIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['buckets'],
				operation: ['shareToFolders'],
			},
		},
		default: '[]',
		description: 'JSON array of folder IDs to remove: ["folder1"]',
	},
];
