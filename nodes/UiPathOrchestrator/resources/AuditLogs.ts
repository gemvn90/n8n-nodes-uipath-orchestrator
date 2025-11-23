import { INodeProperties } from 'n8n-workflow';

export const auditLogsOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['auditLogs'],
			},
		},
		options: [
			{
				name: 'Get Audit Logs',
				value: 'getAll',
				action: 'Get audit logs',
				description: 'List audit logs with filtering and pagination',
			},
			{
				name: 'Export Audit Logs',
				value: 'export',
				action: 'Export audit logs to CSV',
				description: 'Export audit logs to CSV file',
			},
			{
				name: 'Get Audit Log Details',
				value: 'getDetails',
				action: 'Get audit log details',
				description: 'Get detailed information about a specific audit log entry',
			},
		],
		default: 'getAll',
	},
];

export const auditLogsFields: INodeProperties[] = [
	// getAll fields
	{
		displayName: 'Audited Service',
		name: 'auditedService',
		type: 'options',
		displayOptions: {
			show: {
				resource: ['auditLogs'],
				operation: ['getAll', 'export', 'getDetails'],
			},
		},
		options: [
			{
				name: 'Orchestrator',
				value: 'Orchestrator',
			},
			{
				name: 'Test Automation',
				value: 'TestAutomation',
			},
		],
		default: 'Orchestrator',
		description: 'Service to audit',
	},
	{
		displayName: 'Filter',
		name: 'filter',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['auditLogs'],
				operation: ['getAll', 'export'],
			},
		},
		default: '',
		placeholder: "CreationTime gt 2024-11-20 and Action eq 'Create'",
		description: 'OData filter expression',
	},
	{
		displayName: 'Select',
		name: 'select',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['auditLogs'],
				operation: ['getAll'],
			},
		},
		default: '',
		placeholder: 'Id,UserId,Action,Entity,CreationTime',
		description: 'Select specific properties',
	},
	{
		displayName: 'Order By',
		name: 'orderBy',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['auditLogs'],
				operation: ['getAll'],
			},
		},
		default: 'CreationTime desc',
		placeholder: 'CreationTime desc',
		description: 'Sort order (e.g., CreationTime desc)',
	},
	{
		displayName: 'Top',
		name: 'top',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['auditLogs'],
				operation: ['getAll'],
			},
		},
		default: 100,
		description: 'Max results to return (1-1000)',
	},
	{
		displayName: 'Skip',
		name: 'skip',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['auditLogs'],
				operation: ['getAll'],
			},
		},
		default: 0,
		description: 'Number of results to skip',
	},
	{
		displayName: 'Expand',
		name: 'expand',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['auditLogs'],
				operation: ['getAll'],
			},
		},
		default: '',
		placeholder: 'User,Entity',
		description: 'Expand related entities',
	},
	{
		displayName: 'Count',
		name: 'count',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['auditLogs'],
				operation: ['getAll'],
			},
		},
		default: false,
		description: 'Include total count in response',
	},
	// export fields
	{
		displayName: 'Export Name',
		name: 'exportName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['auditLogs'],
				operation: ['export'],
			},
		},
		default: 'audit-export',
		description: 'Name for the export file',
	},
	// getDetails fields
	{
		displayName: 'Audit Log ID',
		name: 'auditLogId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['auditLogs'],
				operation: ['getDetails'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the audit log entry',
	},
];
