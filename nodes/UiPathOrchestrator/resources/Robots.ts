import { INodeProperties } from 'n8n-workflow';

export const robotsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['robots'],
			},
		},
		options: [
			{
				name: 'Convert to Floating',
				value: 'convertToFloating',
				description: 'Convert Standard Attended robot to Floating Robot',
				action: 'Convert to floating',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new robot instance',
				action: 'Create robot',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a single robot',
				action: 'Delete robot',
			},
			{
				name: 'Delete Bulk',
				value: 'deleteBulk',
				description: 'Bulk delete multiple robots',
				action: 'Delete robots in bulk',
			},
			{
				name: 'Find Across Folders',
				value: 'findAcrossFolders',
				description: 'Get robots across all accessible folders',
				action: 'Find robots across folders',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific robot by ID',
				action: 'Get robot',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all robots with pagination and filtering',
				action: 'Get all robots',
			},
			{
				name: 'Get Configured Robots',
				value: 'getConfiguredRobots',
				description: 'Get auto provisioned robots from users',
				action: 'Get configured robots',
			},
			{
				name: 'Get Folder Robots',
				value: 'getFolderRobots',
				description: 'Get robots for specific folder and machine',
				action: 'Get folder robots',
			},
			{
				name: 'Get Machine Name Mappings',
				value: 'getMachineNameMappings',
				description: 'Get machine to license key mappings',
				action: 'Get machine name mappings',
			},
			{
				name: 'Get Robots for Process',
				value: 'getRobotsForProcess',
				description: 'Get robots capable of executing a process',
				action: 'Get robots for process',
			},
			{
				name: 'Get Robots from Folder',
				value: 'getRobotsFromFolder',
				description: 'Get all robots in a folder',
				action: 'Get robots from folder',
			},
			{
				name: 'Get Usernames',
				value: 'getUsernames',
				description: 'Get list of robot usernames',
				action: 'Get usernames',
			},
			{
				name: 'Partial Update',
				value: 'partialUpdate',
				description: 'Partially update robot properties',
				action: 'Partially update robot',
			},
			{
				name: 'Toggle Enabled Status',
				value: 'toggleEnabledStatus',
				description: 'Enable or disable robots',
				action: 'Toggle enabled status',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Full update of robot properties',
				action: 'Update robot',
			},
		],
		default: 'getAll',
	},
];

export const robotsFields: INodeProperties[] = [
	// ==================== Get All ====================
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'OData filter expression (e.g., Name eq \'RobotName\')',
	},
	{
		displayName: 'Select',
		name: 'select',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Comma-separated properties to return',
	},
	{
		displayName: 'Order By',
		name: 'orderBy',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Property to order by (e.g., Name asc)',
	},
	{
		displayName: 'Top',
		name: 'top',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['getAll'],
			},
		},
		default: 50,
		description: 'Maximum number of results (max 1000)',
	},
	{
		displayName: 'Skip',
		name: 'skip',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['getAll'],
			},
		},
		default: 0,
		description: 'Number of results to skip',
	},
	{
		displayName: 'Count',
		name: 'count',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Include total count of matching results',
	},
	{
		displayName: 'Expand',
		name: 'expand',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Related entities to expand (max depth 2)',
	},

	// ==================== Get by ID ====================
	{
		displayName: 'Robot ID',
		name: 'robotId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['get', 'update', 'partialUpdate', 'delete'],
			},
		},
		default: '',
		required: true,
		description: 'The unique identifier of the robot',
	},

	// ==================== Create ====================
	{
		displayName: 'Robot Name',
		name: 'robotName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'Name of the robot to create',
	},
	{
		displayName: 'Machine Name',
		name: 'machineName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'Machine the robot will run on',
	},
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'Username for the robot (domain\\username format)',
	},
	{
		displayName: 'Robot Type',
		name: 'robotType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Attended', value: 'Attended' },
			{ name: 'Unattended', value: 'Unattended' },
			{ name: 'Development', value: 'Development' },
			{ name: 'Floating', value: 'Floating' },
		],
		default: 'Unattended',
		description: 'Type of robot to create',
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['create'],
			},
		},
		default: true,
		description: 'Whether the robot is enabled on creation',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Description of the robot',
	},

	// ==================== Update ====================
	{
		displayName: 'Update Data',
		name: 'updateData',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['update'],
			},
		},
		default: '{}',
		required: true,
		description: 'JSON object with robot properties to update',
	},

	// ==================== Partial Update ====================
	{
		displayName: 'Update Data',
		name: 'updateData',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['partialUpdate'],
			},
		},
		default: '{}',
		required: true,
		description: 'JSON object with robot properties to update',
	},

	// ==================== Delete Bulk ====================
	{
		displayName: 'Robot IDs',
		name: 'robotIds',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['deleteBulk'],
			},
		},
		default: '[]',
		required: true,
		description: 'JSON array of robot IDs to delete',
	},

	// ==================== Convert to Floating ====================
	{
		displayName: 'Standard Attended Robot ID',
		name: 'standardRobotId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['convertToFloating'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the Standard Attended robot to convert',
	},

	// ==================== Get Robots for Process ====================
	{
		displayName: 'Process ID',
		name: 'processId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['getRobotsForProcess'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the process',
	},
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['getRobotsForProcess'],
			},
		},
		default: '',
		description: 'OData filter expression',
	},

	// ==================== Get Folder Robots ====================
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['getFolderRobots'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the folder',
	},
	{
		displayName: 'Machine ID',
		name: 'machineId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['getFolderRobots'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the machine',
	},

	// ==================== Get Robots from Folder ====================
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['getRobotsFromFolder'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the folder to get robots from',
	},
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['getRobotsFromFolder'],
			},
		},
		default: '',
		description: 'OData filter expression',
	},

	// ==================== Toggle Enabled Status ====================
	{
		displayName: 'Robot IDs',
		name: 'robotIds',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['toggleEnabledStatus'],
			},
		},
		default: '[]',
		required: true,
		description: 'JSON array of robot IDs to toggle',
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['toggleEnabledStatus'],
			},
		},
		default: true,
		required: true,
		description: 'Whether to enable or disable robots',
	},

	// ==================== Get Configured Robots ====================
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['getConfiguredRobots'],
			},
		},
		default: '',
		description: 'OData filter expression',
	},
	{
		displayName: 'Top',
		name: 'top',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['getConfiguredRobots'],
			},
		},
		default: 50,
		description: 'Maximum number of results',
	},

	// ==================== Find Across Folders ====================
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['findAcrossFolders'],
			},
		},
		default: '',
		description: 'OData filter expression',
	},
	{
		displayName: 'Top',
		name: 'top',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['findAcrossFolders'],
			},
		},
		default: 50,
		description: 'Maximum number of results',
	},

	// ==================== Get Usernames ====================
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['robots'],
				operation: ['getUsernames'],
			},
		},
		default: '',
		description: 'OData filter expression',
	},
];
