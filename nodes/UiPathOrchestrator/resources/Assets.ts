import { INodeProperties } from 'n8n-workflow';

export const assetsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['assets'],
			},
		},
		options: [
			{
				name: 'Get Filtered',
				value: 'getFiltered',
				description: 'Get assets using OData GetFiltered function',
				action: 'Get filtered assets',
			},
			{
				name: 'Get Assets Across Folders',
				value: 'getAssetsAcrossFolders',
				description: 'Get assets from all accessible folders',
				action: 'Get assets across folders',
			},
			{
				name: 'Create Asset',
				value: 'createAsset',
				description: 'Create a new asset',
				action: 'Create asset',
			},
			{
				name: 'Get Asset',
				value: 'getAsset',
				description: 'Get asset by id',
				action: 'Get asset',
			},
			{
				name: 'Update Asset',
				value: 'updateAsset',
				description: 'Update an existing asset',
				action: 'Update asset',
			},
			{
				name: 'Delete Asset',
				value: 'deleteAsset',
				description: 'Delete an asset',
				action: 'Delete asset',
			},
			{
				name: 'Get Folders For Asset',
				value: 'getFoldersForAsset',
				description: 'Get folders where an asset is shared',
				action: 'Get folders for asset',
			},
			{
				name: 'Get Robot Asset',
				value: 'getRobotAsset',
				description: 'Get named asset for a robot key',
				action: 'Get robot asset',
			},
			{
				name: 'Get Robot Asset By Name (Robot Key)',
				value: 'getRobotAssetByNameForRobotKey',
				description: 'Get named asset by posting robot key and asset name',
				action: 'Get robot asset by name (robot key)',
			},
			{
				name: 'Get Robot Asset By Robot Id',
				value: 'getRobotAssetByRobotId',
				description: 'Get named asset for a robot id',
				action: 'Get robot asset by robot id',
			},
			{
				name: 'Set Robot Asset By Robot Key',
				value: 'setRobotAssetByRobotKey',
				description: 'Set asset value for a robot key',
				action: 'Set robot asset by robot key',
			},
			{
				name: 'Share To Folders',
				value: 'shareToFolders',
				description: 'Share assets to folders or remove sharing',
				action: 'Share assets to folders',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all assets',
				action: 'Get all assets',
			},
		],
		default: 'getAll',
	},
];

export const assetsFields: INodeProperties[] = [
	// GetFoldersForAsset operation fields
	{
		displayName: 'Asset ID',
		name: 'assetIdForFolders',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['getFoldersForAsset'],
			},
		},
		default: '',
		required: true,
		description: 'The asset id to query folders for',
	},
	{
		displayName: 'Expand',
		name: 'expandAssetFolders',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['getFoldersForAsset'],
			},
		},
		default: '',
		description: 'Optional: $expand for related entities',
	},
	{
		displayName: 'Select',
		name: 'selectAssetFolders',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['getFoldersForAsset'],
			},
		},
		default: '',
		description: 'Optional: $select to limit properties',
	},

	// GetRobotAsset operation fields
	{
		displayName: 'Robot ID (key)',
		name: 'robotKey',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['getRobotAsset','getRobotAssetByNameForRobotKey','setRobotAssetByRobotKey'],
			},
		},
		default: '',
		description: 'Robot key (string) for robot-scoped asset retrieval',
	},
	{
		displayName: 'Asset Name',
		name: 'assetName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['getRobotAsset','getRobotAssetByNameForRobotKey','getRobotAssetByRobotId','setRobotAssetByRobotKey'],
			},
		},
		default: '',
		description: 'The name of the asset',
	},
	
	// GetRobotAssetByRobotId operation fields
	{
		displayName: 'Robot Numeric ID',
		name: 'robotNumericId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['getRobotAssetByRobotId'],
			},
		},
		default: 0,
		required: true,
		description: 'Robot numeric id for robot-scoped asset retrieval',
	},

	// GetRobotAssetByNameForRobotKey / SetRobotAssetByRobotKey (body as JSON)
	{
		displayName: 'Body JSON',
		name: 'bodyJson',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['getRobotAssetByNameForRobotKey','setRobotAssetByRobotKey'],
			},
		},
		default: '{}',
		required: true,
		description: 'Request body as JSON string',
	},

	// ShareToFolders operation fields
	{
		displayName: 'Asset IDs JSON',
		name: 'assetIdsJson',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['shareToFolders'],
			},
		},
		default: '[]',
		required: true,
		description: 'JSON array of asset IDs: ["id1", "id2"]',
	},
	{
		displayName: 'To Add Folder IDs JSON',
		name: 'assetToAddFolderIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['shareToFolders'],
			},
		},
		default: '[]',
		description: 'JSON array of folder IDs to add',
	},
	{
		displayName: 'To Remove Folder IDs JSON',
		name: 'assetToRemoveFolderIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['shareToFolders'],
			},
		},
		default: '[]',
		description: 'JSON array of folder IDs to remove',
	},

	// GetAll operation fields (kept at end)
	{
		displayName: 'Take',
		name: 'take',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['getAll'],
			},
		},
		default: 20,
		description: 'Number of items to retrieve (max 100)',
	},
	{
		displayName: 'Skip',
		name: 'skip',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['assets'],
				operation: ['getAll'],
			},
		},
		default: 0,
		description: 'Number of items to skip',
	},

// GetFiltered operation fields
{
	displayName: 'Filter',
	name: 'filter',
	type: 'string',
	displayOptions: {
 		show: {
 			resource: ['assets'],
 			operation: ['getFiltered'],
 		},
 	},
 	default: '',
 	description: 'OData filter expression',
},
{
 	displayName: 'Select',
 	name: 'select',
 	type: 'string',
 	displayOptions: {
 		show: {
 			resource: ['assets'],
 			operation: ['getFiltered'],
 		},
 	},
 	default: '',
 	description: 'Optional: $select to limit properties',
},
{
 	displayName: 'Take (Limit)',
 	name: 'top',
 	type: 'number',
 	displayOptions: {
 		show: {
 			resource: ['assets'],
 			operation: ['getFiltered'],
 		},
 	},
 	default: 0,
 	description: 'Optional: Limit items returned (max 1000, 0 = no limit)',
},
{
 	displayName: 'Skip',
 	name: 'skipFiltered',
 	type: 'number',
 	displayOptions: {
 		show: {
 			resource: ['assets'],
 			operation: ['getFiltered'],
 		},
 	},
 	default: 0,
 	description: 'Optional: Number of items to skip',
},

// Create / Update operation fields
{
 	displayName: 'Asset Name',
 	name: 'name',
 	type: 'string',
 	displayOptions: {
 		show: {
 			resource: ['assets'],
 			operation: ['createAsset','updateAsset'],
 		},
 	},
 	default: '',
 	required: true,
 	description: 'Name of the asset',
},
{
 	displayName: 'Value Type',
 	name: 'valueType',
 	type: 'options',
 	options: [
 		{ name: 'Text', value: 'Text' },
 		{ name: 'Credential', value: 'Credential' },
 		{ name: 'Certificate', value: 'Certificate' },
 		{ name: 'KeyValueList', value: 'KeyValueList' },
 	],
 	displayOptions: {
 		show: {
 			resource: ['assets'],
 			operation: ['createAsset','updateAsset'],
 		},
 	},
 	default: 'Text',
 	description: 'Type of the asset',
},
{
 	displayName: 'Value',
 	name: 'value',
 	type: 'string',
 	displayOptions: {
 		show: {
 			resource: ['assets'],
 			operation: ['createAsset','updateAsset'],
 		},
 	},
 	default: '',
 	description: 'Asset value (plain text or JSON for KeyValueList)',
},
{
 	displayName: 'Robot Value',
 	name: 'robotValue',
 	type: 'string',
 	displayOptions: {
 		show: {
 			resource: ['assets'],
 			operation: ['createAsset','updateAsset'],
 		},
 	},
 	default: '',
 	description: 'Optional robot-specific value',
},
{
 	displayName: 'Robot Id',
 	name: 'robotId',
 	type: 'number',
 	displayOptions: {
 		show: {
 			resource: ['assets'],
 			operation: ['createAsset','updateAsset'],
 		},
 	},
 	default: 0,
 	description: 'Optional robot numeric id for robot-specific value',
},

// Get / Delete Asset fields
{
 	displayName: 'Asset ID',
 	name: 'assetId',
 	type: 'string',
 	displayOptions: {
 		show: {
 			resource: ['assets'],
 			operation: ['getAsset','updateAsset','deleteAsset'],
 		},
 	},
 	default: '',
 	required: true,
 	description: 'The unique identifier of the asset',
},
];
