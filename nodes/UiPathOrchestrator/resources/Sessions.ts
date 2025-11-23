import { INodeProperties } from 'n8n-workflow';

export const sessionsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['sessions'],
			},
		},
		options: [
			{
				name: 'Delete Inactive Sessions',
				value: 'deleteInactiveUnattendedSessions',
				description: 'Remove disconnected or unresponsive unattended robot sessions',
				action: 'Delete inactive sessions',
			},
			{
				name: 'Get All',
				value: 'getAll',
				description: 'Get all sessions in current folder',
				action: 'Get all sessions',
			},
			{
				name: 'Get Global Sessions',
				value: 'getGlobalSessions',
				description: 'Get all sessions across the entire tenant',
				action: 'Get global sessions',
			},
			{
				name: 'Get Machine Sessions',
				value: 'getMachineSessions',
				description: 'Get all sessions for a specific machine',
				action: 'Get machine sessions',
			},
			{
				name: 'Get Machine Session Runtimes',
				value: 'getMachineSessionRuntimes',
				description: 'Get machine runtime session information for all machines',
				action: 'Get machine session runtimes',
			},
			{
				name: 'Get Machine Session Runtimes by Folder',
				value: 'getMachineSessionRuntimesByFolderId',
				description: 'Get runtime sessions for machines in a specific folder',
				action: 'Get folder machine session runtimes',
			},
			{
				name: 'Get Usernames',
				value: 'getUsernames',
				description: 'Get list of all usernames with active sessions',
				action: 'Get usernames',
			},
			{
				name: 'Set Maintenance Mode',
				value: 'setMaintenanceMode',
				description: 'Set the execution capabilities for a host machine',
				action: 'Set maintenance mode',
			},
			{
				name: 'Toggle Debug Mode',
				value: 'toggleDebugMode',
				description: 'Toggle debug mode for a specific machine session',
				action: 'Toggle debug mode',
			},
		],
		default: 'getAll',
	},
];

export const sessionsFields: INodeProperties[] = [
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
				resource: ['sessions'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'OData filter expression (e.g., State eq \'Connected\')',
	},
	{
		displayName: 'Select',
		name: 'select',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['sessions'],
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
				resource: ['sessions'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Property to order by (e.g., CreatedAt desc)',
	},
	{
		displayName: 'Top',
		name: 'top',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['sessions'],
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
				resource: ['sessions'],
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
				resource: ['sessions'],
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
				resource: ['sessions'],
				operation: ['getAll'],
			},
		},
		default: '',
		description: 'Related entities to expand (max depth 2)',
	},

	// ==================== Get Global Sessions ====================
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['sessions'],
				operation: ['getGlobalSessions'],
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
				resource: ['sessions'],
				operation: ['getGlobalSessions'],
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
				resource: ['sessions'],
				operation: ['getGlobalSessions'],
			},
		},
		default: '',
		description: 'Property to order by',
	},
	{
		displayName: 'Top',
		name: 'top',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['sessions'],
				operation: ['getGlobalSessions'],
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
				resource: ['sessions'],
				operation: ['getGlobalSessions'],
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
				resource: ['sessions'],
				operation: ['getGlobalSessions'],
			},
		},
		default: false,
		description: 'Include total count of matching results',
	},

	// ==================== Toggle Debug Mode ====================
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['sessions'],
				operation: ['toggleDebugMode'],
			},
		},
		default: '',
		required: true,
		description: 'The unique identifier of the session',
	},
	{
		displayName: 'Enabled',
		name: 'enabled',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['sessions'],
				operation: ['toggleDebugMode'],
			},
		},
		default: true,
		required: true,
		description: 'Whether to enable or disable debug mode',
	},

	// ==================== Delete Inactive Sessions ====================
	{
		displayName: 'Inactivity Threshold (Minutes)',
		name: 'inactivityThresholdMinutes',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['sessions'],
				operation: ['deleteInactiveUnattendedSessions'],
			},
		},
		default: 30,
		required: true,
		description: 'Minutes of inactivity before session is considered for deletion',
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
				resource: ['sessions'],
				operation: ['deleteInactiveUnattendedSessions'],
			},
		},
		default: '[]',
		description: 'JSON array of machine IDs to delete inactive sessions from (empty = all)',
	},

	// ==================== Get Machine Session Runtimes ====================
	{
		displayName: 'Runtime Type',
		name: 'runtimeType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['sessions'],
				operation: ['getMachineSessionRuntimes'],
			},
		},
		options: [
			{ name: 'NonProduction', value: 'NonProduction' },
			{ name: 'Attended', value: 'Attended' },
			{ name: 'Unattended', value: 'Unattended' },
			{ name: 'Development', value: 'Development' },
			{ name: 'Studio', value: 'Studio' },
			{ name: 'RpaDeveloper', value: 'RpaDeveloper' },
			{ name: 'StudioX', value: 'StudioX' },
			{ name: 'CitizenDeveloper', value: 'CitizenDeveloper' },
			{ name: 'Headless', value: 'Headless' },
			{ name: 'StudioPro', value: 'StudioPro' },
			{ name: 'RpaDeveloperPro', value: 'RpaDeveloperPro' },
			{ name: 'TestAutomation', value: 'TestAutomation' },
			{ name: 'AutomationCloud', value: 'AutomationCloud' },
			{ name: 'Serverless', value: 'Serverless' },
			{ name: 'AutomationKit', value: 'AutomationKit' },
			{ name: 'ServerlessTestAutomation', value: 'ServerlessTestAutomation' },
			{ name: 'AutomationCloudTestAutomation', value: 'AutomationCloudTestAutomation' },
			{ name: 'AttendedStudioWeb', value: 'AttendedStudioWeb' },
			{ name: 'Hosting', value: 'Hosting' },
			{ name: 'AssistantWeb', value: 'AssistantWeb' },
			{ name: 'ProcessOrchestration', value: 'ProcessOrchestration' },
			{ name: 'AgentService', value: 'AgentService' },
			{ name: 'AppTest', value: 'AppTest' },
			{ name: 'PerformanceTest', value: 'PerformanceTest' },
			{ name: 'BusinessRule', value: 'BusinessRule' },
			{ name: 'CaseManagement', value: 'CaseManagement' },
		],
		default: 'Unattended',
		description: 'Filter by runtime type (optional)',
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
				resource: ['sessions'],
				operation: ['getMachineSessionRuntimes'],
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
				resource: ['sessions'],
				operation: ['getMachineSessionRuntimes'],
			},
		},
		default: 50,
		description: 'Maximum number of results',
	},

	// ==================== Get Machine Sessions by Folder ====================
	{
		displayName: 'Folder ID',
		name: 'folderId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['sessions'],
				operation: ['getMachineSessionRuntimesByFolderId'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the folder to get sessions from',
	},
	{
		displayName: 'Robot ID',
		name: 'robotId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['sessions'],
				operation: ['getMachineSessionRuntimesByFolderId'],
			},
		},
		default: '',
		description: 'Filter by specific robot ID (optional)',
	},
	{
		displayName: 'Runtime Type',
		name: 'runtimeType',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['sessions'],
				operation: ['getMachineSessionRuntimesByFolderId'],
			},
		},
		options: [
			{ name: 'NonProduction', value: 'NonProduction' },
			{ name: 'Attended', value: 'Attended' },
			{ name: 'Unattended', value: 'Unattended' },
			{ name: 'Development', value: 'Development' },
			{ name: 'Studio', value: 'Studio' },
			{ name: 'RpaDeveloper', value: 'RpaDeveloper' },
			{ name: 'StudioX', value: 'StudioX' },
			{ name: 'CitizenDeveloper', value: 'CitizenDeveloper' },
			{ name: 'Headless', value: 'Headless' },
			{ name: 'StudioPro', value: 'StudioPro' },
			{ name: 'RpaDeveloperPro', value: 'RpaDeveloperPro' },
			{ name: 'TestAutomation', value: 'TestAutomation' },
			{ name: 'AutomationCloud', value: 'AutomationCloud' },
			{ name: 'Serverless', value: 'Serverless' },
			{ name: 'AutomationKit', value: 'AutomationKit' },
			{ name: 'ServerlessTestAutomation', value: 'ServerlessTestAutomation' },
			{ name: 'AutomationCloudTestAutomation', value: 'AutomationCloudTestAutomation' },
			{ name: 'AttendedStudioWeb', value: 'AttendedStudioWeb' },
			{ name: 'Hosting', value: 'Hosting' },
			{ name: 'AssistantWeb', value: 'AssistantWeb' },
			{ name: 'ProcessOrchestration', value: 'ProcessOrchestration' },
			{ name: 'AgentService', value: 'AgentService' },
			{ name: 'AppTest', value: 'AppTest' },
			{ name: 'PerformanceTest', value: 'PerformanceTest' },
			{ name: 'BusinessRule', value: 'BusinessRule' },
			{ name: 'CaseManagement', value: 'CaseManagement' },
		],
		default: 'Unattended',
		description: 'Filter by runtime type (optional)',
	},

	// ==================== Get Machine Sessions ====================
	{
		displayName: 'Machine ID',
		name: 'machineId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['sessions'],
				operation: ['getMachineSessions'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the machine to get sessions from',
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
				resource: ['sessions'],
				operation: ['getMachineSessions'],
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
				resource: ['sessions'],
				operation: ['getMachineSessions'],
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
				resource: ['sessions'],
				operation: ['getUsernames'],
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
				resource: ['sessions'],
				operation: ['getUsernames'],
			},
		},
		default: 50,
		description: 'Maximum number of results',
	},

	// ==================== Set Maintenance Mode ====================
	{
		displayName: 'Host Name',
		name: 'hostName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['sessions'],
				operation: ['setMaintenanceMode'],
			},
		},
		default: '',
		required: true,
		description: 'Name of the machine/host',
	},
	{
		displayName: 'Maintenance Mode',
		name: 'maintenanceMode',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['sessions'],
				operation: ['setMaintenanceMode'],
			},
		},
		default: true,
		required: true,
		description: 'Enable or disable maintenance mode',
	},
	{
		displayName: 'Allowed Robot Types',
		name: 'allowedRobotTypes',
		type: 'string',
		typeOptions: {
			alwaysOpenEditWindow: true,
		},
		displayOptions: {
			show: {
				resource: ['sessions'],
				operation: ['setMaintenanceMode'],
			},
		},
		default: '[]',
		description: 'JSON array of robot types allowed during maintenance',
	},
];
