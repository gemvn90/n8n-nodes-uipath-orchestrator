import { INodeProperties } from 'n8n-workflow';

export const foldersOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['folders'],
			},
		},
		options: [
			{
				name: 'Assign Domain User',
				value: 'assignDomainUser',
				description: 'Assign directory user/group to folders with roles',
				action: 'Assign domain user',
			},
			{
				name: 'Assign Machines',
				value: 'assignMachines',
				description: 'Assign machines to folders',
				action: 'Assign machines',
			},
			{
				name: 'Assign Users',
				value: 'assignUsers',
				description: 'Assign users to folders with roles',
				action: 'Assign users',
			},
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new folder',
				action: 'Create a folder',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a folder',
				action: 'Delete a folder',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a specific folder by key',
				action: 'Get a folder',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all folders accessible to current user',
				action: 'Get all folders',
			},
			{
				name: 'Get All Roles For User',
				value: 'getAllRolesForUser',
				description: 'Get user-folder assignments and roles',
				action: 'Get all roles for user',
			},
			{
				name: 'Get Machines For Folder',
				value: 'getMachinesForFolder',
				description: 'Get machines assigned to folder',
				action: 'Get machines for folder',
			},
			{
				name: 'Get Move Folder Machines Changes',
				value: 'getMoveFolderMachinesChanges',
				description: 'Get machine changes when moving folder',
				action: 'Get move folder machines changes',
			},
			{
				name: 'Get Subfolders With Assigned Machine',
				value: 'getSubfoldersWithAssignedMachine',
				description: 'Get subfolders with machine assignments',
				action: 'Get subfolders with assigned machine',
			},
			{
				name: 'Get Users For Folder',
				value: 'getUsersForFolder',
				description: 'Get users with access to folder',
				action: 'Get users for folder',
			},
			{
				name: 'Move Folder',
				value: 'moveFolder',
				description: 'Move a folder to a new parent',
				action: 'Move a folder',
			},
			{
				name: 'Remove Machines From Folder',
				value: 'removeMachinesFromFolder',
				description: 'Remove machine assignments from folder',
				action: 'Remove machines from folder',
			},
			{
				name: 'Remove User From Folder',
				value: 'removeUserFromFolder',
				description: 'Remove user assignment from folder',
				action: 'Remove user from folder',
			},
			{
				name: 'Toggle Folder Machine Inherit',
				value: 'toggleFolderMachineInherit',
				description: 'Toggle machine propagation to subfolders',
				action: 'Toggle folder machine inherit',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update folder details',
				action: 'Update a folder',
			},
			{
				name: 'Update Machines To Folder Associations',
				value: 'updateMachinesToFolderAssociations',
				description: 'Add/remove machine associations',
				action: 'Update machines to folder associations',
			},
		],
		default: 'get',
	},
];

export const foldersFields: INodeProperties[] = [
	// ==================== Assign Domain User ====================
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['assignDomainUser'],
			},
		},
		default: '',
		required: true,
		description: 'Directory user or group username',
	},
	{
		displayName: 'Folder Assignments',
		name: 'folderAssignments',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['assignDomainUser'],
			},
		},
		default: '[]',
		required: true,
		description: 'JSON array of folder assignments with roles',
	},

	// ==================== Assign Machines ====================
	{
		displayName: 'Folder IDs',
		name: 'folderIds',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['assignMachines'],
			},
		},
		default: '[]',
		required: true,
		description: 'JSON array of folder IDs',
	},
	{
		displayName: 'Machine IDs',
		name: 'machineIds',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['assignMachines'],
			},
		},
		default: '[]',
		required: true,
		description: 'JSON array of machine IDs to assign',
	},

	// ==================== Assign Users ====================
	{
		displayName: 'User IDs',
		name: 'userIds',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['assignUsers'],
			},
		},
		default: '[]',
		required: true,
		description: 'JSON array of user IDs to assign',
	},
	{
		displayName: 'Folder Assignments',
		name: 'folderAssignments',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['assignUsers'],
			},
		},
		default: '[]',
		required: true,
		description: 'JSON array of folder assignments with roles',
	},

	// ==================== Delete ====================
	{
		displayName: 'Folder Key',
		name: 'key',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['delete'],
			},
		},
		default: '',
		required: true,
		description: 'The unique identifier (UUID) of the folder',
	},

	// ==================== Get ====================
	{
		displayName: 'Folder Key',
		name: 'key',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['get'],
			},
		},
		default: '',
		required: true,
		description: 'The unique identifier (UUID) of the folder',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['get'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Expand',
				name: 'expand',
				type: 'string',
				default: '',
				description: 'Related entities to include inline (max depth 2)',
			},
			{
				displayName: 'Select',
				name: 'select',
				type: 'string',
				default: '',
				description: 'Limit properties in result',
			},
			{
				displayName: 'Filter',
				name: 'filter',
				type: 'string',
				default: '',
				description: 'OData filter expression',
			},
			{
				displayName: 'Order By',
				name: 'orderby',
				type: 'string',
				default: '',
				description: 'Order by expression',
			},
		],
	},

	// ==================== Get All ====================
	{
		displayName: 'Take',
		name: 'take',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['folders'],
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
				resource: ['folders'],
				operation: ['getAll'],
			},
		},
		default: 0,
		description: 'Number of items to skip',
	},

	// ==================== Get All Roles For User ====================
	{
		displayName: 'Username',
		name: 'username',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['getAllRolesForUser'],
			},
		},
		default: '',
		required: true,
		description: 'User name (use FoldersNavigation endpoint for special chars)',
	},
	{
		displayName: 'Take',
		name: 'take',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['getAllRolesForUser'],
			},
		},
		default: 20,
		required: true,
		description: 'Number of items to retrieve',
	},
	{
		displayName: 'Skip',
		name: 'skip',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['getAllRolesForUser'],
			},
		},
		default: 0,
		required: true,
		description: 'Number of items to skip',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['getAllRolesForUser'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Type',
				name: 'type',
				type: 'string',
				default: '',
				description: 'Filter by type',
			},
			{
				displayName: 'Search Text',
				name: 'searchText',
				type: 'string',
				default: '',
				description: 'Search filter text',
			},
		],
	},

	// ==================== Get Machines For Folder ====================
	{
		displayName: 'Folder Key',
		name: 'key',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['getMachinesForFolder'],
			},
		},
		default: '',
		required: true,
		description: 'The folder key identifier',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['getMachinesForFolder'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Top',
				name: 'top',
				type: 'number',
				default: 0,
				description: 'Limit number of items (max 1000)',
			},
			{
				displayName: 'Skip',
				name: 'skip',
				type: 'number',
				default: 0,
				description: 'Number of items to skip',
			},
		],
	},

	// ==================== Get Move Folder Machines Changes ====================
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['getMoveFolderMachinesChanges'],
			},
		},
		default: 0,
		required: true,
		description: 'ID of the folder to be moved',
	},
	{
		displayName: 'Target Parent ID',
		name: 'targetParentId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['getMoveFolderMachinesChanges'],
			},
		},
		default: 0,
		required: true,
		description: 'ID of the target parent folder',
	},

	// ==================== Get Subfolders With Assigned Machine ====================
	{
		displayName: 'Root Folder ID',
		name: 'rootFolderId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['getSubfoldersWithAssignedMachine'],
			},
		},
		default: 0,
		required: true,
		description: 'ID of the root folder',
	},
	{
		displayName: 'Machine ID',
		name: 'machineId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['getSubfoldersWithAssignedMachine'],
			},
		},
		default: 0,
		required: false,
		description: 'Filter by machine ID (optional)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['getSubfoldersWithAssignedMachine'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Top',
				name: 'top',
				type: 'number',
				default: 0,
				description: 'Limit number of items (max 1000)',
			},
			{
				displayName: 'Skip',
				name: 'skip',
				type: 'number',
				default: 0,
				description: 'Number of items to skip',
			},
		],
	},

	// ==================== Get Users For Folder ====================
	{
		displayName: 'Folder Key',
		name: 'key',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['getUsersForFolder'],
			},
		},
		default: '',
		required: true,
		description: 'The folder key identifier',
	},
	{
		displayName: 'Include Inherited',
		name: 'includeInherited',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['getUsersForFolder'],
			},
		},
		default: false,
		required: true,
		description: 'Include users inherited from parent folders',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['getUsersForFolder'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Include Alerts Enabled',
				name: 'includeAlertsEnabled',
				type: 'boolean',
				default: false,
				description: 'Include alert preferences for each user',
			},
			{
				displayName: 'Top',
				name: 'top',
				type: 'number',
				default: 0,
				description: 'Limit number of items (max 1000)',
			},
			{
				displayName: 'Skip',
				name: 'skip',
				type: 'number',
				default: 0,
				description: 'Number of items to skip',
			},
		],
	},

	// ==================== Toggle Folder Machine Inherit ====================
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['toggleFolderMachineInherit'],
			},
		},
		default: 0,
		required: true,
		description: 'The folder ID',
	},
	{
		displayName: 'Inherit Machines',
		name: 'inheritMachines',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['toggleFolderMachineInherit'],
			},
		},
		default: false,
		required: true,
		description: 'Enable/disable machine inheritance to subfolders',
	},

	// ==================== Update ====================
	{
		displayName: 'Folder Key',
		name: 'key',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['update'],
			},
		},
		default: '',
		required: true,
		description: 'The unique identifier (UUID) of the folder',
	},
	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The display name of the folder',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The description of the folder',
	},

	// ==================== Update Machines To Folder Associations ====================
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['updateMachinesToFolderAssociations'],
			},
		},
		default: 0,
		required: true,
		description: 'The folder ID',
	},
	{
		displayName: 'Machine IDs To Add',
		name: 'machineIdsToAdd',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['updateMachinesToFolderAssociations'],
			},
		},
		default: '[]',
		description: 'JSON array of machine IDs to add',
	},
	{
		displayName: 'Machine IDs To Remove',
		name: 'machineIdsToRemove',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['updateMachinesToFolderAssociations'],
			},
		},
		default: '[]',
		description: 'JSON array of machine IDs to remove',
	},
	// Create Folder fields
	{
		displayName: 'Display Name',
		name: 'displayName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['create'],
			},
		},
		required: true,
		default: '',
		description: 'The display name for the new folder',
	},
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Description of the folder',
	},
	{
		displayName: 'Parent ID',
		name: 'parentId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['create'],
			},
		},
		default: null,
		description: 'Parent folder ID (leave empty for root folder)',
	},
	{
		displayName: 'Provision Type',
		name: 'provisionType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'Manual', value: 0 },
			{ name: 'Automatic', value: 1 },
		],
		default: 0,
		description: 'Folder provision type',
	},
	// Move Folder fields
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['moveFolder'],
			},
		},
		required: true,
		default: 0,
		description: 'ID of the folder to move',
	},
	{
		displayName: 'Target Parent ID',
		name: 'targetParentId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['moveFolder'],
			},
		},
		required: true,
		default: 0,
		description: 'ID of the new parent folder',
	},
	// Remove Machines From Folder fields
	{
		displayName: 'Folder Key',
		name: 'key',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['removeMachinesFromFolder'],
			},
		},
		required: true,
		default: '',
		description: 'The unique key of the folder',
	},
	{
		displayName: 'Machine IDs',
		name: 'machineIds',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['removeMachinesFromFolder'],
			},
		},
		required: true,
		default: '',
		placeholder: '[1,2,3] or 1,2,3',
		description: 'Array of machine IDs (JSON array or comma-separated)',
	},
	// Remove User From Folder fields
	{
		displayName: 'Folder Key',
		name: 'key',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['removeUserFromFolder'],
			},
		},
		required: true,
		default: '',
		description: 'The unique key of the folder',
	},
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['folders'],
				operation: ['removeUserFromFolder'],
			},
		},
		required: true,
		default: 0,
		description: 'ID of the user to remove',
	},
];
