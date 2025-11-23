import { INodeProperties } from 'n8n-workflow';

export const processesOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['processes'],
			},
		},
		options: [
			{
				name: 'Delete Package',
				value: 'deletePackage',
				description: 'Delete a process package from Orchestrator',
				action: 'Delete package',
			},
			{
				name: 'Download Package',
				value: 'downloadPackage',
				description: 'Download .nupkg file of a process package',
				action: 'Download package',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all processes',
				action: 'Get all processes',
			},
			{
				name: 'Get Arguments',
				value: 'getArguments',
				description: 'Get process parameters',
				action: 'Get arguments',
			},
			{
				name: 'Get Process Versions',
				value: 'getProcessVersions',
				description: 'Get all available versions of a process',
				action: 'Get process versions',
			},
			{
				name: 'Upload Package',
				value: 'uploadPackage',
				description: 'Upload new process package or new version',
				action: 'Upload package',
			},
		],
		default: 'getAll',
	},
];

export const processesFields: INodeProperties[] = [
	// DeletePackage operation fields
	{
		displayName: 'Process Key',
		name: 'processKeyDelete',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['deletePackage'],
			},
		},
		default: '',
		required: true,
		description: 'The unique identifier of the process package to delete',
	},
	{
		displayName: 'Feed ID',
		name: 'feedIdDelete',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['deletePackage'],
			},
		},
		default: '',
		description: 'Optional: The feed ID for the package repository',
	},
	
	// GetAll operation fields
	{
		displayName: 'Take',
		name: 'take',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['processes'],
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
				resource: ['processes'],
				operation: ['getAll'],
			},
		},
		default: 0,
		description: 'Number of items to skip',
	},
	
	// DownloadPackage operation fields
	{
		displayName: 'Process Key',
		name: 'processKey',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['downloadPackage'],
			},
		},
		default: '',
		required: true,
		description: 'The unique identifier of the process to download',
	},
	{
		displayName: 'Feed ID',
		name: 'feedId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['downloadPackage'],
			},
		},
		default: '',
		description: 'Optional: The feed ID for the package',
	},
	
	// GetArguments operation fields
	{
		displayName: 'Process Key',
		name: 'processKeyArgs',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['getArguments'],
			},
		},
		default: '',
		required: true,
		description: 'The unique identifier of the process',
	},
	{
		displayName: 'Expand',
		name: 'expandArgs',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['getArguments'],
			},
		},
		default: '',
		description: 'Optional: Related entities to represent inline (max depth 2)',
	},
	{
		displayName: 'Select',
		name: 'selectArgs',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['getArguments'],
			},
		},
		default: '',
		description: 'Optional: Limit properties returned in result',
	},
	
	// GetProcessVersions operation fields
	{
		displayName: 'Process ID',
		name: 'processId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['getProcessVersions'],
			},
		},
		default: '',
		required: true,
		description: 'The ID of the process for which versions are fetched',
	},
	{
		displayName: 'Feed ID',
		name: 'feedIdVersions',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['getProcessVersions'],
			},
		},
		default: '',
		description: 'Optional: The feed ID',
	},
	{
		displayName: 'Expand',
		name: 'expandVersions',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['getProcessVersions'],
			},
		},
		default: '',
		description: 'Optional: Related entities to represent inline',
	},
	{
		displayName: 'Filter',
		name: 'filterVersions',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['getProcessVersions'],
			},
		},
		default: '',
		description: 'Optional: Filter expressions (max 100 expressions)',
	},
	{
		displayName: 'Select',
		name: 'selectVersions',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['getProcessVersions'],
			},
		},
		default: '',
		description: 'Optional: Limit properties returned',
	},
	{
		displayName: 'Order By',
		name: 'orderbyVersions',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['getProcessVersions'],
			},
		},
		default: '',
		description: 'Optional: Order expressions (max 5)',
	},
	{
		displayName: 'Take (Limit)',
		name: 'topVersions',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['getProcessVersions'],
			},
		},
		default: 0,
		description: 'Optional: Limit items returned (max 1000, 0 = no limit)',
	},
	{
		displayName: 'Skip',
		name: 'skipVersions',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['getProcessVersions'],
			},
		},
		default: 0,
		description: 'Optional: Number of items to skip',
	},
	{
		displayName: 'Count',
		name: 'countVersions',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['getProcessVersions'],
			},
		},
		default: false,
		description: 'Optional: Include total count in result',
	},
	
	// UploadPackage operation fields
	{
		displayName: 'Package File',
		name: 'packageFile',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['uploadPackage'],
			},
		},
		default: '',
		required: true,
		description: 'Path to the .nupkg file to upload',
	},
	{
		displayName: 'Feed ID',
		name: 'feedIdUpload',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['uploadPackage'],
			},
		},
		default: '',
		description: 'Optional: The feed ID for package storage',
	},
	{
		displayName: 'Expand',
		name: 'expandUpload',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['uploadPackage'],
			},
		},
		default: '',
		description: 'Optional: Related entities to represent inline',
	},
	{
		displayName: 'Filter',
		name: 'filterUpload',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['uploadPackage'],
			},
		},
		default: '',
		description: 'Optional: Filter expressions',
	},
	{
		displayName: 'Select',
		name: 'selectUpload',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['uploadPackage'],
			},
		},
		default: '',
		description: 'Optional: Limit properties returned',
	},
	{
		displayName: 'Order By',
		name: 'orderbyUpload',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['uploadPackage'],
			},
		},
		default: '',
		description: 'Optional: Order expressions',
	},
	{
		displayName: 'Count',
		name: 'countUpload',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['processes'],
				operation: ['uploadPackage'],
			},
		},
		default: false,
		description: 'Optional: Include total count in result',
	},
];
